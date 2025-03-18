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
        {/* <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0"> */}
          {children}
        {/* </div> */}
      </ThemeProvider>
    </div>
  );
}
