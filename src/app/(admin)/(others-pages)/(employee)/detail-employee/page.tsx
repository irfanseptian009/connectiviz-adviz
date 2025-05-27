"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth, withAuth } from '@/components/auth/SignInForm';
import { toast } from 'react-hot-toast';

function DetailKaryawanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
       
      } catch (err) {
        toast.error("Gagal memuat data karyawan");
      } finally {
        setLoading(false);
      }
     
    };
    
    if (id) fetchDetail();
  }, [id, token]);

  if (loading) return <p className="p-6">Memuat detail...</p>;
  if (!data) return <p className="p-6">Data tidak ditemukan</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profil Karyawan</h1>
        <button
          onClick={() => router.back()}
          className="text-sm bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
        >
          Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-gray-50 border p-4 rounded">
            <p className="text-gray-500 font-medium">
              {key.replace(/([A-Z])/g, ' $1')}
            </p>
            <p className="text-gray-800 text-base mt-1">
              {value || '-'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(DetailKaryawanPage);