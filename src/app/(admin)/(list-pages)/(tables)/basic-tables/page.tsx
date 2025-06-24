import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ListEmployee from "@/components/employee/listEmployee";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "table page | connectiviz",
  description:
    "table page for connectiviz by adviz",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Table" />
      <div className="space-y-6 ">
        <ComponentCard title="Table Employee">
          <ListEmployee />
        </ComponentCard>
      </div>
    </div>
  );
}
