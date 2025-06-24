import LoginPage from "@/components/auth/LoginPage";
import { Metadata } from "next";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: " SignIn Page | connectiviz",
  description: "This is connectiviz Signin Page ",
};

function SignInLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <LoginPage />
    </Suspense>
  );
}
