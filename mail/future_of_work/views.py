from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.utils.timezone import now
from django.utils.dateparse import parse_datetime
from dateutil import parser
import json, hmac, hashlib, requests, time
from decimal import Decimal
from django.urls import reverse

from .models import  Future_Of_Work
from .forms import FutureOfWorkForm

# Create your views here.
def future_of_work(request):
    if request.method == 'POST':
        form = FutureOfWorkForm(request.POST)
        if form.is_valid():
            subscription = form.save(commit=False)

            # default status: pending
            subscription.status = 'pending'
            subscription.save()

            # redirect depending on plan fee
            if subscription.fee == Decimal("0.00"):
                subscription.status = 'active'
                subscription.save()
                return redirect('subscription_success', pk=subscription.id)  # free → success
            else:
                return redirect('payment_selection', pk=subscription.id)  # paid → payment page
    else:
        form = FutureOfWorkForm()

    context = {
        'form': form,
        'plan_fees': Future_Of_Work.PLAN_FEES,
        'title': 'Subscription Form | Future of Work',
    }

    return render(request, 'pages/future.html', context)

def future_of_work_subscription_success(request, pk):
    subscription = None
    if pk:
        subscription = Future_Of_Work.objects.get(pk=pk)
    context = {
        'subscription': subscription,
        'title': 'Subscription Confirmed | Future of Work',
    }
    return render(request, 'pages/subscription_success.html', context)

def future_of_work_subscription_cancel(request, pk):
    subscription = None
    if pk:
        subscription = Future_Of_Work.objects.get(pk=pk)
    context = {
        'subscription': subscription,
        'title': 'Subscription Failed | Future of Work',
    }
    return render(request, 'pages/subscription_failed.html', context)

def payment_selection(request, pk):
    subscription = Future_Of_Work.objects.get(pk=pk)

    payment_methods = [
        {
            'name': 'Helio', 
            'description': 'Pay easily with crypto across multiple blockchains, using a fast and secure checkout experience.',
            'image_url': 'helio.png'
        },
        {
            'name': 'Paystack', 
            'description': 'Accept secure payments via cards, bank transfers, USSD, and mobile money across Africa.',
            'image_url': 'paystack.png'
        },
        {
            'name': 'Opay', 
            'description': 'A simple and reliable mobile wallet for instant transfers, card payments, and everyday bills.',
            'image_url': 'opay.png'
        },
    ]

    context = {
        'subscription': subscription,
        'payment_methods': payment_methods,
        'title': f"Payment Selection | {subscription.plan_preference.title()} Plan",
    }
    return render(request, 'pages/payment_selection.html', context)

def convert_usd_to_local(amount_usd, target_currency="NGN"):
    """
    Convert USD to target currency using exchangerate.host API.
    Fallback to static rate if API fails.
    """
    try:
        url = f"https://api.exchangerate.host/convert?from=USD&to={target_currency}&amount={amount_usd}"
        response = requests.get(url, timeout=10)
        data = response.json()
        return round(data["result"], 2)
    except Exception:
        # fallback if API fails (set your safe static rate here)
        static_rates = {"NGN": 1600, "EGP": 50}
        return round(amount_usd * static_rates.get(target_currency, 50), 2)

def start_payment(request, pk, gateway):
    subscription = get_object_or_404(Future_Of_Work, pk=pk)
    subscription.gateway = gateway
    subscription.save()

    if gateway == 'helio':
        # Show our custom Helio checkout page with the JS widget
        context = {
           "subscription": subscription,
            "title": "Pay with Helio | Future of Work",
            "user_email": subscription.email,
            "amount": subscription.fee,
            "currency": "USDT",
        }
        return render(request, 'pages/helio_checkout.html', context)     
    
    elif gateway == "paystack":
        # TODO: integrate Remita checkout here
        return HttpResponse("Paystack integration coming soon.")

    elif gateway == "opay":
        # Generate and save your own merchant reference
        reference = f'FutureOfWork-{subscription.pk}-{int(time.time())}'
        subscription.transaction_id = reference
        subscription.save()

        # Convert USD → NGN (or other country’s currency)
        target_currency = "EGP"   # you can later make this dynamic per user’s country
        local_amount = convert_usd_to_local(subscription.fee, target_currency)

        NGROK_URL = "https://08fe5345015d.ngrok-free.app"

        payload = {
            'country': 'EG',
            'reference': reference,
            'amount': {
                'currency': target_currency,
                'total': str(int(local_amount * 100))
            },
            'product': {
                'name': 'Future Of Work',
                'description': subscription.plan_preference,
            },
            'returnUrl': request.build_absolute_uri(
                reverse('processing_payment', args=[subscription.pk])
            ),
            'notifyUrl': f"{NGROK_URL}{reverse('opay_webhook')}",
            'callbackUrl': f"{NGROK_URL}{reverse('opay_webhook')}",
            '''
            'notifyUrl': request.build_absolute_uri(
                reverse('opay_webhook')
            ),
            'callbackUrl': request.build_absolute_uri(
                reverse('opay_webhook')
            ),
            '''
            "cancelUrl": request.build_absolute_uri(
                reverse("subscription_failed", args=[subscription.pk])
            ),
            "evokeOpay": False,
            "customerVisitSource": "BROWSER",
            "expireAt": 30,
            'userInfo': {
                'userid': str(subscription.pk),
                'userEmail': subscription.email,
                "userName": subscription.name,
                "userMobile": str(subscription.phone),
            },
        }

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {settings.OPAY_PUBLIC_KEY}',
            'MerchantId': settings.OPAY_MERCHANT_ID,
        }
        try:
            url = f'{settings.OPAY_API_URL}/api/v1/international/cashier/create'
            response = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=120,
            )
            response.raise_for_status()
        except requests.RequestException as e:
            return render(request, 'pages/subscription_failed.html', {'error': f'OPay request failed: {e}', 'subscription': subscription})

        try:
            data = response.json()
            print("🔍 OPay Response:", data)  # Debug
        except ValueError:
            return render(request, 'pages/subscription_failed.html', {'error': f'Invalid JSON response from Opay', 'subscription': subscription})
        
        if data.get('code') == '00000':
            cashier_url = data['data'].get('cashierUrl')
            subscription.checkout_url = cashier_url
            subscription.save()
            return redirect(cashier_url)
        else:
            return render(request, 'pages/subscription_failed.html', {
                'error': data.get('message', 'OPay init Failed'),
                'subscription': subscription,
            })

    return render(request, "pages/subscription_failed.html", {"error": "Unsupported payment gateway."})


