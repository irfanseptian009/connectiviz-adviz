import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all departments
export async function GET() {
    const departments = await prisma.department.findMany({ include: { employees: true } });
    return NextResponse.json(departments);
  }
  
  // POST create new department
  export async function POST(req: Request) {
    const body = await req.json();
    const { name } = body;
  
    const newDept = await prisma.department.create({
      data: { name },
    });
    return NextResponse.json(newDept);
  }
  