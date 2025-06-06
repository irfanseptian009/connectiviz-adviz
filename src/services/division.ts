import api from "../lib/api";
import { Division } from "../types/division"; 

// Get all divisions
export const getDivisions = () => api.get<Division[]>("/divisions");

// Get single division (by ID)
export const getDivision = (id: number) =>
  api.get<Division>(`/divisions/${id}`);

// Create new division
export const createDivision = (data: Partial<Division>) =>
  api.post<Division>("/divisions", data);

// Update division
export const updateDivision = (id: number, data: Partial<Division>) =>
  api.patch<Division>(`/divisions/${id}`, data);

// Delete division
export const deleteDivision = (id: number) =>
  api.delete(`/divisions/${id}`);
