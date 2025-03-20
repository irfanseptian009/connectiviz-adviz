import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ResponsiveImage from "@/components/ui/images/ResponsiveImage";
import ThreeColumnImageGrid from "@/components/ui/images/ThreeColumnImageGrid";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Connectiviz",
  description:
    "connectiviz by adviz",
  // other metadata
};

export default function Images() {
  return (
    <div>
      <PageBreadcrumb pageTitle="arcticle Images" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Responsive image">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Image article">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </div>
  );
}
