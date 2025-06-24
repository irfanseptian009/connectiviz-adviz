'use client';

import React from 'react';

interface NavigationLoadingProps {
  isLoading: boolean;
  text?: string;
}

export default function NavigationLoading({ isLoading, text = 'Loading...' }: NavigationLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
      {/* Main Loading Container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-100 dark:border-gray-700 max-w-sm w-full mx-4">
        {/* Animated Logo/Brand Area */}
        <div className="flex flex-col items-center space-y-8">
          {/* Modern Spinner */}
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            
            {/* Animated Ring */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin"></div>
            
            {/* Inner Ring */}
            <div className="absolute inset-2 w-16 h-16 border-3 border-transparent border-t-purple-500 border-r-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Floating Dots */}
            <div className="absolute -inset-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{
                    top: i === 0 || i === 1 ? '0%' : '100%',
                    left: i === 0 || i === 3 ? '0%' : '100%',
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Please Wait
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
              {text}
            </p>
          </div>

          {/* Progress Wave */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-8 left-8 w-16 h-16 border border-blue-300 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 border border-purple-300 rounded-full"></div>
          <div className="absolute top-16 right-12 w-8 h-8 border border-blue-300 rounded-full"></div>
        </div>
      </div>

      {/* Ambient Light Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
}
