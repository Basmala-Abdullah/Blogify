import React from 'react'
import { useState, useEffect } from 'react';
import { getAllPosts } from '../../services/apiService'
import { useAuth } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';
import PostItem from './PostItem.jsx'
import clockIcon from '../../assets/clock.svg';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');

    const {isAuthenticated} = useAuth()


    useEffect(() => {
      const fetchPosts = async (page) => {
          setIsLoading(true);
          try {
              const { data, error } = await getAllPosts(page);
              if (error) throw error;
              console.log( data)
              const pageSize = 5;
              const calculatedTotalPages = Math.ceil(data.count / pageSize);
              setPosts(data.results);
              setTotalPages(calculatedTotalPages);
              setCurrentPage(page);
          } catch (error) {
              console.error("Failed to load posts", error);
              setError("Failed to load posts. Please try again.");
          } finally {
              setIsLoading(false);
          }
      };

        fetchPosts(currentPage);
    }, [currentPage]);

    const handlePostDelete = (deletedPostId) => {
        //setPosts(posts.filter(post => post.id !== deletedPostId));
        const updatedPosts = posts.filter(post => post.id !== deletedPostId);
        if (currentPage > 1 && updatedPosts.length === 0) {
            setCurrentPage(currentPage - 1);
        } else {
            setPosts(updatedPosts);
        }

    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg text-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 ml-3 flex flex-col items-center mb-4">
            <div className="space-y-6 w-full max-w-4xl">
                <h1 className="text-3xl font-bold"><img src={clockIcon} alt="Edit" className="w-7 h-7 inline-block mr-2" />Latest Posts</h1>
                
                {error && (
                    <div className="alert alert-error shadow-lg">
                        <div>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {posts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No posts found. Be the first to create a post!</p>
                    </div>
                ) : (
                    <>
                        {posts.map((post) => (
                            <PostItem key={post.id} post={post} onDelete={handlePostDelete} />
                        ))}

                        {/*pagination*/}
                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-outline btn-sm"
                            >
                                Previous
                            </button>
                            
                            <span className="text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline btn-sm"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
            {isAuthenticated && 
            
            <Link to="/create"
                className="btn btn-circle btn-primary fixed bottom-5 right-5 w-14 h-14 shadow-lg bg-gradient-to-r from-blue-700 to-fuchsia-500 hover:from-fuchsia-500 hover:to-blue-700 transition duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </Link>
            }
        </div>
    );
}
