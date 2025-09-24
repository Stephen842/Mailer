from django.urls import path
from . import views

urlpatterns = [
    path('future-of-work/subscribe/', views.future_of_work, name='future_of_work_subscribe'),
    path('registration/success/<int:pk>/', views.future_of_work_subscription_success, name='subscription_success'),
    path('registration/failed/<int:pk>/', views.future_of_work_subscription_cancel, name='subscription_failed'),
    path("subscribe/payment/<int:pk>/", views.payment_selection, name="payment_selection"),
    path("start-payment/<int:pk>/<str:gateway>/", views.start_payment, name="start_payment"),

    path('future-of-work/webhooks/helio/', views.helio_webhook, name='helio_webhook'),
    path('future-of-work/webhooks/opay/', views.opay_webhook, name='opay_webhook'),
    path('future-of-work/webhooks/paystack/', views.paystack_webhook, name='paystack_webhook'),

    path('subscription/<int:pk>/processing/', views.processing_payment, name='processing_payment'),
    path('subscription/<int:pk>/check-status/', views.check_subscription_status, name='check_subscription_status'),

    path('future-of-work/subscribe/<int:pk>/currency_not_supported/', views.currency_not_supported, name='currency_not_supported'),

    path('dashboard/<str:username>/', views.admin_dashboard, name='admin_dashboard'),
    path('dashboard/<str:username>/student/overview', views.admin_student, name='admin_student'),
    path('dashboard/<str:username>/student/<str:name>/<int:pk>/', views.student_detail, name='student_detail'),
]