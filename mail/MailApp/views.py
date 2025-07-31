from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.conf import settings

from .models import Subscriber, Campaign
from .forms import SubscriberForm, CampaignForm

def add_subscriber(request):
    """Handle adding a new subscriber email."""
    if request.method == 'POST':
        form = SubscriberForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('add_subscriber')
    else:
        form = SubscriberForm()

    context = {
        'form': form,
        'title': 'Subscribe for Exclusive Updates & Insights',
    }

    return render(request, 'pages/add_subscriber.html', context)

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