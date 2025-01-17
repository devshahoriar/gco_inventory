"use client";
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const DeactivePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-yellow-500 dark:text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Account Deactivated
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your account has been temporarily deactivated. To reactivate your account,
          please contact the administrator.
        </p>
        <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-md mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Contact Information:
            <br />
            Email: admin@example.com
            <br />
            Phone: (123) 456-7890
          </p>
        </div>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default DeactivePage;