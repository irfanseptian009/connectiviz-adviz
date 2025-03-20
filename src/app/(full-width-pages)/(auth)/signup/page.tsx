import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " SignUp Page | connectiviz",
  description: "This is SignUp Page connectiviz",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
