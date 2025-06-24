import axios from 'axios';
import { User } from '@/types/employee';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface UploadProfilePhotoResponse {
  message: string;
  profilePictureUrl: string;
  user: User;
}

export const profilePhotoService = {
  async uploadProfilePhoto(file: File): Promise<UploadProfilePhotoResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_BASE_URL}/users/me/upload-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  async deleteProfilePhoto(): Promise<{ message: string; user: User }> {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(
      `${API_BASE_URL}/users/me/photo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};
