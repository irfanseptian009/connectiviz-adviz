import api from "../lib/api";
import { BusinessUnit } from "../types/businessUnit"; 

// Get all business units
export const getBusinessUnits = () => api.get<BusinessUnit[]>("/business-units");

// Get single business unit (by ID)
export const getBusinessUnit = (id: number) =>
  api.get<BusinessUnit>(`/business-units/${id}`);

// Create new business unit
export const createBusinessUnit = (data: Partial<BusinessUnit>) =>
  api.post<BusinessUnit>("/business-units", data);

// Update existing business unit
export const updateBusinessUnit = (id: number, data: Partial<BusinessUnit>) =>
  api.patch<BusinessUnit>(`/business-units/${id}`, data);

// Delete business unit
export const deleteBusinessUnit = (id: number) =>
  api.delete(`/business-units/${id}`);
