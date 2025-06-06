import api from "../lib/api";
import { Employee, } from "../types/employee";
import { employeeSchema } from './../schemas/employee';

export const getEmployees = () => api.get<Employee[]>("/users");

export const getEmployee = (id: number) =>
  api.get<Employee>(`/users/${id}`);

export const updateEmployee = (id: number, data: typeof employeeSchema) =>
  api.patch(`/users/${id}`, data);

export const deleteEmployee = (id: number) =>
  api.delete(`/users/${id}`);

export const createEmployee = (data: typeof employeeSchema) =>
  api.post<Employee>("/users", data);