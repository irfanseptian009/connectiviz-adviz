'use client';

import React, { useState } from 'react';
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';

interface SidebarLoadingItemProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
  loadingDuration?: number;
}

export default function SidebarLoadingItem({
  children,
  onClick,
  isActive = false,
  className = '',
  loadingDuration = 800
}: SidebarLoadingItemProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { networkInfo } = useAdaptiveLoading();

  const handleClick = () => {
    setIsClicked(true);
    
    // Reset animation after duration
    setTimeout(() => {
      setIsClicked(false);
    }, loadingDuration);
    
    // Call the actual onClick after a small delay for visual feedback
    setTimeout(() => {
      onClick();
    }, 150);
  };
  const getLoadingStyle = () => {
    if (networkInfo.connectionType === 'slow') {
      return 'sidebar-loading-slow animate-menu-item-load'; // Shimmer + pulse for slow connections
    } else if (networkInfo.connectionType === 'fast') {
      return 'sidebar-loading-fast animate-sidebar-glow'; // Bounce + glow for fast connections
    } else if (networkInfo.connectionType === 'offline') {
      return 'sidebar-loading-offline animate-breathe'; // Ping + breathe for offline
    }
    return 'animate-pulse animate-sidebar-glow'; // Default with glow
  };

  const getHoverEffects = () => {
    if (networkInfo.connectionType === 'fast') {
      return 'sidebar-item-hover transform transition-all duration-200';
    }
    return 'transform transition-all duration-300';
  };
  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden transition-all duration-300 ${getHoverEffects()}
        ${isClicked ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
        ${isClicked ? getLoadingStyle() : ''}
        ${className}
      `}
    >      {/* Advanced Ripple Effect with Multiple Layers */}
      {isClicked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-white/20 dark:bg-blue-400/20 rounded-lg animate-sidebar-ripple" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-blue-400/30 rounded-lg animate-sidebar-wave" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-loading-bar rounded-full" />
        </div>
      )}      {/* Enhanced Shimmer Effect on Hover */}
      {isHovered && !isClicked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-sidebar-wave rounded-lg" />
          {networkInfo.connectionType === 'fast' && (
            <div className="absolute inset-0 animate-sidebar-glow rounded-lg" />
          )}
        </div>
      )}

      {/* Smart Loading Indicator */}
      {isClicked && (
        <div className="absolute top-1 right-1 z-10">
          <div className={`
            relative w-4 h-4 rounded-full overflow-hidden
            ${networkInfo.connectionType === 'fast' ? 'bg-green-400 network-fast' : 
              networkInfo.connectionType === 'slow' ? 'bg-yellow-400 network-slow' : 
              networkInfo.connectionType === 'offline' ? 'bg-red-400 network-offline' :
              'bg-blue-400'}
          `}>
            {/* Loading dots animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-0.5">
                <div className="loading-dot" style={{ animationDelay: '0s' }}></div>
                <div className="loading-dot" style={{ animationDelay: '0.1s' }}></div>
                <div className="loading-dot" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active State Indicator */}
      {isActive && !isClicked && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full animate-pulse" />
      )}

      {/* Content */}
      <div className={`
        relative z-0 transition-all duration-200
        ${isClicked ? 'opacity-70' : 'opacity-100'}
      `}>
        {children}
      </div>
    </button>
  );
}
