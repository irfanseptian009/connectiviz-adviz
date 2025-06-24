'use client';

import React from 'react';

interface TableLoadingSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export default function TableLoadingSkeleton({ 
  rows = 5, 
  columns = 4, 
  showHeader = true 
}: TableLoadingSkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex space-x-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          {Array.from({ length: columns }).map((_, i) => (
            <div 
              key={i} 
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"
            />
          ))}
        </div>
      )}

      {/* Rows Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex space-x-4 p-4 border-b border-gray-100 dark:border-gray-800"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={`h-3 bg-gray-200 dark:bg-gray-700 rounded flex-1 ${
                  colIndex === 0 ? 'w-8 h-8 rounded-full' : '' // First column as avatar
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
