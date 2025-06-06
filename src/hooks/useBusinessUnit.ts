"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getBusinessUnits,
  getBusinessUnit,
  createBusinessUnit,
  updateBusinessUnit,
  deleteBusinessUnit,
} from "../services/businessUnit";
import { BusinessUnit } from "../types/businessUnit";
import toast from "react-hot-toast";

export function useBusinessUnit() {
  const [list, setList] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBusinessUnits();
      setList(data);
    } catch {
      toast.error("Failed to fetch business units");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = async (id: number) => {
    const { data } = await getBusinessUnit(id);
    return data;
  };

  const create = async (payload: Partial<BusinessUnit>) => {
    await createBusinessUnit(payload);
    toast.success("Business unit created");
    fetchAll();
  };

  const save = async (id: number, payload: Partial<BusinessUnit>) => {
    await updateBusinessUnit(id, payload);
    toast.success("Business unit updated");
    fetchAll();
  };

  const remove = async (id: number) => {
    await deleteBusinessUnit(id);
    toast.success("Business unit deleted");
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { list, loading, fetchById, create, save, remove };
}
