from django.urls import path 
from . import views

urlpatterns = [
    
    path('', views.PostListCreate.as_view(), name='post-list'),
    path('<int:pk>/', views.PostRetrieveUpdateDestroy.as_view(), name='post-detail'),
]