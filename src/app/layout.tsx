import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/components/auth/SignInForm";
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-black bg-orange-25`}>
        <AuthProvider> 
          <ThemeProvider>
            <Toaster position="top-right"
              // toastOptions={{
              //   className: "",
              //   duration: 5000,
              //   style: {
              //     background: "#363636",
              //     color: "#fff",
              //   },
              // }}
            />
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
