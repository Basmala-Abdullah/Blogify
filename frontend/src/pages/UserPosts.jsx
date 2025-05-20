import React from 'react'
import { useEffect, useState } from 'react';
import { getUserPosts } from '../services/apiService'
import { useAuth } from '../components/Auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PostItem from '../components/Posts/PostItem';

export default function UserPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        async function fetchPosts() {
            try {
                const { data, error } = await getUserPosts(user.id);
                if (error) throw error;
                console.log(data)
                setPosts(data || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchPosts();
    }, [user, isAuthenticated, navigate, authLoading]);

    const handlePostDelete = (deletedPostId) => {
        setPosts(posts.filter(post => post.id !== deletedPostId));
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg text-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6 ml-3 flex flex-col items-center">
            <div className="space-y-6 w-full max-w-4xl">
                <h1 className="text-3xl font-bold">Your Posts</h1>
                
                {error && (
                    <div className="alert alert-error shadow-lg">
                        <div>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {posts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">You haven't created any posts yet. Create your first post!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostItem key={post.id} post={post} onDelete={handlePostDelete} />
                    ))
                )}
            </div>

            {isAuthenticated && (
                <Link
                    to="/create"
                    className="btn btn-circle btn-primary fixed bottom-5 right-5 w-14 h-14 shadow-lg bg-gradient-to-r from-blue-700 to-fuchsia-500 hover:from-fuchsia-500 hover:to-blue-700 transition duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </Link>
            )}
        </div>
    );
}
