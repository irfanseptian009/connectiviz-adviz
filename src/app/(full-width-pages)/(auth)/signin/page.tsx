import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " SignIn Page | connectiviz",
  description: "This is connectiviz Signin Page ",
};

export default function SignIn() {
  return <SignInForm />;
}
