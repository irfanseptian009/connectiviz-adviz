// import GridShape from "@/components/common/GridShape";
// import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
// import Image from "next/image";
// import Link from "next/link";
import React from "react";
// import logo from "../../../../public/images/logo/logo1.png"

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



