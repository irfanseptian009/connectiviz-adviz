"use client";


import React from "react";
import NarukuSidebar from "@/layout/NarukuSidebar";
import NarukuBackdrop from "@/layout/NarukuBackdrop";
import NarukuHeader from "@/layout/NarukuHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  

  return (
    <div className="min-h-screen xl:flex ml-18">
      {/* Sidebar and Backdrop */}
      <NarukuSidebar />
      <NarukuBackdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out `}
      >
        {/* Header */}
        <NarukuHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
