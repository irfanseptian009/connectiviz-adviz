'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TopLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  useEffect(() => {
    // Start loading on route change
    setIsLoading(true);
    setProgress(0);

    let currentProgress = 0;
    const progressTimer = setInterval(() => {
      currentProgress += 15; 
      if (currentProgress >= 90) {
        clearInterval(progressTimer);
        setProgress(90);
      } else {
        setProgress(currentProgress);
      }
    }, 100);

    // Complete loading
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 800);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 
                   transition-all duration-300 ease-out shadow-lg shadow-blue-500/20"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)'
        }}
      />
    </div>
  );
}
