import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrganizationChart from "@/components/employeeMonitoring/EmployeeOrganization";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "organization | connectiviz",
  description:
    "organization page for connectiviz by adviz",
};

export default function Organization() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Organization" />
      <div className="space-y-6  ">
          <OrganizationChart/>
      </div>
    </div>
  );
}
