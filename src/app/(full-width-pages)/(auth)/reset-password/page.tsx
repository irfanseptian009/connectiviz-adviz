import ResetPasswordPage from "@/components/auth/ResetPasswordPage";
import { Metadata } from "next";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Reset Password | connectiviz",
  description: "Reset your password for connectiviz",
};

function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordPage />
    </Suspense>
  );
}