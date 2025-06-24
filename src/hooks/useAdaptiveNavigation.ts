'use client';

import { useRouter } from 'next/navigation';
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';
import { useCallback } from 'react';

export function useAdaptiveNavigation() {
  const router = useRouter();
  const { showLoading, hideLoading, getLoadingDuration, networkInfo } = useAdaptiveLoading();

  const navigateWithAdaptiveLoading = useCallback(
    (path: string, loadingText: string = 'Loading page...') => {
      // Adapt loading text based on connection
      let adaptedText = loadingText;
      if (networkInfo.connectionType === 'slow') {
        adaptedText = `${loadingText} (This might take a moment)`;
      } else if (networkInfo.connectionType === 'offline') {
        adaptedText = 'Connection lost. Trying to navigate...';
      }

      showLoading(adaptedText);
      
      // Adaptive delay based on connection speed
      const baseDelay = networkInfo.connectionType === 'fast' ? 100 : 
                       networkInfo.connectionType === 'slow' ? 300 : 500;
      
      setTimeout(() => {
        router.push(path);
        
        // Adaptive hiding delay
        const hideDelay = getLoadingDuration() * 0.3; // 30% of loading duration
        setTimeout(() => {
          hideLoading();
        }, hideDelay);
      }, baseDelay);
    },
    [router, showLoading, hideLoading, getLoadingDuration, networkInfo]
  );

  const replaceWithAdaptiveLoading = useCallback(
    (path: string, loadingText: string = 'Loading page...') => {
      let adaptedText = loadingText;
      if (networkInfo.connectionType === 'slow') {
        adaptedText = `${loadingText} (Slow connection detected)`;
      }

      showLoading(adaptedText);
      
      const baseDelay = networkInfo.connectionType === 'fast' ? 100 : 
                       networkInfo.connectionType === 'slow' ? 400 : 600;
      
      setTimeout(() => {
        router.replace(path);
        setTimeout(() => {
          hideLoading();
        }, getLoadingDuration() * 0.4);
      }, baseDelay);
    },
    [router, showLoading, hideLoading, getLoadingDuration, networkInfo]
  );

  const backWithAdaptiveLoading = useCallback(
    (loadingText: string = 'Going back...') => {
      let adaptedText = loadingText;
      if (networkInfo.connectionType === 'slow') {
        adaptedText = `${loadingText} (Loading previous page)`;
      }

      showLoading(adaptedText);
      
      const baseDelay = networkInfo.connectionType === 'fast' ? 50 : 
                       networkInfo.connectionType === 'slow' ? 200 : 300;
      
      setTimeout(() => {
        router.back();
        setTimeout(() => {
          hideLoading();
        }, getLoadingDuration() * 0.2);
      }, baseDelay);
    },
    [router, showLoading, hideLoading, getLoadingDuration, networkInfo]
  );

  // Preload route based on network conditions
  const preloadRoute = useCallback(
    (path: string) => {
      if (networkInfo.connectionType === 'fast' && !networkInfo.saveData) {
        router.prefetch(path);
      }
    },
    [router, networkInfo]
  );

  return {
    navigateWithAdaptiveLoading,
    replaceWithAdaptiveLoading,
    backWithAdaptiveLoading,
    preloadRoute,
    networkInfo,
  };
}
