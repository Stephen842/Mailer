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

class PersonalizedEmail(models.Model):
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    body = HTMLField()
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.subject} → {self.subscriber.email}'
    
class SiteStats(models.Model):
    visit_count = models.IntegerField(default=0)

    def increment_visit(self):
        self.visit_count += 1
        self.save(update_fields=['visit_count'])

class TelegramSubscriber(models.Model):
    chat_id = models.CharField(max_length=100, unique=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    joined_at  = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return str(self.chat_id) or self.username
    
class TelegramCampaign(models.Model):
    title = models.CharField(max_length=200)
    message = models.TextField()
    created_at  = models.DateTimeField(auto_now=True)
    sent = models.BooleanField(default=False)

    def __str__(self):
        return self.title