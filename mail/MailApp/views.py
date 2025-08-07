from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone
from django.contrib import messages

from .models import Subscriber, Campaign, SiteStats, WhatsappContact, WhatsappMessage
from .forms import SubscriberForm, MultiEmailForm, CampaignForm, SendMessageForm, WhatsappContactForm, WhatsappMessageForm

def add_subscriber(request):
    """Handle adding a new subscriber email."""
    if request.method == 'POST':
        form = SubscriberForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('subscribe_success')
    else:
        form = SubscriberForm()

    # Count visit only once every 10 seconds per user session
    stats, created = SiteStats.objects.get_or_create(pk=1)

    last_visit = request.session.get('last_visit')
    now = timezone.now()
    threshold = timedelta(seconds=10)

    if not last_visit or (now - timezone.datetime.fromisoformat(last_visit)) > threshold:
        stats.increment_visit()
        request.session['last_visit'] = now.isoformat()

    context = {
        'form': form,
        'title': 'Subscribe for Exclusive Updates & Insights',
    }

    return render(request, 'pages/add_subscriber.html', context)

def subscribe_success(request):
    """Render a nice subscription success page."""
    return render(request, 'pages/subscribe_success.html')


def dashboard(request):
    stats = SiteStats.objects.first()
    if stats:
        visit_count = stats.visit_count
    else:
        visit_count = 0

    total_subscribers = Subscriber.objects.count()
    total_campaigns = Campaign.objects.count()
    total_visitors = visit_count 

    # Greeetings 
    current_hour = datetime.now().hour
    if current_hour < 12:
        greeting = "Good Morning"
    elif current_hour < 16:
        greeting = "Good Afternoon"
    else:
        greeting = "Good Evening"

    context = {
        'total_subscribers': total_subscribers,
        'total_campaigns': total_campaigns,
        'total_visitors': total_visitors,
        'greeting': greeting,
        'title': 'Admin Dashboard | Mailer',
    }

    return render(request, 'pages/dashboard.html', context)

def subscriber_list(request):
    """Subscriber List Page"""
    subscribers = Subscriber.objects.all().order_by('date_subscribed')

    context = {
        'subscribers': subscribers,
        'title': 'Subscriber List | Mailer',
    }

    return render(request, 'pages/subscriber_list.html', context)

def admin_add_subscriber(request):
    """Handle adding a new subscriber email from the admin dashboard"""
    if request.method == 'POST':
        form = MultiEmailForm(request.POST)
        if form.is_valid():
            emails = form.get_emails()
            added, skipped = 0, 0
            for email in emails:
                _, created = Subscriber.objects.get_or_create(email=email)
                if created:
                    added += 1
                else:
                    skipped +=1
            messages.success(request, f'Added {added} new subscribers. Skipped {skipped} already existing')
            return redirect('subscriber_list')
    else:
        form = MultiEmailForm()

    context = {
        'form': form,
        'title': 'Add New Subscriber | Mailer',
    }

    return render(request, 'pages/admin_add_subscriber.html', context)

def delete_subscriber(request, pk):
    """Handles deleting subscribers"""
    subscriber = get_object_or_404(Subscriber, pk=pk)
    subscriber.delete()
    messages.success(request, f'Deleted Subscriber: {subscriber.email}')
    return redirect('subscriber_list')

def send_message(request, pk):
    """Handles sending sending messages to specific contact"""
    subscriber = get_object_or_404(Subscriber, pk=pk)

    if request.method == 'POST':
        form = SendMessageForm(request.POST)
        if form.is_valid():
            subject = form.cleaned_data['subject']
            body = form.cleaned_data['body']

            html_message = render_to_string(
                'pages/base_email.html',
                {
                    'subject': subject,
                    'body': body
                }
            )
            plain_message = strip_tags(html_message)

            email = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[subscriber.email],
            )
            email.attach_alternative(html_message, 'text/html')
            email.send(fail_silently=False)
            messages.success(request, f'Message Sent to {subscriber.email}')
            return redirect('subscriber_list')
    else:
        form = SendMessageForm()
    
    context = {
        'subscriber': subscriber,
        'form': form,
        'title': f'Send Message to {subscriber.email}'
    }

    return render(request, 'pages/send_message.html', context)

