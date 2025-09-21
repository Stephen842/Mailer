from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from decimal import Decimal
from django_countries.fields import CountryField

# Create your models here.
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
        ("paystack", "Paystack"),
        ("opay", "OPay"),
    ]

    PLAN_FEES = {
        'basic': Decimal("0.00"),
        'pro': Decimal("2.00"),
        'exclusive': Decimal("20.00")
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
    country = CountryField(blank_label='Select your country')
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