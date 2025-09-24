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
from django.contrib import messages
from django.db.models import Count, Sum, Q
from django.core.paginator import Paginator

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
        static_rates = {'NGN': 1600, 'GHS': 16, 'ZAR': 18, 'XOF': 600, 'KES': 150, 'EGP': 50, 'USD': 1}
        return round(amount_usd * static_rates.get(target_currency, 1), 2)

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

        # Generate and save your own merchant reference
        reference = f'FutureOfWork-{subscription.pk}-{int(time.time())}'
        subscription.transaction_id = reference
        subscription.save()

        # Get user's country → currency
        user_country = (subscription.country.code if subscription.country else 'US').upper()

        target_currency = 'NGN'

        # Convert USD → local currency
        local_amount = convert_usd_to_local(subscription.fee, target_currency)
        amount_kobo = int(local_amount * 100)  # Paystack expects amount in kobo

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
        }

        payload = {
            'email': subscription.email,
            'amount': amount_kobo,
            'reference': reference,
            'currency': target_currency,
            'callback_url': request.build_absolute_uri(
                reverse('processing_payment', args=[subscription.pk])
            ),
            'cancelUrl': request.build_absolute_uri(
                reverse("subscription_failed", args=[subscription.pk])
            ),
            'metadata': {
                'subscription_id': subscription.pk,
                'plan': subscription.plan_preference,
                'name': subscription.name,
                'country': user_country,
            },
        }

        try:
            resp = requests.post('https://api.paystack.co/transaction/initialize', headers=headers, json=payload, timeout=120)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            messages.error(request, f'Paystack request failed: {str(e)}')
            return redirect('subscription_failed', pk=subscription.pk)

        if data.get('status') and data['data'].get('authorization_url'):
            subscription.checkout_url = data['data']['authorization_url']
            subscription.save()
            return redirect(data['data']['authorization_url'])
        else:
            error_message = data.get('message', 'Unable to initialize Paystack transaction')
            subscription.status = 'failed'
            subscription.save()
            messages.error(request, f'Payment initialization failed: {error_message}')
            return redirect('subscription_failed', pk=subscription.pk)


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
    

def verify_paystack_signature(request):
    paystack_signature = request.headers.get('X-Paystack-Signature')
    if not paystack_signature:
        return False

    computed_signature = hmac.new(
        key=bytes(settings.PAYSTACK_SECRET_KEY, 'utf-8'),
        msg=request.body,
        digestmod=hashlib.sha512
    ).hexdigest()

    return hmac.compare_digest(computed_signature, paystack_signature)

