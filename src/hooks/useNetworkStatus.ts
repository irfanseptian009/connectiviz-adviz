'use client';

import { useState, useEffect, useCallback } from 'react';

// Type for Network Connection API
interface NetworkConnection {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (event: string, listener: () => void) => void;
  removeEventListener?: (event: string, listener: () => void) => void;
}

declare global {
  interface Navigator {
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
  }
}

export interface NetworkInfo {
  isOnline: boolean;
  connectionType: 'fast' | 'slow' | 'offline';
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export function useNetworkStatus() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: true,
    connectionType: 'fast',
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false,
  });

  const updateNetworkInfo = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isOnline = navigator.onLine;
    let connectionType: 'fast' | 'slow' | 'offline' = 'fast';
    let effectiveType = '4g';
    let downlink = 10;
    let rtt = 50;
    let saveData = false;

    if (!isOnline) {
      connectionType = 'offline';    } else if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        effectiveType = connection.effectiveType || '4g';
        downlink = connection.downlink || 10;
        rtt = connection.rtt || 50;
        saveData = connection.saveData || false;

        // Determine connection speed based on effective type and downlink
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1.5) {
          connectionType = 'slow';
        } else if (effectiveType === '3g' || (downlink >= 1.5 && downlink < 5)) {
          connectionType = 'slow';
        } else {
          connectionType = 'fast';
        }

        // Adjust based on RTT (Round Trip Time)
        if (rtt > 300) {
          connectionType = 'slow';
        }
      }
    }

    setNetworkInfo({
      isOnline,
      connectionType,
      effectiveType,
      downlink,
      rtt,
      saveData,
    });
  }, []);

  useEffect(() => {
    // Initial check
    updateNetworkInfo();

    // Listen for online/offline events
    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);    // Listen for connection changes (if supported)
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection && connection.addEventListener) {
        connection.addEventListener('change', updateNetworkInfo);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection && connection.removeEventListener) {
          connection.removeEventListener('change', updateNetworkInfo);
        }
      }
    };
  }, [updateNetworkInfo]);

  return networkInfo;
}

// Hook untuk mengukur kecepatan internet secara real-time
export function useConnectionSpeed() {
  const [speed, setSpeed] = useState<{
    downloadSpeed: number;
    latency: number;
    isLoading: boolean;
  }>({
    downloadSpeed: 0,
    latency: 0,
    isLoading: false,
  });

  const measureSpeed = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setSpeed(prev => ({ ...prev, isLoading: true }));

    try {
      // Measure latency with a small request
      const latencyStart = performance.now();
      await fetch('/favicon.ico', { 
        method: 'GET',
        cache: 'no-cache',
      });
      const latency = performance.now() - latencyStart;

      // Measure download speed with a larger request
      const downloadStart = performance.now();
      const response = await fetch('/favicon.ico', {
        method: 'GET',
        cache: 'no-cache',
      });
      
      if (response.ok) {
        const downloadEnd = performance.now();
        const downloadTime = downloadEnd - downloadStart;
        const fileSize = parseInt(response.headers.get('content-length') || '1024');
        const downloadSpeed = (fileSize * 8) / (downloadTime / 1000) / 1000; // kbps

        setSpeed({
          downloadSpeed,
          latency,
          isLoading: false,
        });
      }
    } catch (error) {
      console.warn('Failed to measure connection speed:', error);
      setSpeed(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    measureSpeed();
  }, [measureSpeed]);

  return { ...speed, measureSpeed };
}
