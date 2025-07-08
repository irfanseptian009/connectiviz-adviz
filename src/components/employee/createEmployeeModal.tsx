"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { User, NonFormalEducation, EmploymentType, FormalEducation, Role } from "@/types/employee";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { fetchBusinessUnits } from "@/store/businessUnitSlice";
import { toast } from "react-hot-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => Promise<void>;
}

export default function CreateEmployeeModal({
  isOpen,
  onClose,
  onSave,
}: CreateEmployeeModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);
  const divisionTree = useSelector((state: RootState) => state.division.tree);
  const [selectedBUId, setSelectedBUId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formError, setFormError] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<User>>({
    role: Role.EMPLOYEE,
    email: "",
    password: "",
    username: "",
    fullName: "",
    employmentType: undefined,
    isActive: true,
    isOnProbation: false,
    isResigned: false,
    childrenNames: [],
    interests: [],
    skills: [],
    languages: [],
    formalEducations: [],
    nonFormalEducations: [],
  });

  const tabNames = ["biodata", "employment", "family", "education", "documents", "contact", "social", "health"];

  useEffect(() => {
    if (businessUnits.length === 0) {
      dispatch(fetchBusinessUnits());
    }
  }, [dispatch, businessUnits.length]);

  const handleChange = (field: keyof User, value: string | number | Date | boolean | null) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (formError[field]) {
      setFormError({ ...formError, [field]: "" });
    }
  };

  const handleArrayChange = (field: keyof User, index: number, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof User) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({ ...formData, [field]: [...currentArray, ""] });
  };

  const removeArrayItem = (field: keyof User, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
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
    const list = [...(formData.nonFormalEducations || [])];
    if (!list[index]) list[index] = { name: "", institution: "" };
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, nonFormalEducations: list });
  };

  const handleFormalChange = (index: number, field: keyof FormalEducation, value: string | number) => {
    const list = [...(formData.formalEducations || [])];
    if (!list[index]) list[index] = { level: "", schoolName: "" };
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, formalEducations: list });
  };

  const addNonFormalEducation = () => {
    const current = formData.nonFormalEducations || [];
    setFormData({
      ...formData,
      nonFormalEducations: [...current, { name: "", institution: "" }],
    });
  };

  const addFormalEducation = () => {
    const current = formData.formalEducations || [];
    setFormData({
      ...formData,
      formalEducations: [...current, { level: "", schoolName: "" }],
    });
  };

  const removeNonFormalEducation = (index: number) => {
    const list = [...(formData.nonFormalEducations || [])];
    list.splice(index, 1);
    setFormData({ ...formData, nonFormalEducations: list });
  };

  const removeFormalEducation = (index: number) => {
    const list = [...(formData.formalEducations || [])];
    list.splice(index, 1);
    setFormData({ ...formData, formalEducations: list });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.username) errors.username = "Username is required";
    if (!formData.fullName) errors.fullName = "Full name is required";

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Employee created successfully!");
      onClose();
      // Reset form
      setFormData({
        role: Role.EMPLOYEE,
        email: "",
        password: "",
        username: "",
        fullName: "",
        employmentType: undefined,
        isActive: true,
        isOnProbation: false,
        isResigned: false,
        childrenNames: [],
        interests: [],
        skills: [],
        languages: [],
        formalEducations: [],
        nonFormalEducations: [],
      });
      setSelectedTab(0);
      setFormError({});
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee");
    } finally {
      setIsSaving(false);
    }
  };

  const renderInputWithError = (
    field: keyof User,
    label: string,
    type: string,
    value: string | number | boolean | null | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} {["email", "password", "username", "fullName"].includes(field) && <span className="text-red-500">*</span>}
      </label>
      <Input
        type={type}
        value={typeof value === 'boolean' ? '' : (value || "")}
        onChange={onChange}
        placeholder={label}
        className={`w-full ${formError[field] ? "border-red-500" : ""}`}
      />
      {formError[field] && <span className="text-red-500 text-xs">{formError[field]}</span>}
    </div>
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
        </DialogHeader>

        <Tabs value={tabNames[selectedTab]} onValueChange={(value) => setSelectedTab(tabNames.indexOf(value))}>
          <TabsList className="grid grid-cols-4 w-full h-12 gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="biodata" className="text-xs sm:text-sm font-medium">📋 Biodata</TabsTrigger>
            <TabsTrigger value="employment" className="text-xs sm:text-sm font-medium">💼 Employment</TabsTrigger>
            <TabsTrigger value="family" className="text-xs sm:text-sm font-medium">👨‍👩‍👧‍👦 Family</TabsTrigger>
            <TabsTrigger value="education" className="text-xs sm:text-sm font-medium">🎓 Education</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm font-medium">📄 Documents</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm font-medium">📞 Contact</TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm font-medium">🌐 Social</TabsTrigger>
            <TabsTrigger value="health" className="text-xs sm:text-sm font-medium">🏥 Health</TabsTrigger>
          </TabsList>

          {/* Biodata Tab */}
          <TabsContent value="biodata" className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("email", "Email", "email", formData.email, (e) => handleChange("email", e.target.value))}
              {renderInputWithError("password", "Password", "password", formData.password, (e) => handleChange("password", e.target.value))}
              {renderInputWithError("username", "Username", "text", formData.username, (e) => handleChange("username", e.target.value))}
              {renderInputWithError("fullName", "Full Name", "text", formData.fullName, (e) => handleChange("fullName", e.target.value))}
              {renderInputWithError("nationalId", "National ID", "text", formData.nationalId, (e) => handleChange("nationalId", e.target.value))}
              {renderInputWithError("placeOfBirth", "Place of Birth", "text", formData.placeOfBirth, (e) => handleChange("placeOfBirth", e.target.value))}
              <div className="space-y-1">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Gender</label>
                <select
                  className="w-full dark:bg-gray-800 px-3 py-2 border rounded-md"
                  value={formData.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {renderInputWithError("phoneNumber", "Phone Number", "tel", formData.phoneNumber, (e) => handleChange("phoneNumber", e.target.value))}
              {renderInputWithError("officeEmail", "Office Email", "email", formData.officeEmail, (e) => handleChange("officeEmail", e.target.value))}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Address"
              />
            </div>
          </TabsContent>

          {/* Employment Tab */}
          <TabsContent value="employment" className="space-y-6">
            <h3 className="text-lg font-semibold">Employment Information</h3>

            {/* Job Details */}
            <div>
              <h4 className="text-md font-semibold mb-2 text-blue-600">Job Details</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderInputWithError("position", "Position", "text", formData.position, (e) => handleChange("position", e.target.value))}
                {renderInputWithError("jobTitle", "Job Title", "text", formData.jobTitle, (e) => handleChange("jobTitle", e.target.value))}
                {renderInputWithError("jobLevel", "Job Level", "number", formData.jobLevel, (e) => handleChange("jobLevel", Number(e.target.value)))}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Employment Type</label>
                  <select
                    className="w-full dark:bg-gray-800 px-3 py-2 border rounded-md"
                    value={formData.employmentType || ""}
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

            {/* Organization Placement */}
            <div>
              <h4 className="text-md font-semibold mb-2 text-blue-600">Organization Placement</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Business Unit</label>
                  <select
                    className="w-full dark:bg-gray-800 px-3 py-2 border rounded-md"
                    value={selectedBUId || ""}
                    onChange={(e) => handleBusinessUnitChange(e.target.value)}
                  >
                    <option value="">Select Business Unit</option>
                    {businessUnits.map((bu) => (
                      <option key={bu.id} value={bu.id}>
                        {bu.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Division</label>
                  <select
                    className="w-full dark:bg-gray-800 px-3 py-2 border rounded-md"
                    value={formData.divisionId || ""}
                    onChange={(e) => handleChange("divisionId", Number(e.target.value))}
                    disabled={!selectedBUId}
                  >
                    <option value="">Select Division</option>
                    {selectedBUId &&
                      divisionTree[selectedBUId]?.map((div) => (
                        <option key={div.id} value={div.id}>
                          {div.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Employment Dates */}
            <div>
              <h4 className="text-md font-semibold mb-2 text-blue-600">Employment Dates</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate ? new Date(formData.startDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("startDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Probation End Date</label>
                  <Input
                    type="date"
                    value={formData.probationEndDate ? new Date(formData.probationEndDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("probationEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Contract End Date</label>
                  <Input
                    type="date"
                    value={formData.contractEndDate ? new Date(formData.contractEndDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("contractEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Resign Date</label>
                  <Input
                    type="date"
                    value={formData.resignDate ? new Date(formData.resignDate).toISOString().split("T")[0] : ""}
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
                    value={formData.promotionDate ? new Date(formData.promotionDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("promotionDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Demotion Date</label>
                  <Input
                    type="date"
                    value={formData.demotionDate ? new Date(formData.demotionDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("demotionDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Rehire Date</label>
                  <Input
                    type="date"
                    value={formData.rehireDate ? new Date(formData.rehireDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("rehireDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Status Checkboxes */}
            <div>
              <h4 className="text-md font-semibold mb-2 text-blue-600">Status</h4>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive || false}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isOnProbation || false}
                    onChange={(e) => handleChange("isOnProbation", e.target.checked)}
                  />
                  <span>On Probation</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isResigned || false}
                    onChange={(e) => handleChange("isResigned", e.target.checked)}
                  />
                  <span>Resigned</span>
                </label>
              </div>
            </div>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family" className="space-y-4">
            <h3 className="text-lg font-semibold">Family Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("motherName", "Mother Name", "text", formData.motherName, (e) => handleChange("motherName", e.target.value))}
              {renderInputWithError("fatherName", "Father Name", "text", formData.fatherName, (e) => handleChange("fatherName", e.target.value))}
              {renderInputWithError("maritalStatus", "Marital Status", "text", formData.maritalStatus, (e) => handleChange("maritalStatus", e.target.value))}
              {renderInputWithError("spouseName", "Spouse Name", "text", formData.spouseName, (e) => handleChange("spouseName", e.target.value))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Children Names</label>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("childrenNames")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              </div>
              {(formData.childrenNames || []).map((child, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={child}
                    onChange={(e) => handleArrayChange("childrenNames", index, e.target.value)}
                    placeholder={`Child ${index + 1} name`}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("childrenNames", index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <h3 className="text-lg font-semibold">Education Information</h3>
            
            {/* Skills, Interests, Languages */}
            <div className="space-y-4">
              {["skills", "interests", "languages"].map((field) => (
                <div key={field} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium capitalize">{field}</label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(field as keyof User)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add {field.slice(0, -1)}
                    </Button>
                  </div>
                  {((formData[field as keyof User] as string[]) || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayChange(field as keyof User, index, e.target.value)}
                        placeholder={`${field.slice(0, -1)} ${index + 1}`}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem(field as keyof User, index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Formal Education */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold">Formal Education</h4>
                <Button type="button" variant="outline" size="sm" onClick={addFormalEducation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
              {(formData.formalEducations || []).map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Education {index + 1}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeFormalEducation(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.level || ""}
                      onChange={(e) => handleFormalChange(index, "level", e.target.value)}
                      placeholder="Education Level"
                    />
                    <Input
                      value={edu.schoolName || ""}
                      onChange={(e) => handleFormalChange(index, "schoolName", e.target.value)}
                      placeholder="School Name"
                    />
                    <Input
                      value={edu.major || ""}
                      onChange={(e) => handleFormalChange(index, "major", e.target.value)}
                      placeholder="Major"
                    />
                    <Input
                      type="number"
                      value={edu.yearGraduate || ""}
                      onChange={(e) => handleFormalChange(index, "yearGraduate", Number(e.target.value))}
                      placeholder="Year Graduate"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Non-Formal Education */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold">Non-Formal Education</h4>
                <Button type="button" variant="outline" size="sm" onClick={addNonFormalEducation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>
              {(formData.nonFormalEducations || []).map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Course {index + 1}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeNonFormalEducation(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.name || ""}
                      onChange={(e) => handleNFChange(index, "name", e.target.value)}
                      placeholder="Course Name"
                    />
                    <Input
                      value={edu.institution || ""}
                      onChange={(e) => handleNFChange(index, "institution", e.target.value)}
                      placeholder="Institution"
                    />
                    <Input
                      type="number"
                      value={edu.year || ""}
                      onChange={(e) => handleNFChange(index, "year", Number(e.target.value))}
                      placeholder="Year"
                    />
                    <Textarea
                      value={edu.description || ""}
                      onChange={(e) => handleNFChange(index, "description", e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <h3 className="text-lg font-semibold">Documents & Insurance</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("identityCard", "Identity Card", "text", formData.identityCard, (e) => handleChange("identityCard", e.target.value))}
              {renderInputWithError("taxNumber", "Tax Number", "text", formData.taxNumber, (e) => handleChange("taxNumber", e.target.value))}
              {renderInputWithError("drivingLicense", "Driving License", "text", formData.drivingLicense, (e) => handleChange("drivingLicense", e.target.value))}
              {renderInputWithError("bpjsHealth", "BPJS Health", "text", formData.bpjsHealth, (e) => handleChange("bpjsHealth", e.target.value))}
              {renderInputWithError("bpjsEmployment", "BPJS Employment", "text", formData.bpjsEmployment, (e) => handleChange("bpjsEmployment", e.target.value))}
              {renderInputWithError("insuranceCompany", "Insurance Company", "text", formData.insuranceCompany, (e) => handleChange("insuranceCompany", e.target.value))}
              {renderInputWithError("insuranceNumber", "Insurance Number", "text", formData.insuranceNumber, (e) => handleChange("insuranceNumber", e.target.value))}
              <div className="space-y-1">
                <label className="text-sm font-medium">Insurance End Date</label>
                <Input
                  type="date"
                  value={formData.insuranceEndDate ? new Date(formData.insuranceEndDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => handleChange("insuranceEndDate", e.target.value ? `${e.target.value}T00:00:00.000Z` : null)}
                  className="w-full"
                />
              </div>
              {renderInputWithError("policyNumber", "Policy Number", "text", formData.policyNumber, (e) => handleChange("policyNumber", e.target.value))}
              {renderInputWithError("ptkpStatus", "PTKP Status", "text", formData.ptkpStatus, (e) => handleChange("ptkpStatus", e.target.value))}
            </div>

            <h4 className="text-lg font-semibold">Bank Information</h4>
            <div className="grid grid-cols-3 gap-4">
              {renderInputWithError("bankName", "Bank Name", "text", formData.bankName, (e) => handleChange("bankName", e.target.value))}
              {renderInputWithError("bankAccountNumber", "Bank Account Number", "text", formData.bankAccountNumber, (e) => handleChange("bankAccountNumber", e.target.value))}
              {renderInputWithError("bankAccountName", "Account Holder Name", "text", formData.bankAccountName, (e) => handleChange("bankAccountName", e.target.value))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4">
            <h4 className="text-lg font-semibold">Emergency Contact</h4>
            <div className="grid grid-cols-3 gap-4">
              {renderInputWithError("emergencyContactName", "Emergency Contact Name", "text", formData.emergencyContactName, (e) => handleChange("emergencyContactName", e.target.value))}
              {renderInputWithError("emergencyContactRelation", "Relation", "text", formData.emergencyContactRelation, (e) => handleChange("emergencyContactRelation", e.target.value))}
              {renderInputWithError("emergencyContactPhone", "Emergency Contact Phone", "tel", formData.emergencyContactPhone, (e) => handleChange("emergencyContactPhone", e.target.value))}
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-4">
            <h4 className="text-lg font-semibold">Social Media</h4>
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("instagram", "Instagram", "text", formData.instagram, (e) => handleChange("instagram", e.target.value))}
              {renderInputWithError("facebook", "Facebook", "text", formData.facebook, (e) => handleChange("facebook", e.target.value))}
              {renderInputWithError("twitter", "Twitter", "text", formData.twitter, (e) => handleChange("twitter", e.target.value))}
              {renderInputWithError("linkedin", "LinkedIn", "text", formData.linkedin, (e) => handleChange("linkedin", e.target.value))}
              {renderInputWithError("tiktok", "TikTok", "text", formData.tiktok, (e) => handleChange("tiktok", e.target.value))}
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-4">
            <h4 className="text-lg font-semibold">Health Information</h4>
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithError("bloodType", "Blood Type", "text", formData.bloodType, (e) => handleChange("bloodType", e.target.value))}
              {renderInputWithError("height", "Height (cm)", "number", formData.height, (e) => handleChange("height", Number(e.target.value)))}
              {renderInputWithError("weight", "Weight (kg)", "number", formData.weight, (e) => handleChange("weight", Number(e.target.value)))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Medical History</label>
              <Textarea
                value={formData.medicalHistory || ""}
                onChange={(e) => handleChange("medicalHistory", e.target.value)}
                placeholder="Medical History"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Allergies</label>
              <Textarea
                value={formData.allergies || ""}
                onChange={(e) => handleChange("allergies", e.target.value)}
                placeholder="Allergies"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
