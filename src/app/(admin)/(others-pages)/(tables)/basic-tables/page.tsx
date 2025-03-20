import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "table page | connectiviz",
  description:
    "table page for connectiviz by adviz",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Table" />
      <div className="space-y-6 pallet ">
        <ComponentCard title="Table Employee">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
