import api from "../lib/api";
import { User } from "../types/employee";
import { EmployeeData } from '../schemas/employee';
import { EmployeeUpdateData } from '../schemas/employeeUpdateSchema';

export const getEmployees = () => api.get<User[]>("/users");

export const getEmployee = (id: number) =>
  api.get<User>(`/users/${id}`);

export const updateEmployee = (id: number, data: EmployeeUpdateData) =>
  api.patch(`/users/${id}`, data);

export const deleteEmployee = (id: number) =>
  api.delete(`/users/${id}`);

export const createEmployee = (data: EmployeeData) =>
  api.post<User>("/users", data);