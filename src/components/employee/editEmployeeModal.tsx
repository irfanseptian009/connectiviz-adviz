"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { User, NonFormalEducation, EmploymentType, EditEmployeeModalProps } from "@/types/employee";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { fetchBusinessUnits } from "@/store/businessUnitSlice";
import EmployeePhotoUpload from "./EmployeePhotoUpload";
import { adminPhotoService } from "@/services/adminPhotoService";
import { toast } from "react-hot-toast";

export default function EditEmployeeModal({
  isOpen,
  onClose,
  editData,
  setEditData,
  formError,
  setFormError,
  handleSave,
  selectedTab,
  setSelectedTab,
}: EditEmployeeModalProps) {  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);
  const divisionTree = useSelector((state: RootState) => state.division.tree);
  const [selectedBUId, setSelectedBUId] = useState<number | null>(null);
    // Profile photo state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Map selectedTab number to tab names
  const tabNames = ["biodata", "employment", "family", "education", "documents", "contact", "social", "health"];
  const activeTab = tabNames[selectedTab] || "biodata";

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
  const handleChange = (field: keyof User, value: string | number | Date | boolean | null) => {
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

  // Photo upload handlers
  const handlePhotoUpload = async (file: File) => {
    if (!editData?.id) return;
    
    setIsUploadingPhoto(true);
    try {
      const response = await adminPhotoService.uploadUserProfilePhoto(editData.id, file);
      setEditData({ ...editData, profilePictureUrl: response.profilePictureUrl });
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Photo upload failed:', error);
      toast.error('Failed to upload profile photo');    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePhotoDelete = async () => {
    if (!editData?.id || !editData?.profilePictureUrl) return;
    
    setIsUploadingPhoto(true);
    try {
      await adminPhotoService.deleteUserProfilePhoto(editData.id);
      setEditData({ ...editData, profilePictureUrl: undefined });
      toast.success('Profile photo deleted successfully!');
    } catch (error) {
      console.error('Photo delete failed:', error);
      toast.error('Failed to delete profile photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };
  const handlePhotoChange = (file: File | null) => {
    if (file) {
      handlePhotoUpload(file);
    }
  };

  // Utility function to render input with error
  const renderInputWithError = (
    field: keyof User,
    placeholder: string,
    type: string = "text",
    value?: string | number,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="space-y-1">
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={formError[field as string] ? "border-red-500" : ""}
      />
      {formError[field as string] && (
        <p className="text-red-500 text-xs">{formError[field as string]}</p>
      )}
    </div>
  );

  // Basic validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editData?.username?.trim()) {
      errors.username = "Username is required";
    }
    if (!editData?.email?.trim()) {
      errors.email = "Email is required";
    }
    if (!editData?.fullName?.trim()) {
      errors.fullName = "Full name is required";
    }
    
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  // Get current divisions based on selected business unit
  const currentDivisions = selectedBUId ? divisionTree[selectedBUId] || [] : [];

  if (!editData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => {
          const tabIndex = tabNames.indexOf(value);
          if (tabIndex !== -1) setSelectedTab(tabIndex);
        }} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full overflow-x-auto gap-2">
            <TabsTrigger value="biodata">Data Diri</TabsTrigger>
            <TabsTrigger value="employment">Pekerjaan</TabsTrigger>
            <TabsTrigger value="family">Keluarga</TabsTrigger>
            <TabsTrigger value="education">Pendidikan</TabsTrigger>
            <TabsTrigger value="documents">Dokumen</TabsTrigger>
            <TabsTrigger value="contact">Kontak</TabsTrigger>
            <TabsTrigger value="social">Sosial</TabsTrigger>
            <TabsTrigger value="health">Kesehatan</TabsTrigger>
          </TabsList>          {/* Data Diri Tab */}
          <TabsContent value="biodata" className="space-y-4">
            {/* Profile Photo Upload */}
            <div className="mb-6 flex justify-center">
              <EmployeePhotoUpload
                currentPhotoUrl={editData?.profilePictureUrl}
                onPhotoChange={handlePhotoChange}
                disabled={isUploadingPhoto}
                className="max-w-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("username", "Username", "text", editData.username, (e) => handleChange("username", e.target.value))}
              {renderInputWithError("email", "Email", "email", editData.email, (e) => handleChange("email", e.target.value))}
              {renderInputWithError("officeEmail", "Email Kantor", "email", editData.officeEmail, (e) => handleChange("officeEmail", e.target.value))}
              {renderInputWithError("nationalId", "NIK", "text", editData.nationalId, (e) => handleChange("nationalId", e.target.value))}
              {renderInputWithError("fullName", "Nama Lengkap", "text", editData.fullName, (e) => handleChange("fullName", e.target.value))}
              {renderInputWithError("phoneNumber", "No HP", "text", editData.phoneNumber, (e) => handleChange("phoneNumber", e.target.value))}
              {renderInputWithError("placeOfBirth", "Tempat Lahir", "text", editData.placeOfBirth, (e) => handleChange("placeOfBirth", e.target.value))}              <div className="space-y-1">
                <Input 
                  type="date"
                  value={editData.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split('T')[0] : ""} 
                  onChange={(e) => handleChange("dateOfBirth", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)} 
                  placeholder="Tanggal Lahir" 
                />
                {formError.dateOfBirth && (
                  <p className="text-red-500 text-xs">{formError.dateOfBirth}</p>
                )}
              </div>
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
            </div>            <Textarea 
              value={editData.address || ""} 
              onChange={(e) => handleChange("address", e.target.value)} 
              placeholder="Alamat" 
            />
          </TabsContent>

          {/* Employment Tab */}
          <TabsContent value="employment" className="space-y-4">
            <h3 className="text-lg font-semibold">Informasi Pekerjaan</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("position", "Jabatan", "text", editData.position, (e) => handleChange("position", e.target.value))}
              {renderInputWithError("jobTitle", "Judul Pekerjaan", "text", editData.jobTitle, (e) => handleChange("jobTitle", e.target.value))}
              {renderInputWithError("jobLevel", "Level Jabatan", "number", editData.jobLevel, (e) => handleChange("jobLevel", Number(e.target.value)))}
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editData.employmentType || ""}
                onChange={(e) => handleChange("employmentType", e.target.value as EmploymentType)}
              >
                <option value="">Pilih Tipe Pekerjaan</option>
                <option value="INTERNSHIP">Magang</option>
                <option value="PROBATION">Probasi</option>
                <option value="CONTRACT">Kontrak</option>
                <option value="PERMANENT">Tetap</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">              <Input 
                type="date"
                value={editData.startDate ? new Date(editData.startDate).toISOString().split('T')[0] : ""} 
                onChange={(e) => handleChange("startDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)} 
                placeholder="Tanggal Mulai Bekerja" 
              />
              <Input 
                type="date"
                value={editData.probationEndDate ? new Date(editData.probationEndDate).toISOString().split('T')[0] : ""} 
                onChange={(e) => handleChange("probationEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)} 
                placeholder="Tanggal Selesai Probasi" 
              />
              <Input 
                type="date"
                value={editData.contractEndDate ? new Date(editData.contractEndDate).toISOString().split('T')[0] : ""} 
                onChange={(e) => handleChange("contractEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)} 
                placeholder="Tanggal Selesai Kontrak" 
              />
              <Input 
                type="date"
                value={editData.resignDate ? new Date(editData.resignDate).toISOString().split('T')[0] : ""} 
                onChange={(e) => handleChange("resignDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)} 
                placeholder="Tanggal Resign" 
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.isActive || false}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
                <span>Aktif</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.isOnProbation || false}
                  onChange={(e) => handleChange("isOnProbation", e.target.checked)}
                />
                <span>Sedang Probasi</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editData.isResigned || false}
                  onChange={(e) => handleChange("isResigned", e.target.checked)}
                />
                <span>Sudah Resign</span>
              </label>
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
              {renderInputWithError("motherName", "Nama Ibu", "text", editData.motherName, (e) => handleChange("motherName", e.target.value))}
              {renderInputWithError("fatherName", "Nama Ayah", "text", editData.fatherName, (e) => handleChange("fatherName", e.target.value))}
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
              {renderInputWithError("spouseName", "Nama Pasangan", "text", editData.spouseName, (e) => handleChange("spouseName", e.target.value))}
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
          </TabsContent>          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pendidikan Formal</h3>
                {(editData.formalEducations || []).map((edu, i) => (
                  <div key={i} className="space-y-2 border rounded p-4 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        placeholder="Tingkat Pendidikan (SD/SMP/SMA/D3/S1/S2/S3)" 
                        value={edu.level || ''} 
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], level: e.target.value };
                          setEditData({ ...editData!, formalEducations: list });
                        }} 
                      />
                      <Input 
                        placeholder="Nama Sekolah/Universitas" 
                        value={edu.schoolName || ''} 
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], schoolName: e.target.value };
                          setEditData({ ...editData!, formalEducations: list });
                        }} 
                      />
                      <Input 
                        placeholder="Jurusan/Program Studi" 
                        value={edu.major || ''} 
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], major: e.target.value };
                          setEditData({ ...editData!, formalEducations: list });
                        }} 
                      />
                      <Input 
                        placeholder="Tahun Lulus" 
                        type="number" 
                        value={edu.yearGraduate || ''} 
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], yearGraduate: Number(e.target.value) };
                          setEditData({ ...editData!, formalEducations: list });
                        }} 
                      />
                      <Input 
                        placeholder="IPK/Nilai" 
                        type="number" 
                        step="0.01"
                        value={edu.gpa || ''} 
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], gpa: Number(e.target.value) };
                          setEditData({ ...editData!, formalEducations: list });
                        }} 
                      />
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        const updated = editData!.formalEducations?.filter((_, index) => index !== i) || [];
                        setEditData({ ...editData!, formalEducations: updated });
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                <Button 
                  onClick={() => {
                    const updated = [...(editData?.formalEducations || []), { 
                      level: '', 
                      schoolName: '', 
                      major: '', 
                      yearGraduate: 0, 
                      gpa: 0 
                    }];
                    setEditData({ ...editData!, formalEducations: updated });
                  }}
                >
                  Tambah Pendidikan Formal
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Pendidikan Non Formal</h3>
                {(editData.nonFormalEducations || []).map((edu, i) => (
                  <div key={i} className="space-y-2 border rounded p-4 mb-4">
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

              <div>
                <h3 className="text-lg font-semibold mb-4">Minat & Kemampuan</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Minat</h4>
                    {(editData.interests || []).map((interest, i) => (
                      <div key={i} className="flex gap-2">
                        <Input 
                          value={interest} 
                          onChange={(e) => handleArrayChange("interests", i, e.target.value)} 
                          placeholder={`Minat ${i + 1}`} 
                        />
                        <Button variant="destructive" onClick={() => removeArrayItem("interests", i)}>
                          Hapus
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => addArrayItem("interests")}>Tambah Minat</Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Kemampuan</h4>
                    {(editData.skills || []).map((skill, i) => (
                      <div key={i} className="flex gap-2">
                        <Input 
                          value={skill} 
                          onChange={(e) => handleArrayChange("skills", i, e.target.value)} 
                          placeholder={`Kemampuan ${i + 1}`} 
                        />
                        <Button variant="destructive" onClick={() => removeArrayItem("skills", i)}>
                          Hapus
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => addArrayItem("skills")}>Tambah Kemampuan</Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Bahasa</h4>
                    {(editData.languages || []).map((language, i) => (
                      <div key={i} className="flex gap-2">
                        <Input 
                          value={language} 
                          onChange={(e) => handleArrayChange("languages", i, e.target.value)} 
                          placeholder={`Bahasa ${i + 1}`} 
                        />
                        <Button variant="destructive" onClick={() => removeArrayItem("languages", i)}>
                          Hapus
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => addArrayItem("languages")}>Tambah Bahasa</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("identityCard", "KTP", "text", editData.identityCard, (e) => handleChange("identityCard", e.target.value))}
              {renderInputWithError("taxNumber", "NPWP", "text", editData.taxNumber, (e) => handleChange("taxNumber", e.target.value))}
              {renderInputWithError("drivingLicense", "SIM", "text", editData.drivingLicense, (e) => handleChange("drivingLicense", e.target.value))}
              {renderInputWithError("bpjsHealth", "BPJS Kesehatan", "text", editData.bpjsHealth, (e) => handleChange("bpjsHealth", e.target.value))}
              {renderInputWithError("bpjsEmployment", "BPJS Ketenagakerjaan", "text", editData.bpjsEmployment, (e) => handleChange("bpjsEmployment", e.target.value))}
              {renderInputWithError("insuranceCompany", "Perusahaan Asuransi", "text", editData.insuranceCompany, (e) => handleChange("insuranceCompany", e.target.value))}
              {renderInputWithError("insuranceNumber", "Nomor Asuransi", "text", editData.insuranceNumber, (e) => handleChange("insuranceNumber", e.target.value))}
              {renderInputWithError("policyNumber", "Nomor Polis", "text", editData.policyNumber, (e) => handleChange("policyNumber", e.target.value))}
              {renderInputWithError("ptkpStatus", "Status PTKP", "text", editData.ptkpStatus, (e) => handleChange("ptkpStatus", e.target.value))}
            </div>

            <h4 className="text-lg font-semibold">Informasi Bank</h4>
            <div className="grid grid-cols-3 gap-4">
              {renderInputWithError("bankName", "Nama Bank", "text", editData.bankName, (e) => handleChange("bankName", e.target.value))}
              {renderInputWithError("bankAccountNumber", "Nomor Rekening", "text", editData.bankAccountNumber, (e) => handleChange("bankAccountNumber", e.target.value))}
              {renderInputWithError("bankAccountName", "Nama Pemilik Rekening", "text", editData.bankAccountName, (e) => handleChange("bankAccountName", e.target.value))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4">
            <h4 className="text-lg font-semibold">Kontak Darurat</h4>
            <div className="grid grid-cols-3 gap-4">
              {renderInputWithError("emergencyContactName", "Nama Kontak Darurat", "text", editData.emergencyContactName, (e) => handleChange("emergencyContactName", e.target.value))}
              {renderInputWithError("emergencyContactRelation", "Hubungan", "text", editData.emergencyContactRelation, (e) => handleChange("emergencyContactRelation", e.target.value))}
              {renderInputWithError("emergencyContactPhone", "No HP Darurat", "text", editData.emergencyContactPhone, (e) => handleChange("emergencyContactPhone", e.target.value))}
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-4">
            <h4 className="text-lg font-semibold">Media Sosial</h4>
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("instagram", "Instagram", "text", editData.instagram, (e) => handleChange("instagram", e.target.value))}
              {renderInputWithError("facebook", "Facebook", "text", editData.facebook, (e) => handleChange("facebook", e.target.value))}
              {renderInputWithError("twitter", "Twitter", "text", editData.twitter, (e) => handleChange("twitter", e.target.value))}
              {renderInputWithError("linkedin", "LinkedIn", "text", editData.linkedin, (e) => handleChange("linkedin", e.target.value))}
              {renderInputWithError("tiktok", "TikTok", "text", editData.tiktok, (e) => handleChange("tiktok", e.target.value))}
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
        </Tabs>        <Button className="w-full mt-4" onClick={() => {
          if (validateForm()) {
            handleSave();
          }
        }}>
          Simpan Perubahan
        </Button>
      </DialogContent>
    </Dialog>
  );
}