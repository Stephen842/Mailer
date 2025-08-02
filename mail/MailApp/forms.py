from django import forms
from .models import Subscriber, Campaign

class SubscriberForm(forms.ModelForm):
    class Meta:
        model = Subscriber
        fields = ['email']

class CampaignForm(forms.ModelForm):
    class Meta:
        model = Campaign
        fields = ['subject', 'body']

class SendMessageForm(forms.Form):
    subject = forms.CharField(max_length=255)
    body = forms.CharField(widget=forms.Textarea)