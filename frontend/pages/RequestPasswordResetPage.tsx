import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../src/services/authService';
import { LoadingSpinner } from '../src/constants';

const RequestPasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    if (!email.includes('@')) {
        setError("Please enter a valid email address.");
        setIsLoading(false);
        return;
    }
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message); // Display generic success message from backend
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            No problem! Enter your email address below and we'll send you a link to reset it.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
                disabled={isLoading || !!message} // Disable if loading or success message shown
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-300 rounded-md text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-green-50 text-green-700 border border-green-300 rounded-md text-sm">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !!message} // Disable if loading or success message shown
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
            >
              {isLoading && LoadingSpinner}
              {isLoading ? 'Sending...' : 'Send Password Reset Email'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
            Back to Home or Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;
