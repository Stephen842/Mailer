from django import forms
from tinymce.widgets import TinyMCE
from phonenumber_field.formfields import PhoneNumberField
from .models import Subscriber, Campaign, WhatsappContact, WhatsappMessage, Future_Of_Work

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


class WhatsappContactForm(forms.ModelForm):
    class Meta:
        model = WhatsappContact
        fields = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for i in range(1, 21):
            self.fields[f'name_{i}'] = forms.CharField(required=False, label=f'Name {i}')
            self.fields[f'phone_{i}'] = PhoneNumberField(required=False, label=f'Phone Number {i}')

    @property
    def name_phone_pairs(self):
        pairs = []
        for i in range(1, 21):
            name_field = self[f'name_{i}']
            phone_field = self[f'phone_{i}']
            pairs.append((name_field, phone_field))
        return pairs

    def clean(self):
        cleaned_data = super().clean()
        self.valid_contacts = []

        for i in range(1, 21):
            name = cleaned_data.get(f'name_{i}')
            phone = cleaned_data.get(f'phone_{i}')

            if name and phone:
                if not WhatsappContact.objects.filter(phone_number=phone).exists():
                    self.valid_contacts.append({'name': name, 'phone_number': phone})

        return cleaned_data

    def save_contact(self):
        return WhatsappContact.objects.bulk_create(
            [WhatsappContact(name=entry['name'], phone_number=entry['phone_number']) for entry in self.valid_contacts]
        )

class WhatsappMessageForm(forms.ModelForm):
    class Meta:
        model = WhatsappMessage
        fields = '__all__'

class FutureOfWorkForm(forms.ModelForm):
    class Meta:
        model = Future_Of_Work
        fields = '__all__'
        exclude = ['fee', 'gateway']