"use client";

interface NonFormalEducation {
  name: string;
  institution: string;
}

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchUserById } from "@/store/userSlice";
import { withAuth } from "@/context/AuthContext";

function DetailKaryawanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) => state.user.list);
  const status = useSelector((state: RootState) => state.user.status);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(Number(id)));
    }
  }, [dispatch, id]);

  const user = userList.find((u) => u.id === Number(id));

  const formatFieldName = (key: string) => {
    const fieldMappings: Record<string, string> = {
      fullName: "Nama Lengkap",
      email: "Email",
      phoneNumber: "No. HP",
      nationalId: "NIK",
      address: "Alamat",
      placeOfBirth: "Tempat Lahir",
      dateOfBirth: "Tanggal Lahir",
      gender: "Jenis Kelamin",
      position: "Posisi",
      jobLevel: "Level Jabatan",
      divisionId: "Divisi",
      motherName: "Nama Ibu",
      fatherName: "Nama Ayah",
      maritalStatus: "Status Pernikahan",
      spouseName: "Nama Pasangan",
      lastEducation: "Pendidikan Terakhir",
      facultyName: "Fakultas",
      majorName: "Jurusan",
      graduationYear: "Tahun Lulus",
      gpa: "IPK",
      identityCard: "KTP",
      taxNumber: "NPWP",
      drivingLicense: "SIM",
      bpjsHealth: "BPJS Kesehatan",
      bpjsEmployment: "BPJS Ketenagakerjaan",
      insuranceCompany: "Perusahaan Asuransi",
      insuranceNumber: "No Asuransi",
      policyNumber: "No Polis",
      ptkpStatus: "Status PTKP",
      bloodType: "Golongan Darah",
      medicalHistory: "Riwayat Penyakit",
      allergies: "Alergi",
      height: "Tinggi (cm)",
      weight: "Berat (kg)",
      emergencyContactName: "Nama Kontak Darurat",
      emergencyContactRelation: "Hubungan",
      emergencyContactPhone: "No HP Kontak Darurat",
      bankName: "Bank",
      bankAccountNumber: "No Rekening",
      bankAccountName: "Nama di Rekening",
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
    };
    return fieldMappings[key] || key;
  };

  const formatFieldValue = (key: string, value: string | number | string[] | NonFormalEducation[] | null | undefined): string => {
      if (!value) return "-";
      if (key === "dateOfBirth") {
        return new Date(value as string).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      if (Array.isArray(value)) {
        if (key === "nonFormalEducations") {
          return (value as NonFormalEducation[])
            .map(edu => `${edu.name} - ${edu.institution}`)
            .join(", ");
        }
        return value.join(", ");
      }
      return String(value);
    };

  const sections: { title: string; fields: string[] }[] = [
    {
      title: "Data Pribadi",
      fields: ["fullName", "nationalId", "email", "phoneNumber", "placeOfBirth", "dateOfBirth", "gender", "address"],
    },
    {
      title: "Organisasi",
      fields: ["position", "jobLevel", "officeEmail", "divisionId"],
    },
    {
      title: "Keluarga",
      fields: ["motherName", "fatherName", "maritalStatus", "spouseName", "childrenNames"],
    },
    {
      title: "Pendidikan",
      fields: ["lastEducation", "facultyName", "majorName", "graduationYear", "gpa"],
    },
    {
      title: "Dokumen & Asuransi",
      fields: [
        "identityCard",
        "taxNumber",
        "drivingLicense",
        "bpjsHealth",
        "bpjsEmployment",
        "insuranceCompany",
        "insuranceNumber",
        "policyNumber",
        "ptkpStatus",
      ],
    },
    {
      title: "Kesehatan",
      fields: ["bloodType", "height", "weight", "medicalHistory", "allergies"],
    },
    {
      title: "Kontak Darurat",
      fields: ["emergencyContactName", "emergencyContactRelation", "emergencyContactPhone"],
    },
    {
      title: "Keuangan",
      fields: ["bankName", "bankAccountNumber", "bankAccountName"],
    },
    {
      title: "Media Sosial",
      fields: ["instagram", "facebook", "twitter", "linkedin", "tiktok"],
    },
  ];

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-600">
        Data karyawan tidak ditemukan.
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{user.fullName || "Detail Karyawan"}</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 dark:bg-blue-900 hover:bg-gray-300 rounded"
          >
            Kembali
          </button>
        </div>

        {/* Render berdasarkan kategori */}
        {sections.map((section) => {
          const visibleFields = section.fields.filter((key) => user[key as keyof typeof user] !== undefined);
          if (visibleFields.length === 0) return null;

          return (
            <div key={section.title} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleFields.map((key) => (
                  <div key={key} className="bg-gray-50 dark:bg-slate-700 p-4 rounded shadow-sm">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      {formatFieldName(key)}
                    </div>
                    <div className="text-gray-800 dark:text-white">
                      {formatFieldValue(key, user[key as keyof typeof user])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withAuth(DetailKaryawanPage);
