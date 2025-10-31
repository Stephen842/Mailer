from django.urls import path
from . import views

urlpatterns = [
    path('subscribers/add/form', views.add_subscriber, name='add_subscriber'),
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
    
    path('telegram/webhook/', views.telegram_webhook, name='telegram_webhook'),
    path('telegram/campaigns/', views.telegram_campaign_list, name='telegram_campaign_list'),
    path('telegram/campaign/create/', views.create_telegram_campaign, name='create_telegram_campaign'),
    path('telegram/campaigns/send/<int:campaign_id>', views.send_telegram_campaign, name='send_telegram_campaign'),
    path('telegram/campaign/<int:pk>/', views.telegram_campaign_view, name='telegram_campaign_view'),
    path('telegram/campaign/<int:pk>/delete', views.telegram_delete_campaign, name='telegram_delete_campaign'),

    path('telegram/subscribers/', views.telegram_list, name='telegram_list'),
    path('telegram/subscribers/<int:pk>/delete', views.delete_telegram_sub, name='delete_telegram_subscriber'),

    path('tinymce-upload/', views.tinymce_upload, name='tinymce_upload'),
]