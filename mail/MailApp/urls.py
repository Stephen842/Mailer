from django.urls import path
from . import views

urlpatterns = [
    path('', views.add_subscriber, name='add_subscriber'),
    path('subscribe/success/', views.subscribe_success, name='subscribe_success'),
    path('dashboard/admin', views.dashboard, name='dashboard'),
    
    path('subscribers/', views.subscriber_list, name='subscriber_list'),
    path('subscribers/admin/add/', views.admin_add_subscriber, name='admin_add_subscriber'),
    path('subscribers/<int:pk>/delete', views.delete_subscriber, name='delete_subscriber'),
    path('subscribers/<int:pk>/send/', views.send_message, name='send_message'),
    
    path('campaigns/', views.campaign_list, name='campaign_list'),
    path('campaign/create/', views.create_campaign, name='create_campaign'),
    path('campaign/send/<int:campaign_id>/', views.send_campaign, name='send_campaign'),
    path('campaign/<int:pk>/', views.campaign_view, name='campaign_view'),
    path('campaign/<int:pk>/delete', views.delete_campaign, name='delete_campaign'),
    
    path('contacts/', views.contact_list, name='contact_list'),
    path('contact/create/', views.create_contact, name='create_contact'),
    path('contacts/<int:pk>/delete', views.delete_contact, name='delete_contact'),
    path('contact/send/', views.send_whatsapp_message, name='send_whatsapp_message'),

    path('tinymce-upload/', views.tinymce_upload, name='tinymce_upload'),

    path('future-of-work/subscribe/', views.future_of_work, name='future_of_work_subscribe'),
    path('registration/success/<int:pk>/', views.future_of_work_subscription_success, name='subscription_success'),
    path('registration/failed/<int:pk>/', views.future_of_work_subscription_cancel, name='subscription_failed'),
    path("subscribe/payment/<int:pk>/", views.payment_selection, name="payment_selection"),
    path("start-payment/<int:pk>/<str:gateway>/", views.start_payment, name="start_payment"),

    path('future-of-work/webhooks/helio/', views.helio_webhook, name='helio_webhook'),
    path('future-of-work/webhooks/opay/', views.opay_webhook, name='opay_webhook'),

    path('subscription/<int:pk>/processing/', views.processing_payment, name='processing_payment'),
    path('subscription/<int:pk>/check-status/', views.check_subscription_status, name='check_subscription_status'),
]