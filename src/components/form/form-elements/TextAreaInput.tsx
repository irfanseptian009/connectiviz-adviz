"use client";

import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from "../input/InputField";

export default function TextAreaInput() {
  
  const educationOptions = [
    { value: "s1", label: "S1" },
    { value: "d3", label: "D3" },
    { value: "sma", label: "SMA" },
  ];

  const universityTypeOptions = [
    { value: "swasta", label: "Swasta" },
    { value: "negeri", label: "Negeri" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Textarea input field">
        {/* Education Information */}
        <div>
          <Label>Pendidikan</Label>
          <Select
            options={educationOptions}
            placeholder="Pilih Pendidikan Terakhir"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>Fakultas</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Jurusan</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Nama Universitas</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Swasta/Negeri</Label>
          <Select
            options={universityTypeOptions}
            placeholder="Pilih Jenis Universitas"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>IPK</Label>
          <Input type="number" step={0.01} />
        </div>
    </ComponentCard>
  );
}
