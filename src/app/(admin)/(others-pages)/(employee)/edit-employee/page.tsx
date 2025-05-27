"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuth, withAuth } from '@/components/auth/SignInForm';
import { toast } from 'react-hot-toast';

function EditKaryawanPage() {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        toast.error('Gagal memuat data karyawan');
        router.push('/list-employee');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [token, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:4000/users/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Karyawan berhasil diperbarui!');
      router.push('/list-employee');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui data');
    }
  };

  const fieldList = [
    'namaLengkap', 'email', 'jabatan', 'namaPerusahaan', 'namaPanggilan', 'jk', 'employeeId',
    'tempatLahir', 'tanggalLahir', 'golDarah', 'statusMenikah', 'agama', 'noTelp',
    'statusKerja', 'tanggalMasuk', 'pendidikan', 'fakultas', 'jurusan', 'universitas',
    'swastaNegeri', 'ipk', 'alamatDomisili', 'alamatKtp', 'noKtp', 'noKk',
    'bpjsTk', 'bpjsKes', 'statusPtkp', 'kategoriPph', 'npwp', 'kartuAsuransi',
    'memberNumber', 'noPolis', 'emailPribadi', 'kontakDaruratNama', 'kontakDaruratHubungan',
    'kontakDaruratHp', 'ig', 'linkedin', 'bank', 'noRekening', 'namaRekening'
  ];

  if (loading || !form) return <p className="p-8">Memuat data...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Edit Karyawan</h1>
        <button
          onClick={() => router.back()}
          className="text-sm bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
        >
          Kembali
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {fieldList.map((field) => (
          <div key={field}>
            <label className="block mb-1 font-medium text-gray-700">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field.toLowerCase().includes('tanggal') ? 'date' : 'text'}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}
        <div className="col-span-2 text-right mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditKaryawanPage);
