from django import forms
from .models import Future_Of_Work

class FutureOfWorkForm(forms.ModelForm):
    class Meta:
        model = Future_Of_Work
        fields = '__all__'
        exclude = ['fee', 'gateway', 'status']