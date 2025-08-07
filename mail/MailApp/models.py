from django.db import models
from tinymce.models import HTMLField
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    date_subscribed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Campaign(models.Model):
    subject = models.CharField(max_length=255)
    body = HTMLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject
    
class SiteStats(models.Model):
    visit_count = models.IntegerField(default=0)

    def increment_visit(self):
        self.visit_count += 1
        self.save(update_fields=["visit_count"])

class WhatsappContact(models.Model):
    name = models.CharField(max_length=100)
    phone_number = PhoneNumberField(unique=True)
    created_at  = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.name} - {self.phone_number}"
    
class WhatsappMessage(models.Model):
    message = models.TextField()
    created_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Message from {self.created_at.strftime('%Y-%m-%d %H:%M')}"