@csrf_exempt
def helio_webhook(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    try:
        payload = json.loads(request.body)
        print('Webhook Payload', payload) # Debugging

        tx_obj = payload.get('transactionObject', {})
        meta = tx_obj.get('meta', {})
        tx_status = meta.get('transactionStatus', '').lower()
        tx_id = tx_obj.get('id')

        # Get customer email from webhook payload
        customer_email = meta.get('customerDetails', {}).get('email')
        
        if not customer_email:
            print("⚠️ No customer email found in webhook")
            return JsonResponse({'status': 'ignored'})

        subscription = Future_Of_Work.objects.filter(email=customer_email).first()
        if not subscription:
            print(f"⚠️ Subscription with email {customer_email} not found")
            return JsonResponse({'status': 'ignored'})

        # Update subscription based on transaction status
        if tx_status == 'success':
            
            # Idempotency check: if we've already processed this transaction, skip
            if subscription.transaction_id == tx_id:
                return JsonResponse({'status': 'already processed'})
            
            created_at_str = tx_obj.get("createdAt")
            subscription.created_at = (parse_datetime(created_at_str) if created_at_str else now()) # Use Helio timestamp if available   
            subscription.status = 'active'
            subscription.transaction_id = tx_id 
            subscription.save()

        elif tx_status in ('failed', 'cancelled', 'expired'):
            subscription.status = 'failed'
            subscription.transaction_id = tx_id
            subscription.save()

        else:
            print(f"⚠️ Unhandled tx_status: {tx_status}")
            return JsonResponse({'status': 'unhandled'})
        
        return JsonResponse({'status': 'ok'})  

    except Exception as e:
        print('Webhook Error:', str(e))
        return JsonResponse({'status': 'ignored'})
    
@csrf_exempt
def opay_webhook(request):
    """
    OPay webhook handler for General Payment / Express (Cashier) flow.
    Validates payload and updates subscription status.
    """
    if request.method != "POST":
        return JsonResponse({'code': '40001', 'message': 'Invalid method'}, status=405)
    
    try:
        body = json.loads(request.body.decode("utf-8"))
        data = body.get('payload')
        if not data:
            return JsonResponse({'code': '40003', 'message': 'No data in payload'}, status=400)
    except Exception:
        return JsonResponse({'code': '40002', 'message': 'Invalid JSON'}, status=400)

    # --- Get your reference ---
    ref = data.get('reference')
    if not ref:
        return JsonResponse({'code': '40007', 'message': 'No order reference'}, status=400)

    subscription = Future_Of_Work.objects.filter(transaction_id=ref).first()
    if not subscription:
            return JsonResponse({"code": "00000", "message": "SUCCESSFUL"}, status=200)
        
    # Update status
    status = (data.get('status') or '').upper()

    # Idempotency check
    if subscription.status == 'active' and status == "SUCCESS":
        return JsonResponse({'status': 'already processed'})
        
    if status == 'SUCCESS':
        subscription.status = 'active'
    elif status in ['FAILED', 'CANCELLED', 'EXPIRED']:
        subscription.status = 'failed'
    elif status in ['PENDING', 'PROCESSING', 'INITIAL']:
        subscription.status = 'pending'
    else:
        subscription.status = 'pending'
    
    subscription.transaction_id = ref
    
    # --- Update transaction timestamp ---
    def to_datetime(val):
        if not val:
            return now()
        try:
            return datetime.fromtimestamp(int(val)/1000)
        except Exception:
            try:
                # Case: ISO8601 or other datetime string
                return parser.parse(val)
            except Exception:
                # Fallback: current time
                return now()
        
    # Use OPay timestamp if available
    tx_time = data.get("updateTime") or data.get("createdTime") or data.get("transactionTime") or data.get("completedTime")
    subscription.created_at = to_datetime(tx_time) if tx_time else now()
    subscription.save()

    return JsonResponse({"code": "00000", "message": "SUCCESSFUL"}, status=200)


def processing_payment(request, pk):
    subscription = get_object_or_404(Future_Of_Work, pk=pk)
    checkout_url = subscription.checkout_url

    context = {
        "subscription": subscription,
        "checkout_url": checkout_url,
        "title": "Processing Payment | Future of Work"
    }

    return render(request, 'pages/processing_payment.html', context)

def check_subscription_status(request, pk):
    subscription = get_object_or_404(Future_Of_Work, pk=pk)
    return JsonResponse({'status': subscription.status})
