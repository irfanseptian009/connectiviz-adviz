"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, X, User, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface EmployeePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (file: File | null) => void;
  onPhotoUrlChange?: (url: string | null) => void;
  disabled?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export default function EmployeePhotoUpload({
  currentPhotoUrl,
  onPhotoChange,
  onPhotoUrlChange,
  disabled = false,
  maxSize = 5,
  className = "",
}: EmployeePhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File size should not exceed ${maxSize}MB`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Only image files (JPG, PNG, WebP) are allowed');
      } else {
        setError('Invalid file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Call parent handler
      onPhotoChange(file);
    }
  }, [maxSize, onPhotoChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
    disabled
  });

  const removePhoto = () => {
    setPreview(null);
    setError(null);
    onPhotoChange(null);
    if (onPhotoUrlChange) {
      onPhotoUrlChange(null);
    }
  };

  const displayPhoto = preview || currentPhotoUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Camera className="h-4 w-4 text-gray-600" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Profile Photo
        </label>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          {displayPhoto ? (
            // Photo Preview/Display
            <div className="space-y-4">
              <div className="relative group">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                  <Image
                    src={displayPhoto}
                    alt="Profile photo"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                
                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {!disabled && (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Camera className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isDragActive ? 'Drop photo here' : 'Click or drag to change photo'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Upload Area
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Upload className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isDragActive ? 'Drop photo here' : 'Upload profile photo'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or WebP up to {maxSize}MB
                  </p>
                </div>
              </div>
            </div>
          )}          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
