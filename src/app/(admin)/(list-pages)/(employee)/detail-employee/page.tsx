"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth, withAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

function DetailKaryawanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
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

  const formatFieldName = (key: string) => {
    const fieldMappings: { [key: string]: string } = {
      nama: "Nama Lengkap",
      email: "Email",
      telepon: "Nomor Telepon",
      alamat: "Alamat",
      posisi: "Posisi/Jabatan",
      departemen: "Departemen",
      tanggalMasuk: "Tanggal Masuk",
      gaji: "Gaji",
      status: "Status Karyawan",
      id: "ID Karyawan",
    };
    return (
      fieldMappings[key] ||
      key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );
  };

  const formatFieldValue = (key: string, value: any) => {
    if (!value) return "-";

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.length
          ? value.map((item: any, index: number) => (
              <div key={index} className="mb-2">
                {typeof item === "object"
                  ? Object.entries(item).map(([k, v]) => (
                      <div key={k}>
                        <strong>{formatFieldName(k)}:</strong> {String(v)}
                      </div>
                    ))
                  : String(item)}
              </div>
            ))
          : "-";
      } else {
        return Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <strong>{formatFieldName(k)}:</strong> {String(v)}
          </div>
        ));
      }
    }

    if (key === "gaji") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(value);
    }

    if (key === "tanggalMasuk" && value) {
      return new Date(value).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return String(value);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!data) {
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
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{data.nama || "Detail Karyawan"}</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Kembali
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-1">
                {formatFieldName(key)}
              </div>
              <div className="text-gray-800">{formatFieldValue(key, value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(DetailKaryawanPage);
