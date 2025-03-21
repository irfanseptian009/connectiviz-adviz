"use client";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { CalenderIcon, } from "../../../icons";

export default function PersonalInformation() {


  const genderOptions = [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
  ];

  const bloodTypeOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
  ];

  const maritalStatusOptions = [
    { value: "menikah", label: "Menikah" },
    { value: "belum_menikah", label: "Belum Menikah" },
  ];

  const religionOptions = [
    { value: "islam", label: "Islam" },
    { value: "kristen", label: "Kristen" },
    { value: "katolik", label: "Katolik" },
    { value: "hindu", label: "Hindu" },
    { value: "buddha", label: "Buddha" },
    { value: "konghucu", label: "Konghucu" },
  ];

  


  const ptaxOptions = [
    { value: "TK0", label: "TK/0" },
    { value: "K0", label: "K/0" },
    { value: "K1", label: "K/1" },
    { value: "K2", label: "K/2" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard className="shadow-lg" title="Personal Information">
      <div className="space-y-6 ">
        {/* Personal Information */}
        <div>
          <Label>Nama Lengkap Karyawan</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Nama Perusahaan</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Nama Panggilan</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>JK</Label>
          <Select
            options={genderOptions}
            placeholder="Pilih Jenis Kelamin"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>Employee ID</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Tempat Lahir</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>No Telp Karyawan</Label>
          <Input type="tel" />
        </div>
        <div>
          <Label>Tanggal Lahir</Label>
          <div className="relative">
            <Input type="date" />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>
        <div>
          <Label>Gol Darah</Label>
          <Select
            options={bloodTypeOptions}
            placeholder="Pilih Golongan Darah"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>Status Menikah</Label>
          <Select
            options={maritalStatusOptions}
            placeholder="Pilih Status Pernikahan"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>Agama</Label>
          <Select
            options={religionOptions}
            placeholder="Pilih Agama"
            onChange={handleSelectChange}
          />
        </div>

     

      

        {/* Address Information */}
        <div>
          <Label>Domisili</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Alamat Domisili</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Alamat KTP</Label>
          <Input type="text" />
        </div>

      

        {/* Tax Information */}
        <div>
          <Label>Status PTKP</Label>
          <Select
            options={ptaxOptions}
            placeholder="Pilih Status PTKP"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>Kategori</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>PPH</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>No NPWP</Label>
          <Input type="text" />
        </div>

        {/* Insurance Information */}
        <div>
          <Label>No Kartu Asuransi Member Number</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>No Polis</Label>
          <Input type="text" />
        </div>

        

    
      </div>
    </ComponentCard>
  );
}