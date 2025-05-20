from django.urls import path 
from . import views

urlpatterns = [
    
    path('', views.PostListCreate.as_view(), name='post-list'),
    # path('<int:pk>/', views.PostRetrieveUpdateDestroy.as_view(), name='post-detail'),
    path('<int:pk>/', views.PostRetrieveUpdateDestroy.as_view(), name='post-detail'),
    path('user/<uuid:user_id>/', views.UserPostsView.as_view(), name='user-posts'),
]