import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ListEmployee from "@/components/employee/listEmployee";
import { AdminOnly } from "@/components/common/RoleGuard";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "table page | connectiviz",
  description:
    "table page for connectiviz by adviz",
};

export default function BasicTables() {
  return (
    <AdminOnly 
      fallback={
        <div>
          <PageBreadcrumb pageTitle="Table" />
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  You don&apos;t have permission to view employee tables. This feature is only available for administrators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <div>
        <PageBreadcrumb pageTitle="Table" />
        <div className="space-y-6 ">
          <ComponentCard title="Table Employee">
            <ListEmployee />
          </ComponentCard>
        </div>
      </div>
    </AdminOnly>
  );
}