@csrf_exempt
def paystack_webhook(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    # Verify signature first
    if not verify_paystack_signature(request):
        return JsonResponse({'error': 'Invalid Signature'}, status=403)
    try:
        payload = json.loads(request.body)
        event = payload.get('event')
        data = payload.get('data')

        # Get user subscription via reference 
        reference = data.get('reference')
        if not reference:
            return JsonResponse({'status': 'ignored', 'reason': 'No reference found'})
        
        subscription = Future_Of_Work.objects.filter(transaction_id=reference).first()
        if not subscription:
            return JsonResponse({'status': 'ignored', 'reason': 'Subscription not found'})

        # Idempotency check
        if subscription.transaction_id == reference and subscription.status in ['active', 'failed']:
            return JsonResponse({'status': 'Already processed'})

        # Update subscription status
        if event == 'charge.success':
            subscription.status = 'active'

        elif event == 'charge.failed':
            subscription.status = 'failed'

        elif event == 'charge.refunded':
            subscription.status = 'pending'

        else:
            print(f"Unhandled event: {event}")
            return JsonResponse({'status': 'unhandled'})

        # Update timestamp if available
        created_at = data.get('created_at')
        if created_at:
            subscription.created_at = parse_datetime(created_at)
        else:
            subscription.created_at = now()

        subscription.transaction_id = reference
        subscription.save()

        return JsonResponse({'status': 'ok'})
        
    except Exception as e:
        print('Paystack Webhook Error:', str(e))
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

def currency_not_supported(request, pk):
    subscription = get_object_or_404(Future_Of_Work, pk=pk)
    context = {
        "title": "Currency Not Supported",
        "subscription": subscription,
    }
    return render(request, 'pages/currency_not_supported.html', context)


def admin_dashboard(request, username):
    total_users = Future_Of_Work.objects.count()
    active_users = Future_Of_Work.objects.filter(status='active').count()
    pending_users = Future_Of_Work.objects.filter(status='pending').count()
    failed_users = Future_Of_Work.objects.filter(status='failed').count()

    revenue_active = Future_Of_Work.objects.filter(status='active').aggregate(total=Sum('fee'))['total'] or Decimal('0.00')
    revenue_pending = Future_Of_Work.objects.filter(status='pending').aggregate(total=Sum('fee'))['total'] or Decimal('0.00')
    revenue_failed = Future_Of_Work.objects.filter(status='failed').aggregate(total=Sum('fee'))['total'] or Decimal('0.00')
    total_revenue = Future_Of_Work.objects.aggregate(total=Sum('fee'))['total'] or Decimal('0.00')

    ### Breakdown Statistics
    course_breakdown = (
        Future_Of_Work.objects.values('course_type').annotate(count=Count('id')).order_by('-count')
    )

    plan_breakdown = (
        Future_Of_Work.objects.values('plan_preference').annotate(count=Count('id')).order_by('-count')
    )

    gateway_breakdown = (
        Future_Of_Work.objects.values('gateway').annotate(count=Count('id')).order_by('-count')
    )

    context = {
        'total_users': total_users,
        'active_users': active_users,
        'pending_users': pending_users,
        'failed_users': failed_users,

        'total_revenue': total_revenue,
        'revenue_active': revenue_active,
        'revenue_pending': revenue_pending,
        'revenue_failed': revenue_failed,

        'course_breakdown': course_breakdown,
        'plan_breakdown': plan_breakdown,
        'gateway_breakdown': gateway_breakdown,
        'title': 'Future Of Work – Admin Dashboard'
    }
    return render(request, 'pages/admin_dashboard.html', context)

def admin_student(request, username):
    students = Future_Of_Work.objects.all()

    ### ---Search functionality ---
    query = request.GET.get('q', '')
    if query:
        students = students.filter(
            Q(name__icontains=query) |
            Q(email__icontains=query) | 
            Q(phone__icontains=query) |
            Q(course_type__icontains=query) |
            Q(plan_preference__icontains=query)
        )

    ### --- Filter by plan ---
    plan = request.GET.get('plan', '')
    if plan in ['basic', 'pro', 'exclusive']:
        students = students.filter(plan_preference=plan)

    ### --- Filter by payment status ---
    status = request.GET.get('status', '')
    if status in ['active', 'pending', 'failed']:
        students = students.filter(status=status)

    ### --- Filter by course choice ---
    course = request.GET.get('course', '')
    if course in ['web3', 'dao', 'metaverse', 'blockchain']:
        students = students.filter(course_type=course)

    ### --- Filter by student level ---
    grading = request.GET.get('grading', '')
    if grading in ['beginner', 'intermediate', 'advanced']:
        students = students.filter(expertise=grading)

    ### --- Bulk action ---
    if request.method == 'POST':
        selected_ids = request.POST.getlist('selected')
        action = request.POST.get('action')
        selected_students = Future_Of_Work.objects.filter(id__in=selected_ids)

        if action == 'delete':
            count, _ = selected_students.delete()
            messages.success(request, f'{count} student(s) deleted successfully.')

        elif action == 'mark_active':
            selected_students.update(status='active')
            messages.success(request, f'{selected_students.count()} student(s) marked as active.')

        return redirect('admin_student', username=request.user.username)

    ### --- Pagination ---
    paginator = Paginator(students, 25)
    page_number = request.GET.get('page')
    students_page = paginator.get_page(page_number)

    context = {
        'students': students_page,
        'title': 'Future Of Work – Student Management Dashboard'
    }

    return render(request, 'pages/admin_student.html', context)

def student_detail(request, pk, name, username):
    user = get_object_or_404(Future_Of_Work, id=pk, name=name)

    # fetch all records for a user through email
    user_payments = Future_Of_Work.objects.filter(email=user.email).order_by("-created_at")

    context ={
        'user': user,
        'user_payments': user_payments,
        'title': f'Future Of Work - {user.name}',
    }
    return render(request, 'pages/student_detail.html', context)