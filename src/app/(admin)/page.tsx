"use client";

import CardGate from "@/components/gate/CardGate";
import React, { useState } from "react";
import carosel from "../../../public/images/carousel/carosel1.png";
import Image from "next/image";
import { withAuth } from "@/context/AuthContext";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { PageSkeleton } from "@/components/common/Skeleton";

function Gate() {
  const [showSkeleton,] = useState(false);
  const { navigateWithLoading } = useNavigationWithLoading();



  if (showSkeleton) {
    return <PageSkeleton className="p-6" />;
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col w-full">
        <Image
          src={carosel}
          alt="carousel"
          className="h-56 w-full justify-center rounded-4xl mb-8 shadow-xl border-4 border-orange-500 dark:border-gray-500/30"
        />
        <div className="min-h-screen w-full items-start rounded-2xl border pallet border-gray-200 bg-white py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="w-30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-3">
            <button onClick={() => navigateWithLoading('/naruku', 'Loading Naruku...')}>
              <CardGate />
            </button>
          </div>
          
        
        </div>
      </div>
      <div className="w-72 rounded-2xl bg-blue-500 dark:bg-slate-800"></div>
    </div>
  );
}

export default withAuth(Gate); 
