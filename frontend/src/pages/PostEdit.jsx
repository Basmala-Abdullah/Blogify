import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../components/Auth/AuthContext';
import ImageUpload from '../components/Posts/ImageUpload';
import { updatePost, getPostById } from '../services/supabaseClient';

export default function PostEdit() {
    const { id: postId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoadingPost, setIsLoadingPost] = useState(true);

    const { user } = useAuth();
    const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();


    useEffect(() => {
      const fetchPost = async () => {
        try {
          const { data, error } = await getPostById(postId);
          
          if (error) throw error;
          
          if (data) {
            if (data.author !== user.id) {
              navigate('/');
              return;
            }
            
            setValue('title', data.title);
            setValue('content', data.content);
            setImageUrl(data.image_url || '');
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to load post. Please try again later.');
        } finally {
          setIsLoadingPost(false);
        }
      };
      
      fetchPost();
    
  }, [postId, user, navigate, setValue]);


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
      
        const { error } = await updatePost(postId, postData);
        
        if (error) throw error;
        
        navigate(`/my-posts`);

    } catch (err) {
      console.error('Error editing post:', err);
      setError('Failed to edit post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  if (isLoadingPost) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto mt-3 mb-3">
      <h1 className="text-2xl font-bold mb-3">
        Edit Post
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
                Updating...
              </>
            ) : (
              'Update Post'
            )}
          </button>
          
        </div>
      </form>
    </div>
  )
}
