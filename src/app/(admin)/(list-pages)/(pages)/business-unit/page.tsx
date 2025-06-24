import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BusinessUnitList from "@/components/employeeMonitoring/BusinessUnitList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "business unit | connectiviz",
  description:
    "business unit page for connectiviz by adviz",
};

export default function BusinessUnit() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Business Unit" />
      <div className="space-y-6">
          <BusinessUnitList/>
      </div>
    </div>
  );
}
