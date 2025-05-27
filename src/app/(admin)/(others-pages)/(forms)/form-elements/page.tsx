"use client";

import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { withAuth, useAuth } from '../../../../../components/auth/SignInForm';
import { toast } from 'react-hot-toast';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Karyawan } from '@/types/karyawan';

function AddUserPage() {
  const [form, setForm] = useState<Karyawan>({
    id: 0,  
    name: '', email: '', password: '', role: 'EMPLOYEE',
    namaLengkap: '', namaPerusahaan: '', namaPanggilan: '',
    jk: '', employeeId: '', tempatLahir: '', noTelp: '',
    tanggalLahir: '', golDarah: '', statusMenikah: '', agama: '',
    jabatan: '', statusKerja: '', tanggalMasuk: '',
    pendidikan: '', fakultas: '', jurusan: '', universitas: '', swastaNegeri: '', ipk: '',
    domisili: '', alamatDomisili: '', alamatKtp: '', noKtp: '', noKk: '',
    bpjsTk: '', bpjsKes: '', statusPtkp: '', kategoriPph: '', npwp: '', kartuAsuransi: '', memberNumber: '', noPolis: '',
    emailPribadi: '', emailPerusahaan: '', kontakDaruratNama: '', kontakDaruratHubungan: '', kontakDaruratHp: '',
    ig: '', linkedin: '', bank: '', noRekening: '', namaRekening: '',
  });

  const [error, setError] = useState('');
  const router = useRouter();
  const { token } = useAuth() ?? {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const dataToSend = {
        ...form,
        tanggalLahir: form.tanggalLahir ? new Date(form.tanggalLahir).toISOString() : undefined,
        tanggalMasuk: form.tanggalMasuk ? new Date(form.tanggalMasuk).toISOString() : undefined,
      };
      await axios.post('http://localhost:4000/users', dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Karyawan berhasil ditambahkan!');
      router.push('/list-employee');
    } catch (error) { 
      toast.error('Gagal menambahkan karyawan '+ error );
    }
  };

  const selectFields = {
    jk: ['L', 'P'],
    statusMenikah: ['Belum Menikah', 'Menikah', 'Cerai'],
    agama: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu']
  };

  const sections = [
    { title: 'Akun & Role', fields: ['name', 'email', 'password', 'role'] },
    { title: 'Data Pribadi', fields: ['namaLengkap', 'namaPerusahaan', 'namaPanggilan', 'jk', 'employeeId', 'tempatLahir', 'tanggalLahir', 'golDarah', 'statusMenikah', 'agama', 'noTelp'] },
    { title: 'Pekerjaan & Pendidikan', fields: ['jabatan', 'statusKerja', 'tanggalMasuk', 'pendidikan', 'fakultas', 'jurusan', 'universitas', 'swastaNegeri', 'ipk'] },
    { title: 'Alamat & Dokumen', fields: ['domisili', 'alamatDomisili', 'alamatKtp', 'noKtp', 'noKk'] },
    { title: 'BPJS, Pajak, Asuransi', fields: ['bpjsTk', 'bpjsKes', 'statusPtkp', 'kategoriPph', 'npwp', 'kartuAsuransi', 'memberNumber', 'noPolis'] },
    { title: 'Email & Kontak Darurat', fields: ['emailPribadi', 'emailPerusahaan', 'kontakDaruratNama', 'kontakDaruratHubungan', 'kontakDaruratHp'] },
    { title: 'Sosial & Bank', fields: ['ig', 'linkedin', 'bank', 'noRekening', 'namaRekening'] }
  ];

  const beautifyLabel = (str: string) =>
    str
      .replace(/([A-Z])/g, ' $1')      
      .replace(/\b\w/g, c => c.toUpperCase()) 
      .trim();

  return (
    <div className="nav p-10">
      <PageBreadcrumb pageTitle="Form Tambah Karyawan" />
      <div className="bg-blu e-50 dark:bg-gray-900 rounded-t-[50px] rounded-b-xl">
        <div className="h-20 rounded-t-[50px]  opacity-50 bg-gradient-to-r from-[#EBB317] to-[#1D95D7]" />
       
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white  dark:bg-slate-800  p-6 px-10 rounded shadow-lg">
            <h1 className="col-span-2 dark:text-white text-2xl font-bold mb-2">Tambah Data Karyawan Lengkap</h1>
            {sections.map(section => (
              <React.Fragment key={section.title}>
                <h2 className="col-span-2 text-xl dark:text-gray-100 font-semibold mt-6">{section.title}</h2>
                {section.fields.map((key) =>
                  selectFields[key as keyof typeof selectFields] ? (
                    <div key={key}>
                      <label className="block mb-1 font-medium dark:text-gray-200">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <select
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border dark:text-gray-200 rounded"
                      >
                        <option value="">Pilih...</option>
                        {selectFields[key as keyof typeof selectFields].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div key={key}>
                      <label className="block mb-1 dark:text-gray-100 font-medium"> {beautifyLabel(key)}</label>
                      <input
                        type={key.includes('tanggal') ? 'date' : 'text'}
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 dark:text-white border rounded"
                      />
                    </div>
                  )
                )}
              </React.Fragment>
            ))}
            {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white  px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Tambah
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}

export default withAuth(AddUserPage);
