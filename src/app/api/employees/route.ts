import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const employees = await prisma.employee.findMany({ include: { user: true, department: true } });
    return NextResponse.json(employees);
  }
  
  // POST create new employee
  export async function POST(req: Request) {
    const body = await req.json();
    const { userId, fullName, position, departmentId, phone, address, hireDate, status } = body;
  
    const newEmployee = await prisma.employee.create({
      data: {
        userId,
        fullName,
        position,
        departmentId,
        phone,
        address,
        hireDate: new Date(hireDate),
        status,
      },
    });
  
    return NextResponse.json(newEmployee);
  }
  