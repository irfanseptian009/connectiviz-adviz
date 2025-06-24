'use client';

import React from 'react';
import { useLoading } from '@/context/LoadingContext';

export default function LoadingOverlay() {
  const { isLoading, loadingText } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-sm mx-4 animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center space-y-4">
          {/* Simple spinner */}
          <div className="relative">
            <div className="w-8 h-8 border-3 border-blue-200 dark:border-gray-600 rounded-full">
              <div className="absolute inset-0 border-3 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          </div>
          
          {/* Loading text */}
          <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            {loadingText}
          </p>
        </div>
      </div>
    </div>
  );
}
