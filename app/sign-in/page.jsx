'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';


function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In Next.js, environment variables need to be prefixed with NEXT_PUBLIC_ to be accessible on the client side
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/sign-in`, formData);
      if (response.data.token) {
        Cookies.set('authToken', response.data.token, {expires: 0.02083});
        Cookies.set('user', JSON.stringify(response.data.user), {expires: 0.02083});
        router.push('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">
            Diginews - Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Enter your email"
                />
                <p className="absolute top-2 right-2 text-xs text-gray-600">
                  (default: digival@diginews.com)
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Enter your password"
                />
                <p className="absolute top-2 right-2 text-xs text-gray-600">
                  (default: 12345678)
                </p>
              </div>
            </div>
          </div>

            
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div> */}
            {/* <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a> */}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>

          {/* <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </p> */}
          
        </form>
        {/* <h5 className='text-2xl font-bold text-green-600 ' >New Dashboard Systeme</h5>
        <motion.ul
          className="list-disc list-inside space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          New Features
          <motion.li
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            1- Settings page with user API token and all information.
          </motion.li>
          <motion.li
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            2- Login page with username and password, with cookies (temporary).
          </motion.li>
          <motion.li
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            3- Add system to delete duplicated sources.
          </motion.li>
          <motion.li
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            4- User can add his favorite source and search on it in settings page.
          </motion.li>
          <motion.li
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            5- Add new sources icon fetching.
          </motion.li>
        </motion.ul> */}
      </div>
    </div>
  );
}

export default Page;