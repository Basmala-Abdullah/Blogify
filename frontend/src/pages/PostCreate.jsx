import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


import { useAuth } from '../components/Auth/AuthContext';
import ImageUpload from '../components/Posts/ImageUpload';
import { createPost } from '../services/apiService';

export default function PostCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  if ( !user) {
    navigate('/login');
    return;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
        const postData = {
            title: data.title,
            content: data.content,
            image_url: imageUrl,
            updated_at: new Date()
        };
      
        postData.author = user.id;
        postData.author_username = user.email.split('@')[0]
            
        // eslint-disable-next-line no-unused-vars
        const { data: createdPost, error } = await createPost(postData);
            
        if (error) throw error;
            
        navigate('/');

    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleImageUpload = (url) => {
        setImageUrl(url);
    };


  return (
    <div className="max-w-2xl mx-auto mt-3 mb-3">
      <h1 className="text-2xl font-bold mb-3">
        Create New Post
      </h1>
      
      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter a title for your post"
            {...register('title', { 
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Title must be less than 100 characters',
              },
            })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows={10}
            className="textarea textarea-bordered w-full"
            placeholder="Write your post content here..."
            {...register('content', { 
              required: 'Content is required',
              minLength: {
                value: 10,
                message: 'Content must be at least 10 characters',
              },
            })}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        
        <ImageUpload onImageUpload={handleImageUpload} />
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn text-white bg-gradient-to-r from-blue-700 to-fuchsia-500 hover:from-fuchsia-500 hover:to-blue-700 transition duration-300"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                'Creating...'
              </>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
