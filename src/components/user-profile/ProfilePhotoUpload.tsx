"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Camera, Trash2 } from 'lucide-react';
import { profilePhotoService } from '@/services/profilePhotoService';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdated?: (photoUrl: string | null) => void;
  className?: string;
}

export default function ProfilePhotoUpload({
  currentPhotoUrl,
  onPhotoUpdated,
  className = '',
}: ProfilePhotoUploadProps) {  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user, updateUser } = useAuth();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File terlalu besar. Maksimal 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipe file tidak valid. Hanya JPEG, PNG, dan WebP yang diizinkan');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload file
      setUploading(true);
      try {
        const response = await profilePhotoService.uploadProfilePhoto(file);
        toast.success('Foto profil berhasil diupload');
        onPhotoUpdated?.(response.profilePictureUrl);
        setPreview(null);
        // Update user in context
        if (user) {
          updateUser(response.user);
        }
      } catch (error: unknown) {
        console.error('Upload error:', error);
        let errorMessage = 'Gagal mengupload foto profil';
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        }
        toast.error(errorMessage);
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onPhotoUpdated, user, updateUser]
  );

  const handleDeletePhoto = async () => {
    if (!currentPhotoUrl) return;

    setUploading(true);
    try {
      const response = await profilePhotoService.deleteProfilePhoto();
      toast.success('Foto profil berhasil dihapus');
      onPhotoUpdated?.(null);
      // Update user in context
      if (user) {
        updateUser(response.user);
      }
    } catch (error: unknown) {
      console.error('Delete error:', error);
      let errorMessage = 'Gagal menghapus foto profil';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Photo Display */}
      {(currentPhotoUrl || preview) && (        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={preview || currentPhotoUrl || '/images/user/default-avatar.png'}
              alt="Profile"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          {currentPhotoUrl && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-0 right-0 rounded-full w-8 h-8 p-0"
              onClick={handleDeletePhoto}
              disabled={uploading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <Card className="border-dashed border-2">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              cursor-pointer text-center space-y-4 p-8 rounded-lg transition-colors
              ${isDragActive 
                ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="flex justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              ) : (
                <Camera className="h-12 w-12 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {uploading ? 'Mengupload...' : 'Upload Foto Profil'}
              </h3>
              <p className="text-sm text-gray-500">
                {isDragActive
                  ? 'Lepaskan file di sini...'
                  : 'Drag & drop foto atau klik untuk pilih file'}
              </p>
              <p className="text-xs text-gray-400">
                Maksimal 5MB • JPEG, PNG, WebP
              </p>
            </div>

            {!uploading && (
              <Button variant="outline" className="mt-4">
                <Upload className="h-4 w-4 mr-2" />
                Pilih Foto
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Actions */}
      {preview && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreview(null)}
            disabled={uploading}
          >
            <X className="h-4 w-4 mr-2" />
            Batal
          </Button>
        </div>
      )}
    </div>
  );
}
