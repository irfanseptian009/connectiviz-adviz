import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | connectiviz",
  description: "Reset your password for connectiviz",
};

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
