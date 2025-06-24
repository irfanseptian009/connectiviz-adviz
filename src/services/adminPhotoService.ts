import axios from 'axios';
import { User } from '@/types/employee';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface AdminUploadPhotoResponse {
  message: string;
  profilePictureUrl: string;
  user: User;
}

export const adminPhotoService = {
  async uploadUserProfilePhoto(userId: number, file: File): Promise<AdminUploadPhotoResponse> {
    console.log('[Admin Photo Service] Upload request for userId:', userId);
    console.log('[Admin Photo Service] File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const formData = new FormData();
    formData.append('photo', file);

    const token = localStorage.getItem('token');
    console.log('[Admin Photo Service] Token available:', token ? 'Yes' : 'No');
      const url = `${API_BASE_URL}/users/${userId}/upload-photo`;
    console.log('[Admin Photo Service] Request URL:', url);
    
    try {
      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('[Admin Photo Service] Upload successful:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('[Admin Photo Service] Full error object:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        console.error('[Admin Photo Service] Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        
        // Throw with specific error message
        const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
        throw new Error(`Upload failed: ${errorMessage}`);
      }
      
      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[Admin Photo Service] Non-axios error:', errorMessage);
      throw new Error(`Upload failed: ${errorMessage}`);
    }
  },
  async deleteUserProfilePhoto(userId: number): Promise<{ message: string; user: User }> {
    console.log('[Admin Photo Service] Delete request for userId:', userId);
    
    const token = localStorage.getItem('token');
    console.log('[Admin Photo Service] Token available:', token ? 'Yes' : 'No');
    
    const url = `${API_BASE_URL}/users/${userId}/photo`;
    console.log('[Admin Photo Service] Delete URL:', url);
    
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[Admin Photo Service] Delete successful:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('[Admin Photo Service] Full delete error:', error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        console.error('[Admin Photo Service] Axios delete error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        
        // Throw with specific error message
        const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
        throw new Error(`Delete failed: ${errorMessage}`);
      }
      
      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('[Admin Photo Service] Non-axios delete error:', errorMessage);
      throw new Error(`Delete failed: ${errorMessage}`);
    }
  },
};
