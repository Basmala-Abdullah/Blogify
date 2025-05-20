// src/services/apiService.js
import { supabase } from './supabaseClient';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper function to get auth token
const getAuthHeader = async () => {
  const { data } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${data?.session?.access_token}`,
    'Content-Type': 'application/json',
  };
};

const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token;
};


// Post API functions
export const getAllPosts = async (page = 1, pageSize = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/?page=${page}&page_size=${pageSize}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: null, error };
  }
};

export const getPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { data: null, error };
  }
};

export const createPost = async (postData) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/posts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create post');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    return { data: null, error };
  }
};

export const updatePost = async (id, postData) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/posts/${id}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update post');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error updating post:', error);
    return { data: null, error };
  }
};

export const deletePost = async (id) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/posts/${id}/`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete post');
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error };
  }
};

// User posts
export const getUserPosts = async (user_id) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/posts/user/${user_id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { data: [], error: error.message };
  }
};
