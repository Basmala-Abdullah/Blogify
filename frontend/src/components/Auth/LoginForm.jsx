import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { login, resetPassword } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const { data: userData, error } = await login(data.email, data.password);
      
      if (error) {
        throw error;
      }
      
      if (userData) {
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setResetEmailSent(true);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}
          
          {resetEmailSent && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Password reset email sent! Please check your inbox.
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 input input-bordered"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 input input-bordered"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-700 to-fuchsia-500 hover:from-fuchsia-500 hover:to-blue-700 transition duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <div className="mt-4 text-center space-y-2">
            <button
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Forgot Password?
            </button>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}