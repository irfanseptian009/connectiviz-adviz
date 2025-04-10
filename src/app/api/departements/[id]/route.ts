import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = { params: { id: string } };

// GET department by ID
export async function GET(req: Request, { params }: Params) {
  const department = await prisma.department.findUnique({
    where: { id: params.id },
    include: { employees: true },
  });
  return NextResponse.json(department);
}

// PUT update department by ID
export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const department = await prisma.department.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(department);
}

// DELETE department by ID
export async function DELETE(req: Request, { params }: Params) {
  await prisma.department.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'User deleted' });
}
