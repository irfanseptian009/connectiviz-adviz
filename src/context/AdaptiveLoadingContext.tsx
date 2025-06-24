'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNetworkStatus, NetworkInfo } from '@/hooks/useNetworkStatus';

interface AdaptiveLoadingContextType {
  isLoading: boolean;
  loadingText: string;
  networkInfo: NetworkInfo;
  setLoading: (loading: boolean) => void;
  setLoadingText: (text: string) => void;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  getLoadingDuration: () => number;
  getLoadingType: () => 'minimal' | 'standard' | 'enhanced';
  shouldShowDetailedLoading: () => boolean;
}

const AdaptiveLoadingContext = createContext<AdaptiveLoadingContextType | undefined>(undefined);

export function useAdaptiveLoading() {
  const context = useContext(AdaptiveLoadingContext);
  if (context === undefined) {
    throw new Error('useAdaptiveLoading must be used within an AdaptiveLoadingProvider');
  }
  return context;
}

interface AdaptiveLoadingProviderProps {
  children: ReactNode;
}

export function AdaptiveLoadingProvider({ children }: AdaptiveLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const networkInfo = useNetworkStatus();

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const showLoading = useCallback((text: string = 'Loading...') => {
    // Adapt loading text based on connection
    let adaptedText = text;
    if (networkInfo.connectionType === 'slow') {
      adaptedText = text.replace('Loading...', 'Loading (slow connection)...');
    } else if (networkInfo.connectionType === 'offline') {
      adaptedText = 'Connection lost. Retrying...';
    }
    
    setLoadingText(adaptedText);
    setIsLoading(true);
  }, [networkInfo.connectionType]);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Get loading duration based on network conditions
  const getLoadingDuration = useCallback(() => {
    switch (networkInfo.connectionType) {
      case 'offline':
        return 5000; // 5 seconds for offline
      case 'slow':
        return 3000; // 3 seconds for slow connection
      case 'fast':
      default:
        return 1000; // 1 second for fast connection
    }
  }, [networkInfo.connectionType]);

  // Get loading type based on network conditions
  const getLoadingType = useCallback((): 'minimal' | 'standard' | 'enhanced' => {
    if (networkInfo.saveData || networkInfo.connectionType === 'slow') {
      return 'minimal'; // Simple spinner, no animations
    } else if (networkInfo.connectionType === 'offline') {
      return 'standard'; // Standard loading with retry info
    } else {
      return 'enhanced'; // Full animations and effects
    }
  }, [networkInfo.connectionType, networkInfo.saveData]);

  // Determine if detailed loading should be shown
  const shouldShowDetailedLoading = useCallback(() => {
    return networkInfo.connectionType === 'slow' || networkInfo.connectionType === 'offline';
  }, [networkInfo.connectionType]);

  // Auto-hide loading for offline scenarios
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading && networkInfo.connectionType === 'offline') {
      timeoutId = setTimeout(() => {
        hideLoading();
      }, 10000); // Auto-hide after 10 seconds for offline
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, networkInfo.connectionType, hideLoading]);

  const value: AdaptiveLoadingContextType = {
    isLoading,
    loadingText,
    networkInfo,
    setLoading,
    setLoadingText,
    showLoading,
    hideLoading,
    getLoadingDuration,
    getLoadingType,
    shouldShowDetailedLoading,
  };

  return (
    <AdaptiveLoadingContext.Provider value={value}>
      {children}
    </AdaptiveLoadingContext.Provider>
  );
}
