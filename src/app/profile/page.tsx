"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import EmployeeDetailClient from "@/components/employee/EmployeeDetailClient";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);
  if (!user) return null;
  return (
    <div className="">
      <EmployeeDetailClient user={user} />
    </div>
  );
}
