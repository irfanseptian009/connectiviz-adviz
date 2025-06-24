'use client';

import React, { useState } from 'react';
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';

export default function NetworkStatusIndicator() {
  const { networkInfo } = useAdaptiveLoading();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = () => {
    switch (networkInfo.connectionType) {
      case 'fast':
        return 'bg-green-500';
      case 'slow':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (networkInfo.connectionType) {
      case 'fast':
        return 'Fast Connection';
      case 'slow':
        return 'Slow Connection';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = () => {
    switch (networkInfo.connectionType) {
      case 'fast':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'slow':
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'offline':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364m12.728 0L5.636 5.636" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 
          transition-all duration-300 cursor-pointer
          ${isExpanded ? 'w-64 p-4' : 'w-12 h-12 p-2'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          <div className="flex items-center justify-center h-full">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {getStatusText()}
                </span>
              </div>
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            </div>

            {/* Network Details */}
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{networkInfo.effectiveType.toUpperCase()}</span>
              </div>
              
              {networkInfo.downlink > 0 && (
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="font-medium">{networkInfo.downlink.toFixed(1)} Mbps</span>
                </div>
              )}
              
              {networkInfo.rtt > 0 && (
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-medium">{networkInfo.rtt}ms</span>
                </div>
              )}
              
              {networkInfo.saveData && (
                <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Data Saver On</span>
                </div>
              )}
            </div>

            {/* Performance Tips */}
            {networkInfo.connectionType === 'slow' && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <div className="text-xs text-yellow-800 dark:text-yellow-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Tip:</span>
                  </div>
                  <span>Loading optimized for slow connection</span>
                </div>
              </div>
            )}

            {networkInfo.connectionType === 'offline' && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <div className="text-xs text-red-800 dark:text-red-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                    </svg>
                    <span className="font-medium">Offline Mode</span>
                  </div>
                  <span>Some features may be limited</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
