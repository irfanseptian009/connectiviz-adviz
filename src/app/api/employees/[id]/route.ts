import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = { params: { id: string } };

// GET employee by ID
export async function GET(req: Request, { params }: Params) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  return NextResponse.json(employee);
}

// PUT update employee by ID
export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const employee = await prisma.employee.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(employee);
}

// DELETE employee by ID
export async function DELETE(req: Request, { params }: Params) {
  await prisma.employee.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'User deleted' });
}
