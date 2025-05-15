from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.models import User
import jwt
import requests
from django.conf import settings
import os

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None
            
        try:
            token = auth_header.split(' ')[1]
            
            user_response = requests.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": SUPABASE_KEY
                }
            )
            
            if user_response.status_code != 200:
                print(user_response)
                raise exceptions.AuthenticationFailed('Invalid token')
                
            user_data = user_response.json()
            
            django_user = None
            try:
                django_user = User.objects.get(username=user_data['email'])
                print(f"Django User found: {django_user.username}")
            except User.DoesNotExist:
                print(f"Django User not found, creating new user: {user_data['email']}") # DEBUG
                django_user = User.objects.create(
                    username=user_data['email'],
                    email=user_data['email']
                )
                print(f"Django User created: {django_user.username}")
            
            # attach Supabase user ID to the Django user
            django_user.supabase_id = user_data.get('id') # where user_data['id'] is the supabase uuid

            return (django_user, token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
            
    def authenticate_header(self, request):
        return 'Bearer'