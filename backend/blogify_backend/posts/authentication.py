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
            # Get the JWT token
            token = auth_header.split(' ')[1]
            
            # Make a request to Supabase to validate the token
            user_response = requests.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": SUPABASE_KEY
                }
            )
            
            if user_response.status_code != 200:
                raise exceptions.AuthenticationFailed('Invalid token')
                
            user_data = user_response.json()
            
            # Get or create a Django user
            try:
                user = User.objects.get(username=user_data['email'])
            except User.DoesNotExist:
                user = User.objects.create(
                    username=user_data['email'],
                    email=user_data['email']
                )
                
            return (user, token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
            
    def authenticate_header(self, request):
        return 'Bearer'