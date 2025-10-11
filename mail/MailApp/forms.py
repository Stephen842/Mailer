from django import forms
from tinymce.widgets import TinyMCE
from phonenumber_field.formfields import PhoneNumberField
from .models import Subscriber, Campaign, TelegramCampaign

class SubscriberForm(forms.ModelForm):
    class Meta:
        model = Subscriber
        fields = ['email']

class MultiEmailForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super(MultiEmailForm,self).__init__(*args, **kwargs)
        for i in range(1, 51):
            self.fields[f'email_{i}'] = forms.EmailField(required=False)

    def clean(self):
        cleaned_data = super().clean()
        self.valid_emails = []

        for field in self.fields:
            email = cleaned_data.get(field)
            if email:
                if not Subscriber.objects.filter(email=email).exists():
                    self.valid_emails.append(email)

        return cleaned_data

    def get_emails(self):
        return getattr(self, 'valid_emails', [])

class CampaignForm(forms.ModelForm):
    class Meta:
        model = Campaign
        fields = ['subject', 'body']
        widgets = {
            'body': TinyMCE(attrs={'cols': 70, 'rows': 20}),
        }

class SendMessageForm(forms.Form):
    subject = forms.CharField(max_length=255)
    body = forms.CharField(widget=TinyMCE(attrs={'cols': 70, 'rows': 20}))


class TelegramCampaignForm(forms.ModelForm):
    class Meta:
        model = TelegramCampaign
        fields = ['title', 'message']
        widgets = {
            'message': TinyMCE(attrs={'cols': 70, 'rows': 20}),
        }