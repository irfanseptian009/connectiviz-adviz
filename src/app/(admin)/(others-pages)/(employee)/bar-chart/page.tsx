'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Department } from '@prisma/client';
import DepartmentForm from './../../../../../components/form/DepartementForm';

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const fetchDepartments = async () => {
    const res = await api.get('/departments');
    setDepartments(res.data);
  };

  const handleSubmit = async (data: unknown) => {
    if (selectedDepartment) {
      await api.put(`/departments/${selectedDepartment.id}`, data);
    } else {
      await api.post('/departments', data);
    }
    setSelectedDepartment(null);
    fetchDepartments();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/departments/${id}`);
    fetchDepartments();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Department Management</h1>

      <DepartmentForm onSubmit={handleSubmit} initialData={selectedDepartment || {}} />

      <table className="w-full mt-6 border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Department Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dep => (
            <tr key={dep.id}>
              <td className="p-2 border">{dep.name}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => setSelectedDepartment(dep)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(dep.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
