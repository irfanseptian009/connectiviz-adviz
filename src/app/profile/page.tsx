"use client";

import React, { useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import EmployeeDetailClient from "@/components/employee/EmployeeDetailClient";

function ProfileLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);
  
  if (!user) return null;
  
  return (
    <div className="">
      <Suspense fallback={<ProfileLoading />}>
        <EmployeeDetailClient user={user} />
      </Suspense>
    </div>
  );
}
