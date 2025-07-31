from django import forms
from .models import Subscriber, Campaign

class SubscriberForm(forms.ModelForm):
    class Meta:
        model = Subscriber
        fields = ['email']

class CampaignForm(forms.ModelForm):
    class Meta:
        Model = Campaign
        fields = ['subject', 'body']