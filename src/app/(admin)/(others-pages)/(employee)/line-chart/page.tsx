'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Department, Employee, User } from '@prisma/client';
import EmployeeForm from '../../../../../components/form/EmployeeForm';

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchAll = async () => {
    const [empRes, userRes, deptRes] = await Promise.all([
      api.get('/employees'),
      api.get('/users'),
      api.get('/departments'),
    ]);

    setEmployees(empRes.data);
    setUsers(userRes.data);
    setDepartments(deptRes.data);
  };

  const handleSubmit = async (data: unknown) => {
    if (selectedEmployee) {
      await api.put(`/employees/${selectedEmployee.id}`, data);
    } else {
      await api.post('/employees', data);
    }
    setSelectedEmployee(null);
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/employees/${id}`);
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <EmployeeForm
        onSubmit={handleSubmit}
        initialData={selectedEmployee || { status: 'ACTIVE' }}
        users={users}
        departments={departments}
      />

      <table className="w-full mt-6 border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Position</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td className="p-2 border">{emp.fullName}</td>
              <td className="p-2 border">{emp.userId}</td>
              <td className="p-2 border">{emp.position}</td>
              <td className="p-2 border">{emp.departmentId}</td>
              <td className="p-2 border">{emp.status}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => setSelectedEmployee(emp)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(emp.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
