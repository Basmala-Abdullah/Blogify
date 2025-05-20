import React from 'react'
import { useAuth } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';
import { deletePost } from '../../services/apiService';
import { useState } from 'react';

export default function PostItem({post, onDelete}) {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
  
    const isOwner = user && post.author === user.id;
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        const { error } = await deletePost(post.id);
        
        if (error) throw error;
        
        onDelete(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
 
    <div className="bg-white shadow rounded-lg overflow-hidden flex border border-gray-100 mr-3">
     {/* Left side: Author information */}
      <div className="p-4 flex flex-col justify-end w-48 bg-gray-50  border-gray-100 h-30 items-end rounded-br-xl">
        <div>
          <p className="font-stretch-semi-condensed font-bold text-gray-900">
            {post.author_username}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>


      {/* Middle: Post content */}
      <div className="p-4 flex-grow">
        <div className="block group ">
          <div className="flex flex-col space-y-4">
            {post.image_url && (
              <div className="w-full flex justify-center">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="max-w-[300px] max-h-[300px] object-contain rounded"
                />
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-600">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </div>



       {/* Middle: Post content */}
      {/* <div className="p-4 flex-grow">
        <Link to={`/posts/${post.id}`} className="block group">
          <div className="flex space-x-4">
            {post.image_url && (
              <div className="flex-shrink-0">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-50 h-50 object-cover rounded"
                />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-600 line-clamp-2">
                {post.content}
              </p>
            </div>
          </div>
        </Link>
      </div> */}


      {/* Right side: Action buttons */}
      <div className="p-4 flex flex-col items-center justify-center space-y-2 w-20 border-l border-gray-100">
        {isOwner && (
          <>
            <Link
              to={`/edit/${post.id}`}
              className="btn btn-sm btn-outline btn-info"
              title="Edit post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-sm btn-outline btn-error"
              title="Delete post"
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>


    </div>



  )
}
