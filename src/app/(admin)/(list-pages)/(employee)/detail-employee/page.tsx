import dynamic from "next/dynamic";
import { Suspense } from "react";

const EmployeeDetailClient = dynamic(() => import('@/components/employee/EmployeeDetailClient'), {
  ssr: true,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading detail...</div>}>
      <EmployeeDetailClient />
    </Suspense>
  );
}
