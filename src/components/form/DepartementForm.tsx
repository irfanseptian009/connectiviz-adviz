'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Department } from '@prisma/client';

type Props = {
  initialData?: Partial<Department>;
  onSubmit: (data: unknown) => void;
};

export default function DepartmentForm({ initialData = {}, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialData });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-gray-100 rounded-md">
      <input
        {...register('name')}
        placeholder="Department Name"
        className="border p-2 w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Submit</button>
    </form>
  );
}
