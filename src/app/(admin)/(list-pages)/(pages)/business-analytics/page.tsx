import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BusinessAnalyticsDashboard from "@/components/employeeMonitoring/BusinessAnalyticsDashboard.tsx";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "business analytics | connectiviz",
  description:
    "business analytics page for connectiviz by adviz",
};

export default function BusinessAnalytics() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Business Analytics" />
      <div className="space-y-6 ">
          <BusinessAnalyticsDashboard />
      </div>
    </div>
  );
}