def campaign_list(request):
    """Campaign List Page"""
    campaigns = Campaign.objects.all().order_by('created_at')

    context = {
        'campaigns': campaigns,
        'title': 'Campaign List | Mailer',
    }

    return render(request, 'pages/campaign_list.html', context)

def create_campaign(request):
    """Handle drafting a new email campaign."""
    if request.method == 'POST':
        form = CampaignForm(request.POST)
        if form.is_valid():
            campaign = form.save()
            return redirect('send_campaign', campaign_id=campaign.id)
    else:
        form = CampaignForm()

    context = {
        'form': form,
        'title': 'Create Email Campaign',
    }

    return render(request, 'pages/create_campaign.html', context)

def send_campaign(request, campaign_id):
    """Send a campaign to all subscribers."""
    campaign = get_object_or_404(Campaign, id=campaign_id)
    subscribers = Subscriber.objects.all()
    emails = [s.email for s in subscribers]

    html_message = render_to_string(
        'pages/base_email.html',
        {
            'subject': campaign.subject,
            'body': campaign.body
        }
    )
    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        subject=campaign.subject,
        body=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=emails,
    )
    email.attach_alternative(html_message, 'text/html')
    email.send(fail_silently=False)

    context = {
        'campaign': campaign,
        'emails': emails,
        'title': 'Campaign Successfully Sent | Mailer'
    }
    
    return render(request, 'pages/send_success.html', context)

def campaign_view(request, pk):
    """Render a nice campaign view page."""
    campaign = get_object_or_404(Campaign, pk=pk)
    
    context = {
        'campaign': campaign,
        'title': f'{campaign.subject} | Mailer'
    }
    return render(request, 'pages/campaign_view.html', context)

def delete_campaign(request, pk):
    """Handles deleting subscribers"""
    campaign = get_object_or_404(Campaign, pk=pk)
    campaign.delete()
    messages.success(request, f'Deleted campaign: {campaign.subject}')
    return redirect('campaign_list')

def contact_list(request):
    """Contact List Page"""
    contacts = WhatsappContact.objects.all().order_by('created_at')

    context = {
        'contacts': contacts,
        'title': 'Contact List | Mailer',
    }

    return render(request, 'pages/contact_list.html', context)

def create_contact(request):
    """Handle adding of contact."""
    if request.method == 'POST':
        form = WhatsappContactForm(request.POST)
        if form.is_valid():
            form.save_contact()
            messages.success(request, "Contacts added successfully!")
            return redirect('contact_list')
    else:
        form = WhatsappContactForm()

    context = {
        'form': form,
        'title': 'Create New Contact | Mailer',
    }

    return render(request, 'pages/create_contact.html', context)

def delete_contact(request, pk):
    """Handles deleting contact"""
    contact = get_object_or_404(WhatsappContact, pk=pk)
    contact.delete()
    messages.success(request, f'Deleted campaign: {contact.name}')
    return redirect('contact_list')

def send_whatsapp_message(request):
    if request.method == 'POST':
        form = WhatsappMessageForm(request.POST)
        if form.is_valid():
            message_instance = form.save()

            contacts = WhatsappContact.objects.all()
            for contact in contacts:
                personalized_message = message_instance.message.replace('{{name}}', contact.name)

            messages.success(request, 'WhatsApp Campaign Sent Successfully')
            return redirect('contact_list')
        
    else:
        form = WhatsappMessageForm()

    context = {
        'form': form,
        'title': 'Send WhatsApp Campaign',
    }

    return render(request, 'pages/send_whatsapp.html', context)