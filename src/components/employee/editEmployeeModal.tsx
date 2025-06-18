"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { User, NonFormalEducation, EditEmployeeModalProps } from "@/types/employee";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { fetchBusinessUnits } from "@/store/businessUnitSlice";

export default function EditEmployeeModal({
  isOpen,
  onClose,
  editData,
  setEditData,
  handleSave,
}: EditEmployeeModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);
  const divisionTree = useSelector((state: RootState) => state.division.tree);
  const [activeTab, setActiveTab] = useState("biodata");
  const [selectedBUId, setSelectedBUId] = useState<number | null>(null);

  useEffect(() => {
    if (businessUnits.length === 0) {
      dispatch(fetchBusinessUnits());
    }
  }, [dispatch, businessUnits.length]);

  useEffect(() => {
    if (editData?.divisionId && businessUnits.length > 0) {
      const foundBU = businessUnits.find((bu) => {
        const divisions = divisionTree[bu.id] || [];
        return divisions.some((div) => div.id === editData.divisionId);
      });
      
      if (foundBU) {
        setSelectedBUId(foundBU.id);
        if (!divisionTree[foundBU.id]) {
          dispatch(fetchDivisionTree(foundBU.id));
        }
      }
    }
  }, [editData?.divisionId, businessUnits, divisionTree, dispatch]);

  const handleChange = (field: keyof User, value: string | number | Date | null) => {
    setEditData({ ...editData!, [field]: value });
  };

  const handleArrayChange = (field: keyof User, index: number, value: string) => {
    const currentArray = (editData?.[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setEditData({ ...editData!, [field]: newArray });
  };

  const addArrayItem = (field: keyof User) => {
    const currentArray = (editData?.[field] as string[]) || [];
    setEditData({ ...editData!, [field]: [...currentArray, ''] });
  };

  const removeArrayItem = (field: keyof User, index: number) => {
    const currentArray = (editData?.[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setEditData({ ...editData!, [field]: newArray });
  };

  const handleBusinessUnitChange = (buId: string) => {
    const businessUnitId = Number(buId);
    setSelectedBUId(businessUnitId);
    
    handleChange("divisionId", null);
    
    if (businessUnitId && !divisionTree[businessUnitId]) {
      dispatch(fetchDivisionTree(businessUnitId));
    }
  };

  const handleNFChange = (index: number, field: keyof NonFormalEducation, value: string | number) => {
    const list = [...(editData?.nonFormalEducations || [])];
    list[index] = { ...list[index], [field]: value };
    setEditData({ ...editData!, nonFormalEducations: list });
  };

  const addNF = () => {
    const updated = [...(editData?.nonFormalEducations || []), { name: '', institution: '', year: 0, description: '' }];
    setEditData({ ...editData!, nonFormalEducations: updated });
  };

  const removeNF = (index: number) => {
    const updated = editData!.nonFormalEducations?.filter((_, i) => i !== index) || [];
    setEditData({ ...editData!, nonFormalEducations: updated });
  };

  // Get current divisions based on selected business unit
  const currentDivisions = selectedBUId ? divisionTree[selectedBUId] || [] : [];

  if (!editData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="biodata">Data Diri</TabsTrigger>
            <TabsTrigger value="family">Keluarga</TabsTrigger>
            <TabsTrigger value="education">Pendidikan</TabsTrigger>
            <TabsTrigger value="documents">Dokumen</TabsTrigger>
            <TabsTrigger value="contact">Kontak</TabsTrigger>
            <TabsTrigger value="social">Sosial</TabsTrigger>
            <TabsTrigger value="health">Kesehatan</TabsTrigger>
          </TabsList>

          {/* Data Diri Tab */}
          <TabsContent value="biodata" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={editData.username || ""} 
                onChange={(e) => handleChange("username", e.target.value)} 
                placeholder="Username" 
              />
              <Input 
                value={editData.email || ""} 
                onChange={(e) => handleChange("email", e.target.value)} 
                placeholder="Email" 
                type="email"
              />
              <Input 
                value={editData.officeEmail || ""} 
                onChange={(e) => handleChange("officeEmail", e.target.value)} 
                placeholder="Email Kantor" 
                type="email"
              />
              <Input 
                value={editData.nationalId || ""} 
                onChange={(e) => handleChange("nationalId", e.target.value)} 
                placeholder="NIK" 
              />
              <Input 
                value={editData.fullName || ""} 
                onChange={(e) => handleChange("fullName", e.target.value)} 
                placeholder="Nama Lengkap" 
              />
              <Input 
                value={editData.phoneNumber || ""} 
                onChange={(e) => handleChange("phoneNumber", e.target.value)} 
                placeholder="No HP" 
              />
              <Input 
                value={editData.placeOfBirth || ""} 
                onChange={(e) => handleChange("placeOfBirth", e.target.value)} 
                placeholder="Tempat Lahir" 
              />
              <Input 
                type="date"
                value={editData.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split('T')[0] : ""} 
                onChange={(e) => handleChange("dateOfBirth", new Date(e.target.value))} 
                placeholder="Tanggal Lahir" 
              />
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editData.role || "EMPLOYEE"}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <Textarea 
              value={editData.address || ""} 
              onChange={(e) => handleChange("address", e.target.value)} 
              placeholder="Alamat" 
            />
            
            {/* Position & Job Level */}
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={editData.position || ""} 
                onChange={(e) => handleChange("position", e.target.value)} 
                placeholder="Jabatan" 
              />
              <Input 
                value={editData.jobLevel || ""} 
                onChange={(e) => handleChange("jobLevel", e.target.value)} 
                placeholder="Level Jabatan" 
              />
            </div>

            {/* Business Unit & Division Selection */}
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedBUId || ""}
                onChange={(e) => handleBusinessUnitChange(e.target.value)}
              >
                <option value="">Pilih Business Unit</option>
                {businessUnits.map((bu) => (
                  <option key={bu.id} value={bu.id}>{bu.name}</option>
                ))}
              </select>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editData.divisionId || ""}
                onChange={(e) => handleChange("divisionId", Number(e.target.value))}
                disabled={!selectedBUId}
              >
                <option value="">Pilih Divisi</option>
                {currentDivisions.map((div) => (
                  <option key={div.id} value={div.id}>{div.name}</option>
                ))}
              </select>
            </div>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={editData.motherName || ""} 
                onChange={(e) => handleChange("motherName", e.target.value)} 
                placeholder="Nama Ibu" 
              />
              <Input 
                value={editData.fatherName || ""} 
                onChange={(e) => handleChange("fatherName", e.target.value)} 
                placeholder="Nama Ayah" 
              />
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editData.maritalStatus || ""}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
              >
                <option value="">Status Pernikahan</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Cerai">Cerai</option>
                <option value="Janda/Duda">Janda/Duda</option>
              </select>
              <Input 
                value={editData.spouseName || ""} 
                onChange={(e) => handleChange("spouseName", e.target.value)} 
                placeholder="Nama Pasangan" 
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Nama Anak-anak</h4>
              {(editData.childrenNames || []).map((child, i) => (
                <div key={i} className="flex gap-2">
                  <Input 
                    value={child} 
                    onChange={(e) => handleArrayChange("childrenNames", i, e.target.value)} 
                    placeholder={`Nama Anak ${i + 1}`} 
                  />
                  <Button variant="destructive" onClick={() => removeArrayItem("childrenNames", i)}>
                    Hapus
                  </Button>
                </div>
              ))}
              <Button onClick={() => addArrayItem("childrenNames")}>Tambah Anak</Button>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <h3 className="text-lg font-semibold">Pendidikan Formal</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={editData.lastEducation || ""} 
                onChange={(e) => handleChange("lastEducation", e.target.value)} 
                placeholder="Pendidikan Terakhir" 
              />
              <Input 
                value={editData.facultyName || ""} 
                onChange={(e) => handleChange("facultyName", e.target.value)} 
                placeholder="Fakultas" 
              />
              <Input 
                value={editData.majorName || ""} 
                onChange={(e) => handleChange("majorName", e.target.value)} 
                placeholder="Jurusan" 
              />
              <Input 
                type="number"
                value={editData.graduationYear || ""} 
                onChange={(e) => handleChange("graduationYear", Number(e.target.value))} 
                placeholder="Tahun Lulus" 
              />
              <Input 
                type="number"
                step="0.01"
                value={editData.gpa || ""} 
                onChange={(e) => handleChange("gpa", Number(e.target.value))} 
                placeholder="IPK" 
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Pendidikan Non Formal</h4>
              {(editData.nonFormalEducations || []).map((edu, i) => (
                <div key={i} className="space-y-2 border rounded p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Nama Pendidikan" value={edu.name} onChange={(e) => handleNFChange(i, 'name', e.target.value)} />
                    <Input placeholder="Lembaga" value={edu.institution} onChange={(e) => handleNFChange(i, 'institution', e.target.value)} />
                    <Input placeholder="Tahun" type="number" value={edu.year || ''} onChange={(e) => handleNFChange(i, 'year', Number(e.target.value))} />
                  </div>
                  <Textarea placeholder="Deskripsi" value={edu.description || ''} onChange={(e) => handleNFChange(i, 'description', e.target.value)} />
                  <Button variant="destructive" onClick={() => removeNF(i)}>Hapus</Button>
                </div>
              ))}
              <Button onClick={addNF}>Tambah Pendidikan Non Formal</Button>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={editData.identityCard || ""} 
                onChange={(e) => handleChange("identityCard", e.target.value)} 
                placeholder="KTP" 
              />
              <Input 
                value={editData.taxNumber || ""} 
                onChange={(e) => handleChange("taxNumber", e.target.value)} 
                placeholder="NPWP" 
              />
              <Input 
                value={editData.drivingLicense || ""} 
                onChange={(e) => handleChange("drivingLicense", e.target.value)} 
                placeholder="SIM" 
              />
              <Input 
                value={editData.bpjsHealth || ""} 
                onChange={(e) => handleChange("bpjsHealth", e.target.value)} 
                placeholder="BPJS Kesehatan" 
              />
              <Input 
                value={editData.bpjsEmployment || ""} 
                onChange={(e) => handleChange("bpjsEmployment", e.target.value)} 
                placeholder="BPJS Ketenagakerjaan" 
              />
              <Input 
                value={editData.insuranceCompany || ""} 
                onChange={(e) => handleChange("insuranceCompany", e.target.value)} 
                placeholder="Perusahaan Asuransi" 
              />
              <Input 
                value={editData.insuranceNumber || ""} 
                onChange={(e) => handleChange("insuranceNumber", e.target.value)} 
                placeholder="Nomor Asuransi" 
              />
              <Input 
                value={editData.policyNumber || ""} 
                onChange={(e) => handleChange("policyNumber", e.target.value)} 
                placeholder="Nomor Polis" 
              />
              <Input 
                value={editData.ptkpStatus || ""} 
                onChange={(e) => handleChange("ptkpStatus", e.target.value)} 
                placeholder="Status PTKP" 
              />
            </div>

            <h4 className="text-lg font-semibold">Informasi Bank</h4>
            <div className="grid grid-cols-3 gap-4">
              <Input 
                value={editData.bankName || ""} 
                onChange={(e) => handleChange("bankName", e.target.value)} 
                placeholder="Nama Bank" 
              />
              <Input 
                value={editData.bankAccountNumber || ""} 
                onChange={(e) => handleChange("bankAccountNumber", e.target.value)} 
                placeholder="Nomor Rekening" 
              />
              <Input 
                value={editData.bankAccountName || ""} 
                onChange={(e) => handleChange("bankAccountName", e.target.value)} 
                placeholder="Nama Pemilik Rekening" 
              />
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4">
            <h4 className="text-lg font-semibold">Kontak Darurat</h4>
            <div className="grid grid-cols-3 gap-4">
              <Input 
                value={editData.emergencyContactName || ""} 
                onChange={(e) => handleChange("emergencyContactName", e.target.value)} 
                placeholder="Nama Kontak Darurat" 
              />
              <Input 
                value={editData.emergencyContactRelation || ""} 
                onChange={(e) => handleChange("emergencyContactRelation", e.target.value)} 
                placeholder="Hubungan" 
              />
              <Input 
                value={editData.emergencyContactPhone || ""} 
                onChange={(e) => handleChange("emergencyContactPhone", e.target.value)} 
                placeholder="No HP Darurat" 
              />
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-4">
            <h4 className="text-lg font-semibold">Media Sosial</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                value={editData.instagram || ""} 
                onChange={(e) => handleChange("instagram", e.target.value)} 
                placeholder="Instagram" 
              />
              <Input 
                value={editData.facebook || ""} 
                onChange={(e) => handleChange("facebook", e.target.value)} 
                placeholder="Facebook" 
              />
              <Input 
                value={editData.twitter || ""} 
                onChange={(e) => handleChange("twitter", e.target.value)} 
                placeholder="Twitter" 
              />
              <Input 
                value={editData.linkedin || ""} 
                onChange={(e) => handleChange("linkedin", e.target.value)} 
                placeholder="LinkedIn" 
              />
              <Input 
                value={editData.tiktok || ""} 
                onChange={(e) => handleChange("tiktok", e.target.value)} 
                placeholder="TikTok" 
              />
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editData.bloodType || ""}
                onChange={(e) => handleChange("bloodType", e.target.value)}
              >
                <option value="">Pilih Golongan Darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  value={editData.height || ""} 
                  onChange={(e) => handleChange("height", Number(e.target.value))} 
                  placeholder="Tinggi Badan (cm)" 
                />
                <Input 
                  type="number"
                  value={editData.weight || ""} 
                  onChange={(e) => handleChange("weight", Number(e.target.value))} 
                  placeholder="Berat Badan (kg)" 
                />
              </div>
            </div>
            <Textarea 
              value={editData.medicalHistory || ""} 
              onChange={(e) => handleChange("medicalHistory", e.target.value)} 
              placeholder="Riwayat Penyakit" 
            />
            <Textarea 
              value={editData.allergies || ""} 
              onChange={(e) => handleChange("allergies", e.target.value)} 
              placeholder="Alergi" 
            />
          </TabsContent>
        </Tabs>

        <Button className="w-full mt-4" onClick={handleSave}>
          Simpan Perubahan
        </Button>
      </DialogContent>
    </Dialog>
  );
}