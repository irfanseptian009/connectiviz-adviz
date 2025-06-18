
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <ThemeProvider>
          {children}
      </ThemeProvider>
    </div>
  );
}



