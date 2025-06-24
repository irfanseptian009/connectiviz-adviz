'use client';

import React from 'react';

interface LoadingButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loadingText?: string;
}

export default function LoadingButton({
  isLoading = false,
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  loadingText = 'Loading...'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center transition-all duration-200 ${
        isLoading || disabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
      } ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span className="text-sm">{loadingText}</span>
          </div>
        </div>
      )}
      <div className={`${isLoading ? 'invisible' : 'visible'}`}>
        {children}
      </div>
    </button>
  );
}
