import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = { params: { id: string } };

// GET user by ID
export async function GET(req: Request, { params }: Params) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { employee: true },
  });
  return NextResponse.json(user);
}

// PUT update user by ID
export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const user = await prisma.user.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(user);
}

// DELETE user by ID
export async function DELETE(req: Request, { params }: Params) {
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'User deleted' });
}
