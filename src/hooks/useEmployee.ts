"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  createEmployee
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

  const save = async (id: number, payload: Employee) => {
    await updateEmployee(id, payload);
    toast.success("Data successfully updated");
    fetchAll();
  };

  const remove = async (id: number) => {
    await deleteEmployee(id);
    toast.success("Data successfully deleted");
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (payload: Employee) => {
    try {
      const response = await createEmployee(payload);
      toast.success("Data berhasil ditambahkan");
      fetchAll();
      return response;
    } catch (err: any) {
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        throw { validationErrors, message: "Validation failed" };
      }
      throw err;
    }
  };

  return { list, loading, fetchById, save, remove, create };
}
