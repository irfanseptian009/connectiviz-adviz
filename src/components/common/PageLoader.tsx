'use client';

import React from 'react';

interface PageLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PageLoader({ 
  text = 'Loading...', 
  size = 'md',
  className = '' 
}: PageLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Modern Spinner */}
      <div className="relative mb-4">
        <div className={`${sizeClasses[size]} border-3 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}>
          <div className="absolute top-0 left-0 w-full h-full border-3 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        {/* Inner rotating circle */}
        <div className={`absolute inset-1 ${size === 'sm' ? 'border-2' : 'border-3'} border-transparent border-b-purple-500 dark:border-b-purple-400 rounded-full animate-spin-reverse`}></div>
      </div>

      {/* Loading Text */}
      <p className={`${textSizeClasses[size]} font-medium text-gray-600 dark:text-gray-300 animate-pulse`}>
        {text}
      </p>

      {/* Dots Animation */}
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
}
