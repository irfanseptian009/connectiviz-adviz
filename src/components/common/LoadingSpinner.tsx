'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'default' | 'overlay' | 'inline' | 'skeleton';
  rows?: number;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text, 
  className = '',
  variant = 'default',
  rows = 3
}: LoadingSpinnerProps) {
  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {/* Header skeleton */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>

        {/* Content skeleton rows */}
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div 
              key={i} 
              className={`h-3 bg-gray-200 dark:bg-gray-700 rounded ${
                i === rows - 1 ? 'w-2/3' : 'w-full'
              }`}
            />
          ))}
        </div>

        {text && (
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {text}
            </p>
          </div>
        )}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'overlay') {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            {text && (
              <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 text-center`}>
                {text}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="animate-pulse flex items-center space-x-2">
          <div className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full`}></div>
          {text && (
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="animate-pulse space-y-4 w-full max-w-sm">
        <div className="flex items-center space-x-3">
          <div className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full`}></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium text-center`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
