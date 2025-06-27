import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BusinessUnitList from "@/components/employeeMonitoring/BusinessUnitList";
import { AdminOnly } from "@/components/common/RoleGuard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "business unit | connectiviz",
  description:
    "business unit page for connectiviz by adviz",
};

export default function BusinessUnit() {
  return (
    <AdminOnly fallback={
      <div className="p-6">
        <PageBreadcrumb pageTitle="Business Unit" />
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access Business Unit management.
          </p>
        </div>
      </div>
    }>
      <div>
        <PageBreadcrumb pageTitle="Business Unit" />
        <div className="space-y-6">
            <BusinessUnitList/>
        </div>
      </div>
    </AdminOnly>
  );
}
