"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employee";
import { Karyawan } from "../types/karyawan";
import toast from "react-hot-toast";

export function useKaryawan() {
  const [list, setList] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getEmployees();
      setList(data);
    } catch {
      toast.error("Gagal memuat data karyawan");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = async (id: number) => {
    const { data } = await getEmployee(id);
    return data;
  };

  const save = async (id: number, payload: Karyawan) => {
    await updateEmployee(id, payload);
    toast.success("Data berhasil diperbarui");
    fetchAll();
  };

  const remove = async (id: number) => {
    await deleteEmployee(id);
    toast.success("Data berhasil dihapus");
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { list, loading, fetchById, save, remove };
}
