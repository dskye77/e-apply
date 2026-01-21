'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Something went wrong
        </h2>
        
        <p className="text-red-700 mb-6">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <p className="text-xs text-gray-600 mt-6">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}