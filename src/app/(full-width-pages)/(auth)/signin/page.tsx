import LoginPage from "@/components/auth/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " SignIn Page | connectiviz",
  description: "This is connectiviz Signin Page ",
};

export default function SignIn() {
  return <LoginPage />;
}
