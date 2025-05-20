# from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
# from django.contrib.auth.models import User
# from .models import Post
# from .serializers import UserSerializer, PostSerializer
from rest_framework import generics
from supabase_client import supabase
from rest_framework.pagination import PageNumberPagination

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the author
        return obj.author == request.user

class IsAuthorOrReadOnlyForSupabase(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the author.
        # 'obj' is the post data and user has supabase_id attached by the auth class.
        if hasattr(request.user, 'supabase_id') and obj.get('author') == request.user.supabase_id:
            return True
        return False

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    #max_page_size = 20

class PostListCreate(generics.GenericAPIView):
    # queryset = Post.objects.all()
    # serializer_class = PostSerializer
    queryset = []  #Empty list -> fixed a bug, we needed an empty set for queryset but not that got from the local db
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    pagination_class = StandardResultsSetPagination

    def get(self, request, *args, **kwargs):
        try:
            api_response = supabase.table('posts').select('*').order('created_at', desc=True).execute()
            
            #pagination
            page = self.paginate_queryset(api_response.data if api_response.data is not None else [])
            if page is not None:
                return self.get_paginated_response(page)
                
            return Response(api_response.data if api_response.data is not None else [], 
                          status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "An unexpected error occurred while listing posts", 
                          "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request, *args, **kwargs): #create a new post in Supabase
        title = request.data.get('title')
        content = request.data.get('content')
        image_url = request.data.get('image_url')

        if not title or not content:
            return Response({"error": "Title and content are required"}, status=status.HTTP_400_BAD_REQUEST)

        if not hasattr(request.user, 'supabase_id') or not request.user.supabase_id:
            return Response({"error": "User authentication failed or Supabase ID missing"}, status=status.HTTP_401_UNAUTHORIZED)
        
        supabase_user_id = request.user.supabase_id
        supabase_user_username= request.user.email.split('@')[0]

        post_data_to_insert = {
            'title': title,
            'content': content,
            'author': supabase_user_id ,
            'author_username':supabase_user_username,
            'updated_at': datetime.utcnow().isoformat()
        }

        if image_url is not None:
            post_data_to_insert['image_url'] = image_url
        
        try:
            api_response = supabase.table('posts').insert(post_data_to_insert).execute()

            if api_response.data and len(api_response.data) > 0:
                return Response(api_response.data[0], status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Failed to create post, unexpected response from Supabase."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e: # Catch a broader range of exceptions initially
            return Response({"error": "An unexpected error occurred while creating the post", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostRetrieveUpdateDestroy(generics.GenericAPIView):
    # queryset = Post.objects.all()
    # serializer_class = PostSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnlyForSupabase]
    
    def get_object_from_supabase(self, pk): #get a single post from Supabase.
        try:
            response = supabase.table('posts').select('*').eq('id', pk).single().execute()
            if response.data:
                return response.data
            if response.error:
                 print(f"Supabase error retrieving post {pk}: {response.error.message if hasattr(response.error, 'message') else response.error}")
            return None
        except Exception as e:
            print(f"Exception retrieving post {pk}: {e}")
            return None

    def get(self, request, pk, *args, **kwargs): #retrieve a single post by its ID from Supabase.
        post_obj = self.get_object_from_supabase(pk)
        if post_obj:
            return Response(post_obj, status=status.HTTP_200_OK)
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, *args, **kwargs): #update an existing post in Supabase.
        post_to_update = self.get_object_from_supabase(pk)
        if not post_to_update:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # check permissions using our custom class
        self.check_object_permissions(request, post_to_update) # this will raise PermissionDenied if not allowed
        
        # direct data access where frontend sends fields values
        title = request.data.get('title', post_to_update.get('title')) # keep old if not provided
        content = request.data.get('content', post_to_update.get('content'))
        image_url = request.data.get('image_url', post_to_update.get('image_url'))

        data_for_update = {'title': title, 'content': content}
        if 'image_url' in request.data: # checking for image_url as its optional
            data_for_update['image_url'] = request.data.get('image_url')
        
        try:
            response = supabase.table('posts').update(data_for_update).eq('id', pk).execute()
            if response.data and len(response.data) > 0:
                return Response(response.data[0], status=status.HTTP_200_OK)
            elif response.error:
                print(f"Supabase error updating post {pk}: {response.error.message if hasattr(response.error, 'message') else response.error}")
                return Response({"error": "Failed to update post", "details": response.error.message if hasattr(response.error, 'message') else "Unknown error"}, status=status.HTTP_400_BAD_REQUEST)
            updated_post = self.get_object_from_supabase(pk)
            return Response(updated_post if updated_post else {"message": "Update successful, but could not retrieve updated object."}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Exception updating post {pk}: {e}")
            return Response({"error": "An unexpected error occurred while updating the post"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk, *args, **kwargs): #delete an existing post from Supabase.
        post_to_delete = self.get_object_from_supabase(pk)
        if not post_to_delete:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, post_to_delete)

        try:
            response = supabase.table('posts').delete().eq('id', pk).execute()
            if (response.data and len(response.data) > 0) or (not response.error):
                return Response(status=status.HTTP_204_NO_CONTENT)
            elif response.error:
                print(f"Supabase error deleting post {pk}: {response.error.message if hasattr(response.error, 'message') else response.error}")
                return Response({"error": "Failed to delete post", "details": response.error.message if hasattr(response.error, 'message') else "Unknown error"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                 return Response({"error": "Failed to delete post, unexpected response from Supabase."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"Exception deleting post {pk}: {e}")
            return Response({"error": "An unexpected error occurred while deleting the post"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserPostsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = []  
    def get(self, request, user_id, *args, **kwargs):
        try:
            # fetch posts by the specified user_id
            api_response = supabase.table('posts') \
                .select('*') \
                .eq('author', user_id) \
                .order('updated_at', desc=True) \
                .execute()
            
            return Response(api_response.data if api_response.data is not None else [], 
                          status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "An unexpected error occurred while fetching user posts", "details": str(e)}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
