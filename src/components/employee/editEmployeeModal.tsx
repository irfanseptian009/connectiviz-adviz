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
import { Loader2 } from "lucide-react";

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
}: EditEmployeeModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);
  const divisionTree = useSelector((state: RootState) => state.division.tree);
  const [selectedBUId, setSelectedBUId] = useState<number | null>(null);
  // Profile photo state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Tambahkan state loading

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
    setEditData({ ...editData!, [field]: [...currentArray, ""] });
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
    const updated = [...(editData?.nonFormalEducations || []), { name: "", institution: "", year: 0, description: "" }];
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
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      console.error("Photo upload failed:", error);
      toast.error("Failed to upload profile photo");
    } finally {
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
      toast.success("Profile photo deleted successfully!");
    } catch (error) {
      console.error("Photo delete failed:", error);
      toast.error("Failed to delete profile photo");
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
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Employee: {editData?.fullName || editData?.username}
            <div className="flex gap-2 text-sm">
              {editData?.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              )}
              {editData?.isOnProbation && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Probation</span>
              )}
              {editData?.isResigned && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Resigned</span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            const tabIndex = tabNames.indexOf(value);
            if (tabIndex !== -1) setSelectedTab(tabIndex);
          }}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-4 w-full h-full gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="biodata" className="text-xs sm:text-sm font-medium">📋 Biodata</TabsTrigger>
            <TabsTrigger value="employment" className="text-xs sm:text-sm font-medium">💼 Employment</TabsTrigger>
            <TabsTrigger value="family" className="text-xs sm:text-sm font-medium">👨‍👩‍👧‍👦 Family</TabsTrigger>
            <TabsTrigger value="education" className="text-xs sm:text-sm font-medium">🎓 Education</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm font-medium">📄 Documents</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm font-medium">📞 Contact</TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm font-medium">🌐 Social</TabsTrigger>
            <TabsTrigger value="health" className="text-xs sm:text-sm font-medium">🏥 Health</TabsTrigger>
          </TabsList>
          {/* Data Diri Tab */}
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
              {renderInputWithError("officeEmail", "Office Email", "email", editData.officeEmail, (e) => handleChange("officeEmail", e.target.value))}
              {renderInputWithError("nationalId", "National ID", "text", editData.nationalId, (e) => handleChange("nationalId", e.target.value))}
              {renderInputWithError("fullName", "Full Name", "text", editData.fullName, (e) => handleChange("fullName", e.target.value))}
              {renderInputWithError("phoneNumber", "Phone Number", "text", editData.phoneNumber, (e) => handleChange("phoneNumber", e.target.value))}
              {renderInputWithError("placeOfBirth", "Place of Birth", "text", editData.placeOfBirth, (e) => handleChange("placeOfBirth", e.target.value))}
              <div className="space-y-1">
                <Input
                  type="date"
                  value={editData.dateOfBirth ? new Date(editData.dateOfBirth).toISOString().split("T")[0] : ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                  placeholder="Date of Birth"
                />
                {formError.dateOfBirth && (
                  <p className="text-red-500 text-xs">{formError.dateOfBirth}</p>
                )}
              </div>
              <select
                className="w-full dark:bg-gray-800 px-3 py-2 border rounded-md"
                value={editData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Laki-laki">Male</option>
                <option value="Perempuan">Female</option>
              </select>
              <select
                className="w-full px-3 dark:bg-gray-800 py-2 border rounded-md"
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
              placeholder="Address"
            />
          </TabsContent>

          {/* Employment Tab */}
          <TabsContent value="employment" className="space-y-6">
            <h3 className="text-lg font-semibold">Employment Information</h3>

            {/* Job Details */}
            <div>
              <h4 className="text-md font-semibold mb-3 text-blue-600">Job Details</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderInputWithError("position", "Position", "text", editData.position, (e) => handleChange("position", e.target.value))}
                {renderInputWithError("jobTitle", "Job Title", "text", editData.jobTitle, (e) => handleChange("jobTitle", e.target.value))}
                {renderInputWithError("jobLevel", "Job Level", "number", editData.jobLevel, (e) => handleChange("jobLevel", Number(e.target.value)))}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Employment Type</label>
                  <select
                    className="w-full dark:bg-gray-800 px-3 py-2 border rounded-md"
                    value={editData.employmentType || ""}
                    onChange={(e) => handleChange("employmentType", e.target.value as EmploymentType)}
                  >
                    <option value="">Select Employment Type</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="PROBATION">Probation</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="PERMANENT">Permanent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Employment Dates */}
            <div>
              <h4 className="text-md font-semibold mb-3 text-blue-600">Employment Dates</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={editData.startDate ? new Date(editData.startDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("startDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Probation End Date</label>
                  <Input
                    type="date"
                    value={editData.probationEndDate ? new Date(editData.probationEndDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("probationEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Contract End Date</label>
                  <Input
                    type="date"
                    value={editData.contractEndDate ? new Date(editData.contractEndDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("contractEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Resign Date</label>
                  <Input
                    type="date"
                    value={editData.resignDate ? new Date(editData.resignDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("resignDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Career Tracking */}
            <div>
              <h4 className="text-md font-semibold mb-2 text-blue-600">Career Tracking</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Promotion Date</label>
                  <Input
                    type="date"
                    value={editData.promotionDate ? new Date(editData.promotionDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("promotionDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Demotion Date</label>
                  <Input
                    type="date"
                    value={editData.demotionDate ? new Date(editData.demotionDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("demotionDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Rehire Date</label>
                  <Input
                    type="date"
                    value={editData.rehireDate ? new Date(editData.rehireDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("rehireDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
              
              {/* Career Summary */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                <h5 className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-300">Career Summary</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Last Promotion:</span> {editData.promotionDate ? new Date(editData.promotionDate).toLocaleDateString() : 'Not set'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Last Demotion:</span> {editData.demotionDate ? new Date(editData.demotionDate).toLocaleDateString() : 'Not set'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Resignation Date:</span> {editData.resignDate ? new Date(editData.resignDate).toLocaleDateString() : 'Not set'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Rehire Date:</span> {editData.rehireDate ? new Date(editData.rehireDate).toLocaleDateString() : 'Not set'}
                  </div>
                </div>
              </div>

            {/* Employee Status */}
            <div>
              <h4 className="text-md font-semibold mb-2 text-blue-600">Employee Status</h4>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.isActive || false}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.isOnProbation || false}
                    onChange={(e) => handleChange("isOnProbation", e.target.checked)}
                  />
                  <span>On Probation</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.isResigned || false}
                    onChange={(e) => handleChange("isResigned", e.target.checked)}
                  />
                  <span>Resigned</span>
                </label>
              </div>
            </div>

            {/* Organization Placement */}
            <div>
              <h4 className="text-md font-semibold mb-3 text-blue-600">Organization Placement</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Business Unit</label>
                  <select
                    className="w-full px-3 dark:bg-gray-800 py-2 border rounded-md"
                    value={selectedBUId || ""}
                    onChange={(e) => handleBusinessUnitChange(e.target.value)}
                  >
                    <option value="">Select Business Unit</option>
                    {businessUnits.map((bu) => (
                      <option key={bu.id} value={bu.id}>{bu.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Division</label>
                  <select
                    className="w-full px-3 dark:bg-gray-800 py-2 border rounded-md"
                    value={editData.divisionId || ""}
                    onChange={(e) => handleChange("divisionId", Number(e.target.value))}
                    disabled={!selectedBUId}
                  >
                    <option value="">Select Division</option>
                    {currentDivisions.map((div) => (
                      <option key={div.id} value={div.id}>{div.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("motherName", "Mother's Name", "text", editData.motherName, (e) => handleChange("motherName", e.target.value))}
              {renderInputWithError("fatherName", "Father's Name", "text", editData.fatherName, (e) => handleChange("fatherName", e.target.value))}
              <select
                className="w-full dark:bg-gray-800 px-3 py-2 border rounded-md"
                value={editData.maritalStatus || ""}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
              >
                <option value="">Marital Status</option>
                <option value="Belum Menikah">Single</option>
                <option value="Menikah">Married</option>
                <option value="Cerai">Divorced</option>
                <option value="Janda/Duda">Widow/Widower</option>
              </select>
              {renderInputWithError("spouseName", "Spouse's Name", "text", editData.spouseName, (e) => handleChange("spouseName", e.target.value))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Childrens Names</h4>
              {(editData.childrenNames || []).map((child, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={child}
                    onChange={(e) => handleArrayChange("childrenNames", i, e.target.value)}
                    placeholder={`Child ${i + 1} Name`}
                  />
                  <Button variant="destructive" onClick={() => removeArrayItem("childrenNames", i)}>
                    Delete
                  </Button>
                </div>
              ))}
              <Button onClick={() => addArrayItem("childrenNames")}>Add Child</Button>
            </div>
          </TabsContent>
          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Formal Education</h3>
                {(editData.formalEducations || []).map((edu, i) => (
                  <div key={i} className="space-y-2 border rounded p-4 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Education Level (Elementary/Junior High/Senior High/Diploma/Bachelor/Master/Doctorate)"
                        value={edu.level || ""}
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], level: e.target.value };
                          setEditData({ ...editData!, formalEducations: list });
                        }}
                      />
                      <Input
                        placeholder="School/University Name"
                        value={edu.schoolName || ""}
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], schoolName: e.target.value };
                          setEditData({ ...editData!, formalEducations: list });
                        }}
                      />
                      <Input
                        placeholder="Major/Study Program"
                        value={edu.major || ""}
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], major: e.target.value };
                          setEditData({ ...editData!, formalEducations: list });
                        }}
                      />
                      <Input
                        placeholder="Year Graduated"
                        type="number"
                        value={edu.yearGraduate || ""}
                        onChange={(e) => {
                          const list = [...(editData.formalEducations || [])];
                          list[i] = { ...list[i], yearGraduate: Number(e.target.value) };
                          setEditData({ ...editData!, formalEducations: list });
                        }}
                      />
                      <Input
                        placeholder="GPA/Score"
                        type="number"
                        step="0.01"
                        value={edu.gpa || ""}
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
                      Delete
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const updated = [...(editData?.formalEducations || []), {
                      level: "",
                      schoolName: "",
                      major: "",
                      yearGraduate: 0,
                      gpa: 0,
                    }];
                    setEditData({ ...editData!, formalEducations: updated });
                  }}
                >
                  Add Formal Education
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Non-Formal Education</h3>
                {(editData.nonFormalEducations || []).map((edu, i) => (
                  <div key={i} className="space-y-2 border rounded p-4 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Education Name" value={edu.name} onChange={(e) => handleNFChange(i, "name", e.target.value)} />
                      <Input placeholder="Institution" value={edu.institution} onChange={(e) => handleNFChange(i, "institution", e.target.value)} />
                      <Input placeholder="Year" type="number" value={edu.year || ""} onChange={(e) => handleNFChange(i, "year", Number(e.target.value))} />
                    </div>
                    <Textarea placeholder="Description" value={edu.description || ""} onChange={(e) => handleNFChange(i, "description", e.target.value)} />
                    <Button variant="destructive" onClick={() => removeNF(i)}>Delete</Button>
                  </div>
                ))}
                <Button onClick={addNF}>Add Non-Formal Education</Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Interests & Skills</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Interests</h4>
                    {(editData.interests || []).map((interest, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={interest}
                          onChange={(e) => handleArrayChange("interests", i, e.target.value)}
                          placeholder={`Interest ${i + 1}`}
                        />
                        <Button variant="destructive" onClick={() => removeArrayItem("interests", i)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => addArrayItem("interests")}>Add Interest</Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Skills</h4>
                    {(editData.skills || []).map((skill, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={skill}
                          onChange={(e) => handleArrayChange("skills", i, e.target.value)}
                          placeholder={`Skill ${i + 1}`}
                        />
                        <Button variant="destructive" onClick={() => removeArrayItem("skills", i)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => addArrayItem("skills")}>Add Skill</Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Languages</h4>
                    {(editData.languages || []).map((language, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={language}
                          onChange={(e) => handleArrayChange("languages", i, e.target.value)}
                          placeholder={`Language ${i + 1}`}
                        />
                        <Button variant="destructive" onClick={() => removeArrayItem("languages", i)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => addArrayItem("languages")}>Add Language</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <h3 className="text-lg font-semibold">Documents & Finance Information</h3>

            {/* Identity Documents */}
            <div>
              <h4 className="text-md font-semibold mb-3 text-blue-600">Identity Documents</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderInputWithError("identityCard", "Identity Card", "text", editData.identityCard, (e) => handleChange("identityCard", e.target.value))}
                {renderInputWithError("taxNumber", "Tax Number", "text", editData.taxNumber, (e) => handleChange("taxNumber", e.target.value))}
                {renderInputWithError("drivingLicense", "Driving License", "text", editData.drivingLicense, (e) => handleChange("drivingLicense", e.target.value))}
                {renderInputWithError("ptkpStatus", "PTKP Status", "text", editData.ptkpStatus, (e) => handleChange("ptkpStatus", e.target.value))}
              </div>
            </div>

            {/* BPJS Information */}
            <div>
              <h4 className="text-md font-semibold mb-3 text-blue-600">BPJS Information</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderInputWithError("bpjsHealth", "BPJS Health", "text", editData.bpjsHealth, (e) => handleChange("bpjsHealth", e.target.value))}
                {renderInputWithError("bpjsEmployment", "BPJS Employment", "text", editData.bpjsEmployment, (e) => handleChange("bpjsEmployment", e.target.value))}
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h4 className="text-md font-semibold mb-3 text-blue-600">Insurance Information</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderInputWithError("insuranceCompany", "Insurance Company", "text", editData.insuranceCompany, (e) => handleChange("insuranceCompany", e.target.value))}
                {renderInputWithError("insuranceNumber", "Insurance Number", "text", editData.insuranceNumber, (e) => handleChange("insuranceNumber", e.target.value))}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Insurance End Date</label>
                  <Input
                    type="date"
                    value={editData.insuranceEndDate ? new Date(editData.insuranceEndDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("insuranceEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                {renderInputWithError("policyNumber", "Policy Number", "text", editData.policyNumber, (e) => handleChange("policyNumber", e.target.value))}
              </div>
            </div>

            {/* Bank Information */}
            <div>
              <h4 className="text-md font-semibold mb-3 text-blue-600">Bank Information</h4>
              <div className="grid grid-cols-3 gap-4">
                {renderInputWithError("bankName", "Bank Name", "text", editData.bankName, (e) => handleChange("bankName", e.target.value))}
                {renderInputWithError("bankAccountNumber", "Bank Account Number", "text", editData.bankAccountNumber, (e) => handleChange("bankAccountNumber", e.target.value))}
                {renderInputWithError("bankAccountName", "Account Holder Name", "text", editData.bankAccountName, (e) => handleChange("bankAccountName", e.target.value))}
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4">
            <h4 className="text-lg font-semibold">Emergency Contact</h4>
            <div className="grid grid-cols-3 gap-4">
              {renderInputWithError("emergencyContactName", "Emergency Contact Name", "text", editData.emergencyContactName, (e) => handleChange("emergencyContactName", e.target.value))}
              {renderInputWithError("emergencyContactRelation", "Relation", "text", editData.emergencyContactRelation, (e) => handleChange("emergencyContactRelation", e.target.value))}
              {renderInputWithError("emergencyContactPhone", "Emergency Phone Number", "text", editData.emergencyContactPhone, (e) => handleChange("emergencyContactPhone", e.target.value))}
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-4">
            <h4 className="text-lg font-semibold">Social Media</h4>
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
                className="w-full px-3 dark:bg-gray-800 py-2 border rounded-md"
                value={editData.bloodType || ""}
                onChange={(e) => handleChange("bloodType", e.target.value)}
              >
                <option value="">Select Blood Type</option>
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
                  placeholder="Height (cm)"
                />
                <Input
                  type="number"
                  value={editData.weight || ""}
                  onChange={(e) => handleChange("weight", Number(e.target.value))}
                  placeholder="Weight (kg)"
                />
              </div>
            </div>
            <Textarea
              value={editData.medicalHistory || ""}
              onChange={(e) => handleChange("medicalHistory", e.target.value)}
              placeholder="Medical History"
            />
            <Textarea
              value={editData.allergies || ""}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="Allergies"
            />
          </TabsContent>
        </Tabs>
        <Button
          className="w-full mt-4 flex items-center justify-center"
          onClick={async () => {
            if (validateForm()) {
              setIsSaving(true);
              try {
                await handleSave();
              } finally {
                setIsSaving(false);
              }
            }
          }}
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}