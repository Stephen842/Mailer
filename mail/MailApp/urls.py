from django.urls import path
from . import views

urlpatterns = [
    path('', views.add_subscriber, name='add_subscriber'),
    path('subscribe/success/', views.subscribe_success, name='subscribe_success'),
    path('campaign/create/', views.create_campaign, name='create_campaign'),
    path('campaign/send/<int:campaign_id>/', views.send_campaign, name='send_campaign'),
    path('dashboard/admin', views.dashboard, name='dashboard'),
    path('subscribers/', views.subscriber_list, name='subscriber_list'),
    path('subscribers/admin/add/', views.admin_add_subscriber, name='admin_add_subscriber'),
    path('subscribers/<int:pk>/delete', views.delete_subscriber, name='delete_subscriber'),
    path('subscribers/<int:pk>/send/', views.send_message, name='send_message'),
]