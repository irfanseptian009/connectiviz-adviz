'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  fallbackBg?: string;
  textColor?: string;
}

export default function UserAvatar({
  src,
  name = '',
  size = 40,
  className = '',
  fallbackBg = 'bg-blue-500',
  textColor = 'text-white'
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate initials from name
  const getInitials = (fullName: string): string => {
    if (!fullName) return 'U';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };  // Check if we should show image
  const shouldShowImage = mounted && src && !imageError && src.trim() !== '';

  // Don't show loading state during SSR
  if (!mounted) {
    return (
      <div 
        className={`relative overflow-hidden rounded-full flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className={`w-full h-full ${fallbackBg} flex items-center justify-center ${textColor}`}>
          {name ? (
            <span 
              className="font-semibold"
              style={{ fontSize: size * 0.4 }}
            >
              {getInitials(name)}
            </span>
          ) : (
            <User size={size * 0.6} />
          )}
        </div>
      </div>
    );
  }

  console.log('[UserAvatar] Debug info:', {
    src,
    name,
    shouldShowImage,
    imageError,
    imageLoading
  });
  const handleImageLoad = () => {
    if (mounted) {
      setImageLoading(false);
    }
  };

  const handleImageError = () => {
    if (mounted) {
      console.log('[UserAvatar] Image failed to load:', src);
      setImageError(true);
      setImageLoading(false);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-full flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {shouldShowImage ? (
        <>
          {imageLoading && (
            <div className={`absolute inset-0 ${fallbackBg} flex items-center justify-center`}>
              <div className="animate-spin">
                <User size={size * 0.4} className={textColor} />
              </div>
            </div>
          )}
          <Image
            src={src}
            alt={name || 'User avatar'}
            width={size}
            height={size}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={size > 100} // Priority for larger avatars
          />
        </>
      ) : (
        // Fallback to initials or user icon
        <div className={`w-full h-full ${fallbackBg} flex items-center justify-center ${textColor}`}>
          {name ? (
            <span 
              className="font-semibold"
              style={{ fontSize: size * 0.4 }}
            >
              {getInitials(name)}
            </span>
          ) : (
            <User size={size * 0.6} />
          )}
        </div>
      )}
    </div>
  );
}
