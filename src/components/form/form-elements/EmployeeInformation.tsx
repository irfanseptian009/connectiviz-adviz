"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { CalenderIcon } from "@/icons";

export default function EmployeeInformation() {
  const employmentStatusOptions = [
    { value: "tetap", label: "Tetap" },
    { value: "kontrak", label: "Kontrak" },
    { value: "probation", label: "Probation" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <ComponentCard className="shadow-lg" title="Employee Information">
       {/* Employment Information */}
       <div>
          <Label>Jabatan</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Status Kerja</Label>
          <Select
            options={employmentStatusOptions}
            placeholder="Pilih Status Kerja"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>Tanggal Masuk Kerja</Label>
          <div className="relative">
            <Input type="date" />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>
    </ComponentCard>
  );
}
