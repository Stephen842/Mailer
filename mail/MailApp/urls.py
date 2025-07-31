from django.urls import path
from . import views

urlpatterns = [
    path('', views.add_subscriber, name='add_subscriber'),
    path('campaign/create/', views.create_campaign, name='create_campaign'),
    path('campaign/send/<int:campaign_id>/', views.send_campaign, name='send_campaign'),
]