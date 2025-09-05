from django.db import models
from tinymce.models import HTMLField
from phonenumber_field.modelfields import PhoneNumberField
from decimal import Decimal

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
 
    
class Future_Of_Work(models.Model):
    COURSE_CHOICES = [
        ('', 'Select course type...'),
        ('web3', 'Web3 Fundamentals'),
        ('dao', 'DAO Governance'),
        ('metaverse', 'Metaverse Collaboration'),
        ('blockchain', 'Blockchain Development'),
    ]

    PLAN_CHOICES = [
        ('', 'Select plan...'),
        ('basic', 'Basic Plan'),
        ('pro', 'Pro Plan'),
        ('exclusive', 'Exclusive'),
    ]

    EXPERTISE_CHOICES = [
        ('', 'Select your level...'),
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("failed", "Failed"),
    ]

    PAYMENT_GATEWAYS = [
        ("helio", "Helio"),
        ("remita", "Remita"),
        ("opay", "OPay"),
    ]

    PLAN_FEES = {
        'basic': Decimal("0.00"),
        'pro': Decimal("1000.00"),
        'exclusive': Decimal("2000.00")
    }
    

    name = models.CharField(max_length=50)
    email = models.EmailField(
        blank=False,
        unique=True, 
        error_messages={
            'unique': "Email Address already exists."
        }
    )
    phone = PhoneNumberField(
        unique=True, 
        error_messages={
            'unique': "Phone number already exists."
        }
    )
    course_type = models.CharField(max_length=20, choices=COURSE_CHOICES, default="")
    plan_preference = models.CharField(max_length=20, choices=PLAN_CHOICES, default="")
    expertise = models.CharField(max_length=20, choices=EXPERTISE_CHOICES, default="")
    transaction_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    checkout_url = models.URLField(null=True, blank=True)

    fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    gateway = models.CharField(max_length=20, choices=PAYMENT_GATEWAYS, blank=True, null=True)

    def save(self, *args, **kwargs):
        """Automatically assign fee based on selected plan."""
        self.fee = self.PLAN_FEES.get(self.plan_preference, Decimal("0.00"))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.course_type}"