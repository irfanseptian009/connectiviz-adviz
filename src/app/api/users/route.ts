import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all users
export async function GET() {
  const users = await prisma.user.findMany({ include: { employee: true } });
  return NextResponse.json(users);
}

// POST create new user
export async function POST(req: Request) {
  const body = await req.json();
  const { username, email, password, role } = body;

  const newUser = await prisma.user.create({
    data: { username, email, password, role },
  });

  return NextResponse.json(newUser);
}
