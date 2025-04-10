'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@prisma/client';
import UserForm from './../../../../components/form/UserForm';

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const handleSubmit = async (data: unknown) => {
    if (selectedUser) {
      await api.put(`/users/${selectedUser.id}`, data);
    } else {
      await api.post('/users', data);
    }
    setSelectedUser(null);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <UserForm onSubmit={handleSubmit} initialData={selectedUser || { role: 'EMPLOYEE' }} />

      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center">
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => setSelectedUser(user)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
