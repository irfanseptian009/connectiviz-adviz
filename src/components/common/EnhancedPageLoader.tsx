'use client';

import React, { useEffect, useState } from 'react';
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'dots' | 'pulse';
  showText?: boolean;
  fullscreen?: boolean;
}

export default function EnhancedPageLoader({ 
  size = 'md', 
  variant = 'default',
  showText = true,
  fullscreen = true 
}: LoadingProps) {
  const { isLoading, loadingText, networkInfo } = useAdaptiveLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoading) return null;

  // Size configurations
  const sizeConfig = {
    sm: { spinner: 'w-6 h-6', text: 'text-sm', container: 'p-4' },
    md: { spinner: 'w-10 h-10', text: 'text-base', container: 'p-6' },
    lg: { spinner: 'w-16 h-16', text: 'text-lg', container: 'p-8' }
  };

  const config = sizeConfig[size];

  // Loading variants
  const renderSpinner = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className={`${config.spinner} border-2 border-current border-t-transparent rounded-full animate-spin opacity-60`} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-current rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${config.spinner} bg-current rounded-full animate-pulse opacity-60`} />
        );
      
      default:
        return (
          <div className="relative">
            {/* Outer ring */}
            <div className={`${config.spinner} border-4 border-blue-200/30 dark:border-gray-600/30 rounded-full`}>
              {/* Animated ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              {/* Inner pulse */}
              <div className="absolute inset-2 bg-blue-500/20 rounded-full animate-pulse"></div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        );
    }
  };

  // Network-aware styling
  const getNetworkColor = () => {
    switch (networkInfo.connectionType) {
      case 'fast': return 'text-green-600 dark:text-green-400';
      case 'slow': return 'text-yellow-600 dark:text-yellow-400';
      case 'offline': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getBackgroundBlur = () => {
    // Less blur for slow connections to improve performance
    return networkInfo.connectionType === 'slow' || networkInfo.connectionType === 'offline' 
      ? 'backdrop-blur-sm' 
      : 'backdrop-blur-md';
  };

  if (!fullscreen) {
    return (
      <div className={`flex items-center justify-center ${config.container}`}>
        <div className={`flex flex-col items-center space-y-3 ${getNetworkColor()}`}>
          {renderSpinner()}
          {showText && (
            <span className={`${config.text} font-medium animate-pulse`}>
              {loadingText}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/20 dark:bg-black/40 ${getBackgroundBlur()} z-[9999] 
                    flex items-center justify-center animate-in fade-in duration-200`}>
      
      {/* Main loading container */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl 
                      border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
        
        <div className={`flex flex-col items-center space-y-4 ${config.container}`}>
          
          {/* Network status indicator */}
          <div className="absolute top-3 right-3">
            <div className={`w-2 h-2 rounded-full ${
              networkInfo.connectionType === 'fast' ? 'bg-green-500' :
              networkInfo.connectionType === 'slow' ? 'bg-yellow-500' : 
              networkInfo.connectionType === 'offline' ? 'bg-red-500' : 'bg-blue-500'
            } animate-pulse`}></div>
          </div>

          {/* Loading animation */}
          <div className={getNetworkColor()}>
            {renderSpinner()}
          </div>

          {/* Loading text */}
          {showText && (
            <div className="text-center space-y-1">
              <h3 className={`${config.text} font-semibold text-gray-800 dark:text-gray-200`}>
                {loadingText}
              </h3>
                {/* Network context */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {networkInfo.connectionType === 'fast' && 'Fast connection'}
                {networkInfo.connectionType === 'slow' && 'Optimizing for slow connection'}
                {networkInfo.connectionType === 'offline' && 'Working offline'}
              </p>
            </div>
          )}

          {/* Progress indicator for slow connections */}
          {(networkInfo.connectionType === 'slow' || networkInfo.connectionType === 'offline') && (
            <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full 
                            animate-loading-progress"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full 
                       filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500 rounded-full 
                       filter blur-3xl animate-float-delayed"></div>
      </div>
    </div>
  );
}
