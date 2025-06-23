"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormType } from "@/validation/userSchema";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  User,
  Shield,
  Heart,
  Building2,
  GraduationCap,
  FileText,
  DollarSign,
  Globe,
  Phone,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Loader2,
  X,
} from "lucide-react";

import { FormalEducation, NonFormalEducation, EmploymentType, Role, User as UserType } from "@/types/employee";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { createBusinessUnit, fetchBusinessUnits } from "@/store/businessUnitSlice";
import { createDivision, fetchDivisionTree } from "@/store/divisionSlice";
import { createUser, assignUserToDivision } from "@/store/userSlice";
import { toast } from "react-hot-toast";
import { divisionTreeToOptions } from "@/utils/divisionTreeToOptions";
import { withAuth } from "@/context/AuthContext";

// Import custom components
import { BusinessUnitModal } from "@/components/forms/BusinessUnitModal";
import { DivisionModal } from "@/components/forms/DivisionModal";
import { FormalEducationArray } from "@/components/forms/FormalEducationArray";
import { NonFormalEducationArray } from "@/components/forms/NonFormalEducationArray";
import { FormSection, InputField } from "@/components/forms/FormComponents";

const EmployeeManagementCreateForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<number | null>(null);

  const divisionTree = useSelector((state: RootState) =>
    selectedBusinessUnit !== null
      ? state.division.tree[selectedBusinessUnit] || []
      : []
  );

  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<EmploymentType | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.EMPLOYEE);
  
  // Modal states
  const [showBusinessUnitModal, setShowBusinessUnitModal] = useState(false);
  const [showDivisionModal, setShowDivisionModal] = useState(false);
  
  // Form section navigation
  const [activeSection, setActiveSection] = useState<string>("auth");
  
  // Education arrays
  const [formalEducations, setFormalEducations] = useState<FormalEducation[]>([]);
  const [nonFormalEducations, setNonFormalEducations] = useState<NonFormalEducation[]>([]);
  
  // Skills, interests, languages
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newLanguage, setNewLanguage] = useState("");  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    reset,  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      childrenNames: [],
      formalEducations: [],
      nonFormalEducations: [],
      interests: [],
      skills: [],
      languages: [],
      role: Role.EMPLOYEE,
      isActive: true,
      isOnProbation: false,
      isResigned: false,
    },
  });  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    // @ts-expect-error - temporary fix for type mismatch
    name: "childrenNames",
  });

  // Side Effects
  useEffect(() => {
    dispatch(fetchBusinessUnits());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusinessUnit) {
      dispatch(fetchDivisionTree(selectedBusinessUnit));
    }
  }, [dispatch, selectedBusinessUnit]);

  const divisionOptions = divisionTreeToOptions(divisionTree);

  // Handlers
  const handleBusinessUnitCreate = async (name: string) => {
    try {
      await dispatch(createBusinessUnit({ name })).unwrap();
      toast.success("Business Unit created successfully!");
      dispatch(fetchBusinessUnits());
    } catch (err) {
      const error = err as Error & { response?: { data: string } };
      toast.error("Failed to create business unit: " + error.message);
      throw err;
    }
  };

  const handleDivisionCreate = async (
    name: string,
    businessUnitId: number,
    parentId?: number
  ) => {
    try {
      await dispatch(createDivision({ name, businessUnitId, parentId })).unwrap();
      toast.success("Division created successfully!");
      if (selectedBusinessUnit) {
        dispatch(fetchDivisionTree(selectedBusinessUnit));
      }
    } catch (err) {
      const error = err as Error & { response?: { data: string } };
      toast.error("Failed to create division: " + error.message);
      throw err;
    }
  };

  // Array handlers
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const addFormalEducation = (education: FormalEducation) => {
    setFormalEducations([...formalEducations, education]);
  };

  const removeFormalEducation = (index: number) => {
    setFormalEducations(formalEducations.filter((_, i) => i !== index));
  };

  const addNonFormalEducation = (education: NonFormalEducation) => {
    setNonFormalEducations([...nonFormalEducations, education]);
  };

  const removeNonFormalEducation = (index: number) => {
    setNonFormalEducations(nonFormalEducations.filter((_, i) => i !== index));
  };

  // Form sections configuration
  const sections = [
    { id: "auth", title: "Authentication", icon: Shield },
    { id: "personal", title: "Personal Info", icon: User },
    { id: "family", title: "Family Info", icon: Users },
    { id: "organization", title: "Organization", icon: Building2 },
    { id: "documents", title: "Documents", icon: FileText },
    { id: "finance", title: "Finance & Insurance", icon: DollarSign },
    { id: "health", title: "Health Info", icon: Heart },
    { id: "social", title: "Social Media", icon: Globe },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "skills", title: "Skills & Interests", icon: Briefcase },
  ];

  const sectionOrder = sections.map((s) => s.id);
  const currentIndex = sectionOrder.findIndex((id) => id === activeSection);
  const isLastSection = currentIndex === sections.length - 1;

  const handleNext = () => {
    if (!isLastSection) {
      setActiveSection(sectionOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSection(sectionOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Form submission
  const onSubmit: SubmitHandler<UserFormType> = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Validate required fields based on form sections
      if (!data.email || !data.password || !data.username) {
        toast.error("Please fill in all required authentication fields");
        setActiveSection("auth");
        return;
      }

      // Prepare date fields
      let dateOfBirthISO: string | undefined;
      if (data.dateOfBirth) {
        dateOfBirthISO = data.dateOfBirth.length === 10
          ? data.dateOfBirth + "T00:00:00.000Z"
          : data.dateOfBirth;
      }

      let startDateISO: string | undefined;
      if (data.startDate) {
        startDateISO = data.startDate.length === 10
          ? data.startDate + "T00:00:00.000Z"
          : data.startDate;
      }

      let probationEndDateISO: string | undefined;
      if (data.probationEndDate) {
        probationEndDateISO = data.probationEndDate.length === 10
          ? data.probationEndDate + "T00:00:00.000Z"
          : data.probationEndDate;
      }

      let contractEndDateISO: string | undefined;
      if (data.contractEndDate) {
        contractEndDateISO = data.contractEndDate.length === 10
          ? data.contractEndDate + "T00:00:00.000Z"
          : data.contractEndDate;
      }

      // Prepare payload
      const payload: Partial<UserType> = {
        ...data,
        dateOfBirth: dateOfBirthISO,
        startDate: startDateISO,
        probationEndDate: probationEndDateISO,
        contractEndDate: contractEndDateISO,
        divisionId: data.divisionId ? parseInt(String(data.divisionId)) : undefined,
        jobLevel: data.jobLevel ? parseInt(String(data.jobLevel)) : undefined,
        formalEducations,
        nonFormalEducations,
        skills,
        interests,
        languages,
      };

      // Create user
      const newUser = await dispatch(createUser(payload)).unwrap();

      // Assign to division if specified
      if (newUser?.id && payload.divisionId) {
        await dispatch(assignUserToDivision({ 
          userId: newUser.id, 
          divisionId: payload.divisionId 
        }));
      }

      toast.success("Employee profile created successfully!");
      
      // Reset form
      reset();
      setFormalEducations([]);
      setNonFormalEducations([]);
      setSkills([]);
      setInterests([]);
      setLanguages([]);
      setSelectedDivisionId(null);
      setSelectedBusinessUnit(null);
      setActiveSection("auth");
      
    } catch (err) {
      const error = err as Error & { response?: { data: string } };
      toast.error("Failed to create employee: " + error.message);
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Employee Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create comprehensive employee profiles with organizational structure
        </p>
      </div>

      {/* Section Navigation Tabs */}
      <Card className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <div className="flex flex-wrap justify-center gap-3 ">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-600 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-500"
                } border font-medium whitespace-nowrap`}
              >
                <Icon className="w-4 h-4" />
                {section.title}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Authentication Section */}
        {activeSection === "auth" && (
          <FormSection title="Authentication & Basic Info" icon={Shield} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField 
                label="Email Address" 
                icon={Globe} 
                error={errors.email?.message}
                required
              >
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="user@company.com"
                  className={errors.email ? "border-red-500" : ""}
                />
              </InputField>
              
              <InputField 
                label="Password" 
                icon={Shield} 
                error={errors.password?.message}
                required
              >
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={errors.password ? "border-red-500" : ""}
                />
              </InputField>
              
              <InputField 
                label="Username" 
                icon={User} 
                error={errors.username?.message}
                required
              >
                <Input 
                  {...register("username")} 
                  placeholder="johndoe"
                  className={errors.username ? "border-red-500" : ""}
                />
              </InputField>

              <InputField label="Role" icon={Shield}>                <Select
                  value={selectedRole}
                  onValueChange={(value) => {
                    const roleValue = value as Role;
                    setSelectedRole(roleValue);
                    setValue("role", roleValue);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>

              <InputField label="Employment Type" icon={Briefcase}>
                <Select
                  value={selectedEmploymentType || ""}
                  onValueChange={(value) => {
                    setSelectedEmploymentType(value as EmploymentType);
                    setValue("employmentType", value as EmploymentType);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="PROBATION">Probation</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="PERMANENT">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
            </div>
          </FormSection>
        )}        {/* Personal Section */}
        {activeSection === "personal" && (
          <FormSection title="Personal Information" icon={User} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Full Name" icon={User} error={errors.fullName?.message}>
                <Input {...register("fullName")} placeholder="John Doe" />
              </InputField>
              
              <InputField label="National ID" icon={FileText} error={errors.nationalId?.message}>
                <Input {...register("nationalId")} placeholder="1234567890123456" />
              </InputField>
              
              <InputField label="Phone Number" icon={Phone} error={errors.phoneNumber?.message}>
                <Input {...register("phoneNumber")} placeholder="+62 812 3456 7890" />
              </InputField>
              
              <InputField label="Address" icon={MapPin} error={errors.address?.message}>
                <Input {...register("address")} placeholder="Jl. Sudirman No. 123" />
              </InputField>
              
              <InputField label="Place of Birth" icon={MapPin} error={errors.placeOfBirth?.message}>
                <Input {...register("placeOfBirth")} placeholder="Jakarta" />
              </InputField>
              
              <InputField label="Date of Birth" icon={Calendar} error={errors.dateOfBirth?.message}>
                <Input {...register("dateOfBirth")} type="date" />
              </InputField>
              
              <InputField label="Gender">
                <Select
                  value={selectedGender ?? ""}
                  onValueChange={(value) => {
                    setSelectedGender(value);
                    setValue("gender", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Family Section */}
        {activeSection === "family" && (
          <FormSection title="Family Information" icon={Users} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Mother's Name" icon={User}>
                <Input {...register("motherName")} placeholder="Jane Doe" />
              </InputField>
              
              <InputField label="Father's Name" icon={User}>
                <Input {...register("fatherName")} placeholder="John Doe Sr." />
              </InputField>
              
              <InputField label="Marital Status">
                <Select
                  onValueChange={(value) => setValue("maritalStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
              
              <InputField label="Spouse Name" icon={User}>
                <Input {...register("spouseName")} placeholder="Spouse name" />
              </InputField>
            </div>
            
            {/* Children Names */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                Children Names
              </Label>
              <div className="space-y-2">
                {childrenFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <Input
                      {...register(`childrenNames.${idx}` as const)}
                      placeholder={`Child ${idx + 1} name`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeChild(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // @ts-expect-error - temporary fix for type mismatch
                    appendChild("");
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Child
                </Button>
              </div>
            </div>
          </FormSection>
        )}

        {/* Organization Section */}
        {activeSection === "organization" && (
          <FormSection title="Organization Structure" icon={Building2} isActive>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField label="Office Email" icon={Globe} error={errors.officeEmail?.message}>
                  <Input
                    {...register("officeEmail")}
                    type="email"
                    placeholder="john@company.com"
                  />
                </InputField>
                
                <InputField label="Position" icon={Briefcase}>
                  <Input {...register("position")} placeholder="Software Engineer" />
                </InputField>
                
                <InputField label="Job Title" icon={Briefcase}>
                  <Select onValueChange={(value) => setValue("jobTitle", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Job Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Associate">Associate</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                      <SelectItem value="VP / Deputy Director">VP / Deputy Director</SelectItem>
                      <SelectItem value="Director">Director</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </InputField>
                
                <InputField label="Job Level" error={errors.jobLevel?.message}>
                  <Input
                    {...register("jobLevel", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="10"
                    placeholder="1-10"
                  />
                </InputField>
                
                <InputField label="Start Date" icon={Calendar}>
                  <Input {...register("startDate")} type="date" />
                </InputField>
                
                <InputField label="Probation End Date" icon={Calendar}>
                  <Input {...register("probationEndDate")} type="date" />
                </InputField>
                
                <InputField label="Contract End Date" icon={Calendar}>
                  <Input {...register("contractEndDate")} type="date" />
                </InputField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Business Unit" icon={Building2}>
                  <div className="flex gap-2">
                    <Select
                      value={selectedBusinessUnit !== null ? String(selectedBusinessUnit) : ""}
                      onValueChange={(v) => {
                        setSelectedBusinessUnit(Number(v));
                        setSelectedDivisionId(null);
                        setValue("divisionId", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Business Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessUnits.map((bu) => (
                          <SelectItem key={bu.id} value={String(bu.id)}>
                            {bu.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => setShowBusinessUnitModal(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </InputField>

                <InputField label="Division" error={errors.divisionId?.message}>
                  <div className="flex gap-2">
                    <Select
                      value={selectedDivisionId !== null ? String(selectedDivisionId) : ""}
                      onValueChange={(v) => {
                        setSelectedDivisionId(Number(v));
                        setValue("divisionId", v);
                      }}
                      disabled={!selectedBusinessUnit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>                      <SelectContent>
                        {divisionOptions.length === 0 ? (
                          <div className="p-2 text-muted-foreground text-sm">
                            No division available
                          </div>
                        ) : (
                          divisionOptions.map((opt) => (
                            <SelectItem key={opt.id} value={String(opt.id)}>
                              {opt.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => setShowDivisionModal(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </InputField>
              </div>
            </div>
          </FormSection>
        )}

        {/* Documents Section */}
        {activeSection === "documents" && (
          <FormSection title="Documents & Identification" icon={FileText} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Identity Card" icon={FileText}>
                <Input {...register("identityCard")} placeholder="KTP Number" />
              </InputField>
              
              <InputField label="Tax Number (NPWP)" icon={FileText}>
                <Input {...register("taxNumber")} placeholder="12.345.678.9-012.000" />
              </InputField>
              
              <InputField label="Driving License" icon={FileText}>
                <Input {...register("drivingLicense")} placeholder="SIM Number" />
              </InputField>
              
              <InputField label="PTKP Status" icon={FileText}>
                <Select onValueChange={(value) => setValue("ptkpStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PTKP Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TK/0">TK/0 - Single, No Dependent</SelectItem>
                    <SelectItem value="TK/1">TK/1 - Single, 1 Dependent</SelectItem>
                    <SelectItem value="TK/2">TK/2 - Single, 2 Dependents</SelectItem>
                    <SelectItem value="TK/3">TK/3 - Single, 3 Dependents</SelectItem>
                    <SelectItem value="K/0">K/0 - Married, No Dependent</SelectItem>
                    <SelectItem value="K/1">K/1 - Married, 1 Dependent</SelectItem>
                    <SelectItem value="K/2">K/2 - Married, 2 Dependents</SelectItem>
                    <SelectItem value="K/3">K/3 - Married, 3 Dependents</SelectItem>
                    <SelectItem value="K/I/0">K/I/0 - Married, Wife Income, No Dependent</SelectItem>
                    <SelectItem value="K/I/1">K/I/1 - Married, Wife Income, 1 Dependent</SelectItem>
                    <SelectItem value="K/I/2">K/I/2 - Married, Wife Income, 2 Dependents</SelectItem>
                    <SelectItem value="K/I/3">K/I/3 - Married, Wife Income, 3 Dependents</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Finance Section */}
        {activeSection === "finance" && (
          <FormSection title="Finance & Insurance" icon={DollarSign} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Bank Name" icon={Building2}>
                <Input {...register("bankName")} placeholder="Bank Mandiri" />
              </InputField>
              
              <InputField label="Bank Account Number" icon={DollarSign}>
                <Input {...register("bankAccountNumber")} placeholder="1234567890" />
              </InputField>
              
              <InputField label="Bank Account Name" icon={User}>
                <Input {...register("bankAccountName")} placeholder="John Doe" />
              </InputField>
              
              <InputField label="BPJS Health" icon={Heart}>
                <Input {...register("bpjsHealth")} placeholder="BPJS Health Number" />
              </InputField>
              
              <InputField label="BPJS Employment" icon={Briefcase}>
                <Input {...register("bpjsEmployment")} placeholder="BPJS Employment Number" />
              </InputField>
              
              <InputField label="Insurance Company" icon={Shield}>
                <Input {...register("insuranceCompany")} placeholder="Insurance Company Name" />
              </InputField>
              
              <InputField label="Insurance Number" icon={FileText}>
                <Input {...register("insuranceNumber")} placeholder="Insurance Number" />
              </InputField>
              
              <InputField label="Policy Number" icon={FileText}>
                <Input {...register("policyNumber")} placeholder="Policy Number" />
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Health Section */}
        {activeSection === "health" && (
          <FormSection title="Health Information" icon={Heart} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputField label="Blood Type" icon={Heart}>
                <Select onValueChange={(value) => setValue("bloodType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
              
              <InputField label="Height (cm)" icon={User} error={errors.height?.message}>
                <Input
                  {...register("height", { valueAsNumber: true })}
                  type="number"
                  min="50"
                  max="300"
                  placeholder="170"
                />
              </InputField>
              
              <InputField label="Weight (kg)" icon={User} error={errors.weight?.message}>
                <Input
                  {...register("weight", { valueAsNumber: true })}
                  type="number"
                  min="20"
                  max="500"
                  placeholder="70"
                />
              </InputField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Medical History" icon={FileText}>
                <Textarea
                  {...register("medicalHistory")}
                  placeholder="Medical conditions, surgeries, etc."
                  rows={3}
                />
              </InputField>
              
              <InputField label="Allergies" icon={Heart}>
                <Textarea
                  {...register("allergies")}
                  placeholder="Food allergies, drug allergies, etc."
                  rows={3}
                />
              </InputField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Emergency Contact Name" icon={User}>
                <Input {...register("emergencyContactName")} placeholder="Emergency contact name" />
              </InputField>
              
              <InputField label="Emergency Contact Relation" icon={Users}>
                <Input {...register("emergencyContactRelation")} placeholder="Father, Mother, Spouse, etc." />
              </InputField>
              
              <InputField label="Emergency Contact Phone" icon={Phone}>
                <Input {...register("emergencyContactPhone")} placeholder="+62 812 3456 7890" />
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Social Section */}
        {activeSection === "social" && (
          <FormSection title="Social Media" icon={Globe} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Instagram" icon={Globe}>
                <Input {...register("instagram")} placeholder="@username" />
              </InputField>
              
              <InputField label="Facebook" icon={Globe}>
                <Input {...register("facebook")} placeholder="facebook.com/username" />
              </InputField>
              
              <InputField label="Twitter" icon={Globe}>
                <Input {...register("twitter")} placeholder="@username" />
              </InputField>
              
              <InputField label="LinkedIn" icon={Globe}>
                <Input {...register("linkedin")} placeholder="linkedin.com/in/username" />
              </InputField>
              
              <InputField label="TikTok" icon={Globe}>
                <Input {...register("tiktok")} placeholder="@username" />
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <FormSection title="Education" icon={GraduationCap} isActive>
            <div className="space-y-6">
              {/* Formal Education */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap className="w-5 h-5" />
                  Formal Education
                </Label>
                <FormalEducationArray
                  educations={formalEducations}
                  onAdd={addFormalEducation}
                  onRemove={removeFormalEducation}
                />
              </div>

              {/* Non-Formal Education */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap className="w-5 h-5" />
                  Non-Formal Education
                </Label>
                <NonFormalEducationArray
                  educations={nonFormalEducations}
                  onAdd={addNonFormalEducation}
                  onRemove={removeNonFormalEducation}
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* Skills & Interests Section */}
        {activeSection === "skills" && (
          <FormSection title="Skills & Interests" icon={Briefcase} isActive>
            <div className="space-y-6">
              {/* Skills */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  <Briefcase className="w-5 h-5" />
                  Skills
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} disabled={!newSkill.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                      <span>{skill}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSkill(index)}
                        className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  <Heart className="w-5 h-5" />
                  Interests
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                  />
                  <Button type="button" onClick={addInterest} disabled={!newInterest.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                      <span>{interest}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeInterest(index)}
                        className="h-4 w-4 p-0 hover:bg-green-200 dark:hover:bg-green-800"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  <Globe className="w-5 h-5" />
                  Languages
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                  />
                  <Button type="button" onClick={addLanguage} disabled={!newLanguage.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language, index) => (
                    <div key={index} className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                      <span>{language}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLanguage(index)}
                        className="h-4 w-4 p-0 hover:bg-purple-200 dark:hover:bg-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>
        )}

        {/* Navigation and Submit Section */}
        <Card className="flex flex-col items-center space-y-4 p-6 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
          {/* Progress Meter */}
          <div className="w-full">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-center mt-2 text-gray-600 dark:text-gray-300">
              {currentIndex + 1} / {sections.length} Sections Completed
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {currentIndex > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrev}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            {!isLastSection && (
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            )}
            {isLastSection && (
              <Button
                type="submit"
                size="lg"
                className="inline-flex items-center gap-2 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Employee...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Create Employee Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </form>

      {/* Modals */}
      <BusinessUnitModal
        open={showBusinessUnitModal}
        onOpenChange={setShowBusinessUnitModal}
        onCreate={handleBusinessUnitCreate}
      />
      <DivisionModal
        open={showDivisionModal}
        onOpenChange={setShowDivisionModal}
        businessUnits={businessUnits}
        onCreate={handleDivisionCreate}
      />
    </div>
  );
};

export default withAuth(EmployeeManagementCreateForm);
