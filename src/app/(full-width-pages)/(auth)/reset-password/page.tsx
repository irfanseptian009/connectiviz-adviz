import ResetPasswordPage from "@/components/auth/ResetPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | connectiviz",
  description: "Reset your password for connectiviz",
};

export default function ResetPassword() {
  return <ResetPasswordPage />;
}