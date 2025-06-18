"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEmployees,
  getEmployee,
  deleteEmployee,
} from "../services/employee";
import { Employee } from "../types/employee";
import toast from "react-hot-toast";

export function useEmployee() {
  const [list, setList] = useState<Employee[]>([]);
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

 
  const remove = async (id: number) => {
    await deleteEmployee(id);
    toast.success("Data successfully deleted");
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

 

  return { list, loading, fetchById,  remove,  };
}
