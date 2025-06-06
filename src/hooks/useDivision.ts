"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDivisions,
  getDivision,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../services/division";
import { Division } from "../types/division";
import toast from "react-hot-toast";

export function useDivision() {
  const [list, setList] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getDivisions();
      setList(data);
    } catch {
      toast.error("Failed to fetch divisions");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = async (id: number) => {
    const { data } = await getDivision(id);
    return data;
  };

  const create = async (payload: Partial<Division>) => {
    await createDivision(payload);
    toast.success("Division created");
    fetchAll();
  };

  const save = async (id: number, payload: Partial<Division>) => {
    await updateDivision(id, payload);
    toast.success("Division updated");
    fetchAll();
  };

  const remove = async (id: number) => {
    await deleteDivision(id);
    toast.success("Division deleted");
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { list, loading, fetchById, create, save, remove };
}
