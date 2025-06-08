"use client";

// import type { Metadata } from "next";

import React from "react";
import MonthlyTarget from "@/components/gate/MonthlyTarget";
import StatisticsChart from "@/components/gate/StatisticsChart";
import DemographicCard from "@/components/gate/DemographicCard";
import { Metrics } from "@/components/gate/Metrics";
import AttendantOverview from "@/components/gate/AttendantOverview";
import VerticalPerformance from "@/components/gate/VerticalPerformance";
import { withAuth } from "@/context/AuthContext";

// export const metadata: Metadata = {
//   title:
//     "Naruku Dashboard | Naruku",
//   description: "This is naruku Dashboard",
// };

function naruku() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <Metrics />

        <VerticalPerformance />
      </div>

      <div className="col-span-12 xl:col-span-5">
 
      <MonthlyTarget /> 
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        
      <AttendantOverview/>
      </div>
    </div>
  );
}

export default withAuth(naruku); 
