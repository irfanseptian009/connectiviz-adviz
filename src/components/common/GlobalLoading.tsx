'use client';

import React from 'react';
import { useLoading } from '@/context/LoadingContext';

export default function GlobalLoading() {
  const { isLoading, loadingText } = useLoading();

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md w-full mx-4">
        {/* Main Loading Animation */}
        <div className="flex flex-col items-center space-y-8">
          {/* Advanced Spinner */}
          <div className="relative">
            {/* Outer Ring with Gradient */}
            <div className="w-24 h-24 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
              </div>
            </div>
            
            {/* Inner Rotating Elements */}
            <div className="absolute inset-4 border-2 border-transparent border-b-blue-400 border-l-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            
            {/* Center Logo/Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm animate-pulse"></div>
              </div>
            </div>

            {/* Orbiting Dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-40px)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Loading Text with Animation */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white animate-pulse">
              Loading
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {loadingText || 'Please wait while we prepare everything for you...'}
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-pulse bg-size-200 bg-pos-0" 
                 style={{ 
                   backgroundSize: '200% 100%',
                   animation: 'gradient-x 2s ease infinite, pulse 1s ease-in-out infinite alternate'
                 }}>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>System ready</span>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-8 left-8 w-4 h-4 bg-blue-400/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-3 h-3 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 20px 20px, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Ambient Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
}
