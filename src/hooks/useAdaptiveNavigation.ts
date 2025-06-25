'use client';

import { useRouter } from 'next/navigation';
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';
import { useCallback } from 'react';

export function useAdaptiveNavigation() {
  const router = useRouter();
  const { showLoading, hideLoading, networkInfo } = useAdaptiveLoading();

  const navigateWithAdaptiveLoading = useCallback(
    (path: string, loadingText: string = 'Loading page...') => {
      // Show loading immediately without delay
      let adaptedText = loadingText;
      if (networkInfo.connectionType === 'slow') {
        adaptedText = `${loadingText} (This might take a moment)`;
      } else if (networkInfo.connectionType === 'offline') {
        adaptedText = 'Connection lost. Trying to navigate...';
      }

      // Show loading instantly
      showLoading(adaptedText);
      
      // Navigate immediately for instant feedback
      router.push(path);
      
      // Adaptive hiding delay based on connection
      const hideDelay = networkInfo.connectionType === 'fast' ? 500 : 
                       networkInfo.connectionType === 'slow' ? 1200 : 800;
      
      setTimeout(() => {
        hideLoading();
      }, hideDelay);
    },
    [router, showLoading, hideLoading, networkInfo]
  );

  const replaceWithAdaptiveLoading = useCallback(
    (path: string, loadingText: string = 'Loading page...') => {
      // Show loading immediately
      let adaptedText = loadingText;
      if (networkInfo.connectionType === 'slow') {
        adaptedText = `${loadingText} (Slow connection detected)`;
      }

      // Show loading instantly
      showLoading(adaptedText);
      
      // Navigate immediately
      router.replace(path);
      
      // Adaptive hiding delay
      const hideDelay = networkInfo.connectionType === 'fast' ? 500 : 
                       networkInfo.connectionType === 'slow' ? 1200 : 800;
      
      setTimeout(() => {
        hideLoading();
      }, hideDelay);
    },
    [router, showLoading, hideLoading, networkInfo]
  );

  const backWithAdaptiveLoading = useCallback(
    (loadingText: string = 'Going back...') => {
      // Show loading immediately
      let adaptedText = loadingText;
      if (networkInfo.connectionType === 'slow') {
        adaptedText = `${loadingText} (Loading previous page)`;
      }

      // Show loading instantly
      showLoading(adaptedText);
      
      // Navigate back immediately
      router.back();
      
      // Shorter delay for back navigation
      const hideDelay = networkInfo.connectionType === 'fast' ? 300 : 
                       networkInfo.connectionType === 'slow' ? 800 : 500;
      
      setTimeout(() => {
        hideLoading();
      }, hideDelay);
    },
    [router, showLoading, hideLoading, networkInfo]
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
