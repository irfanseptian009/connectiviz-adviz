'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Department, Employee, EmployeeStatus, User } from '@prisma/client';

type Props = {
  initialData?: Partial<Employee>;
  users: User[];
  departments: Department[];
  onSubmit: (data: unknown) => void;
};

export default function EmployeeForm({ initialData = {}, users, departments, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialData });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-gray-100 rounded-md">
      <select {...register('userId')} className="border p-2 w-full" required>
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>

      <input {...register('fullName')} placeholder="Full Name" className="border p-2 w-full" required />
      <input {...register('position')} placeholder="Position" className="border p-2 w-full" required />
      <input {...register('phone')} placeholder="Phone" className="border p-2 w-full" />
      <input {...register('address')} placeholder="Address" className="border p-2 w-full" />
      <input {...register('hireDate')} type="date" className="border p-2 w-full" required />

      <select {...register('departmentId')} className="border p-2 w-full" required>
        <option value="">Select Department</option>
        {departments.map(dep => (
          <option key={dep.id} value={dep.id}>{dep.name}</option>
        ))}
      </select>

      <select {...register('status')} className="border p-2 w-full">
        {Object.values(EmployeeStatus).map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">Submit</button>
    </form>
  );
}
