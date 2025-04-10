'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Role, User } from '@prisma/client';

type Props = {
  initialData?: Partial<User>;
  onSubmit: (data: unknown) => void;
};

export default function UserForm({ initialData = {}, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <input {...register('username')} placeholder="Username" className="border p-2 w-full" />
      <input {...register('email')} placeholder="Email" type="email" className="border p-2 w-full" />
      <input {...register('password')} placeholder="Password" type="password" className="border p-2 w-full" />
      <select {...register('role')} className="border p-2 w-full">
        {Object.values(Role).map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Submit</button>
    </form>
  );
}
