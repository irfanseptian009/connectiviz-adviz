import api from "../lib/api";
import { Karyawan, } from "../types/karyawan";
import { KaryawanUpdateDto } from "../schemas/employee";

export const getEmployees = () => api.get<Karyawan[]>("/users");

export const getEmployee = (id: number) =>
  api.get<Karyawan>(`/users/${id}`);

export const updateEmployee = (id: number, data: KaryawanUpdateDto) =>
  api.patch(`/users/${id}`, data);

export const deleteEmployee = (id: number) =>
  api.delete(`/users/${id}`);
