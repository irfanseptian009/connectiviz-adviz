import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrganizationChart from "@/components/employeeMonitoring/EmployeeOrganization";
import { AdminOnly } from "@/components/common/RoleGuard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "organization | connectiviz",
  description:
    "organization page for connectiviz by adviz",
};

export default function Organization() {
  return (
    <AdminOnly fallback={
      <div className="p-6">
        <PageBreadcrumb pageTitle="Organization" />
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access Organization management.
          </p>
        </div>
      </div>
    }>
      <div>
        <PageBreadcrumb pageTitle="Organization" />
        <div className="space-y-6  ">
            <OrganizationChart/>
        </div>
      </div>
    </AdminOnly>
  );
}
