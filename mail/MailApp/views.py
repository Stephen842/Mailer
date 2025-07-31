from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone

from .models import Subscriber, Campaign, SiteStats
from .forms import SubscriberForm, CampaignForm

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
        'title': 'Testing',
    }

    return render(request, 'pages/create_campaign.html', context)

def send_campaign(request, campaign_id):
    """Send a campaign to all subscribers."""
    campaign = get_object_or_404(Campaign, id=campaign_id)
    subscribers = Subscriber.objects.all()
    emails = [s.email for s in subscribers]

    send_mail(
        subject=campaign.subject,
        message=campaign.body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=emails,
        fail_silently=False,
    )

    context = {
        'campaign': campaign,
        'emails': emails,
    }
    
    return render(request, 'pages/send_success.html', context)


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