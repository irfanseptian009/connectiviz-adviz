'use client';

import React, { useState } from 'react';
import { useLoading } from '@/context/LoadingContext';

interface SidebarLoadingButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export default function SidebarLoadingButton({
  children,
  onClick,
  className = ''
}: SidebarLoadingButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const { isLoading } = useLoading();

  const handleClick = () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative overflow-hidden transition-all duration-200 
        ${isClicked ? 'scale-95' : 'scale-100'}
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}
        ${className}
      `}
    >
      {/* Ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-white/20 animate-ping rounded-lg" />
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      <div className={`${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}>
        {children}
      </div>
    </button>
  );
}
