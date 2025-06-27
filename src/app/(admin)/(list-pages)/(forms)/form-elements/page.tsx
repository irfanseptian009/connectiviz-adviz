"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AdminOnly } from "@/components/common/RoleGuard";
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
import { withAuth } from "@/context/AuthContext";
import { adminPhotoService } from "@/services/adminPhotoService";
import { divisionTreeToOptions } from "@/utils/divisionTreeToOptions";

// Import custom components
import { BusinessUnitModal } from "@/components/forms/BusinessUnitModal";
import { DivisionModal } from "@/components/forms/DivisionModal";
import { FormalEducationArray } from "@/components/forms/FormalEducationArray";
import { NonFormalEducationArray } from "@/components/forms/NonFormalEducationArray";
import { FormSection, InputField } from "@/components/forms/FormComponents";
import EmployeePhotoUpload from "@/components/employee/EmployeePhotoUpload";

const EmployeeManagementCreateForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with false so inputs are not disabled initially
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
  const [newLanguage, setNewLanguage] = useState("");
  
  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  // Define the form type to include childrenNames as string[]
  type EmployeeFormValues = {
    email: string;
    password: string;
    username: string;
    role: string;
    employmentType: string;
    fullName: string;
    nationalId: string;
    phoneNumber: string;
    address: string;
    placeOfBirth: string;
    dateOfBirth: string;
    gender: string;
    officeEmail: string;
    position: string;
    jobTitle: string;
    jobLevel: string | number;
    startDate: string;
    probationEndDate: string;
    contractEndDate: string;
    divisionId: string;
    motherName: string;
    fatherName: string;
    maritalStatus: string;
    spouseName: string;
    childrenNames: { value: string }[]; 
    identityCard: string;
    taxNumber: string;
    drivingLicense: string;
    ptkpStatus: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    bpjsHealth: string;
    bpjsEmployment: string;
    insuranceCompany: string;
    insuranceNumber: string;
    policyNumber: string;
    bloodType: string;
    height: number;
    weight:  number;
    medicalHistory: string;
    allergies: string;
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactPhone: string;
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm<EmployeeFormValues>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      username: "",
      role: "EMPLOYEE",
      employmentType: "",
      fullName: "",
      nationalId: "",
      phoneNumber: "",
      address: "",
      placeOfBirth: "",
      dateOfBirth: "",
      gender: "",
      officeEmail: "",
      position: "",
      jobTitle: "",
      jobLevel: "",
      startDate: "",
      probationEndDate: "",
      contractEndDate: "",
      divisionId: "",
      motherName: "",
      fatherName: "",
      maritalStatus: "",
      spouseName: "",
      childrenNames: [],
      identityCard: "",
      taxNumber: "",
      drivingLicense: "",
      ptkpStatus: "",
      bankName: "",
      bankAccountNumber: "",
      bankAccountName: "",
      bpjsHealth: "",
      bpjsEmployment: "",
      insuranceCompany: "",
      insuranceNumber: "",
      policyNumber: "",
      bloodType: "",
      height: 0,
      weight: 0,
      medicalHistory: "",
      allergies: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      tiktok: "",
    },
  });
  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: "childrenNames",
  });

  // Side Effects
  useEffect(() => {
    console.log("Component mounted, fetching business units...");
    dispatch(fetchBusinessUnits());
    // Set loading to false immediately - no need for delay that disables inputs
    setIsLoading(false);
  }, [dispatch]);

  // Debug effect
  useEffect(() => {
    console.log("Form state:", { 
      isLoading, 
      isSubmitting,
      activeSection, 
      selectedBusinessUnit, 
      errors: Object.keys(errors)
    });
  }, [isLoading, isSubmitting, activeSection, selectedBusinessUnit, errors]);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
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
      const newUser = await dispatch(createUser(payload)).unwrap();

      // Assign to division if specified
      if (newUser?.id && payload.divisionId) {
        await dispatch(assignUserToDivision({ 
          userId: newUser.id, 
          divisionId: payload.divisionId 
        }));
      }      // Upload profile photo if provided
      if (profilePhoto && newUser?.id) {
        try {
          await adminPhotoService.uploadUserProfilePhoto(newUser.id, profilePhoto);
          toast.success('Profile photo uploaded successfully!');
        } catch (photoError) {
          console.error('Photo upload failed:', photoError);
          toast.error('Employee created but photo upload failed');
        }
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
      setProfilePhoto(null);
      
    } catch (err) {
      const error = err as Error & { response?: { data: string } };
      toast.error("Failed to create employee: " + error.message);
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminOnly 
      fallback={
        <div className="max-w-6xl mx-auto p-6 text-center">
          <Card className="p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-300">
              You don&apos;t have permission to create new employees. This feature is only available for administrators.
            </p>
          </Card>
        </div>
      }
    >
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
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-lg">Form Progress</CardTitle>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-center text-gray-600 dark:text-gray-300">
            Step {currentIndex + 1} of {sections.length}: {sections[currentIndex]?.title}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isCompleted = index < currentIndex;
              return (
                <Button
                  key={section.id}
                  variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : isCompleted
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-white dark:bg-slate-600 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-500"
                  } border font-medium whitespace-nowrap relative`}
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                  {isCompleted && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs bg-green-500 text-white">
                      ✓
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
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
                  name="email"
                  type="email"
                  placeholder="user@company.com"
                  value={watch("email") || ""}
                  onChange={(e) => setValue("email", e.target.value)}
                  onBlur={register("email").onBlur}
                  ref={register("email").ref}
                  className={`transition-colors ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                  disabled={isSubmitting}
                />
              </InputField>
              
              <InputField 
                label="Password" 
                icon={Shield} 
                error={errors.password?.message}
                required
              >
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={watch("password") || ""}
                  onChange={(e) => setValue("password", e.target.value)}
                  onBlur={register("password").onBlur}
                  ref={register("password").ref}
                  className={`transition-colors ${errors.password ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                  disabled={isSubmitting}
                />
              </InputField>
              
              <InputField 
                label="Username" 
                icon={User} 
                error={errors.username?.message}
                required
              >
                <Input 
                  name="username"
                  placeholder="johndoe"
                  value={watch("username") || ""}
                  onChange={(e) => setValue("username", e.target.value)}
                  onBlur={register("username").onBlur}
                  ref={register("username").ref}
                  className={`transition-colors ${errors.username ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
                  disabled={isSubmitting}
                />
              </InputField>

              <InputField label="Role" icon={Shield}>                
                <Select
                  value={selectedRole}
                  onValueChange={(value) => {
                    const roleValue = value as Role;
                    setSelectedRole(roleValue);
                    setValue("role", roleValue);
                  }}
                >
                  <SelectTrigger className="focus:border-blue-500">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Employee
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="SUPER_ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Super Admin
                      </div>
                    </SelectItem>
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
                  <SelectTrigger className="focus:border-blue-500">
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNSHIP">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Internship
                      </div>
                    </SelectItem>
                    <SelectItem value="PROBATION">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Probation
                      </div>
                    </SelectItem>
                    <SelectItem value="CONTRACT">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Contract
                      </div>
                    </SelectItem>
                    <SelectItem value="PERMANENT">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Permanent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
            </div>
          </FormSection>
        )}        {/* Personal Section */}
        {activeSection === "personal" && (
          <FormSection title="Personal Information" icon={User} isActive>
            {/* Profile Photo Upload */}
            <div className="mb-6">
              <EmployeePhotoUpload
                onPhotoChange={setProfilePhoto}
                disabled={isSubmitting}
                className="max-w-md mx-auto"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Full Name" icon={User} error={errors.fullName?.message}>
                <Input 
                  name="fullName"
                  placeholder="John Doe"
                  value={watch("fullName") || ""}
                  onChange={(e) => setValue("fullName", e.target.value)}
                  onBlur={register("fullName").onBlur}
                  ref={register("fullName").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="National ID" icon={FileText} error={errors.nationalId?.message}>
                <Input 
                  name="nationalId"
                  placeholder="1234567890123456"
                  value={watch("nationalId") || ""}
                  onChange={(e) => setValue("nationalId", e.target.value)}
                  onBlur={register("nationalId").onBlur}
                  ref={register("nationalId").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Phone Number" icon={Phone} error={errors.phoneNumber?.message}>
                <Input 
                  name="phoneNumber"
                  placeholder="+62 812 3456 7890"
                  value={watch("phoneNumber") || ""}
                  onChange={(e) => setValue("phoneNumber", e.target.value)}
                  onBlur={register("phoneNumber").onBlur}
                  ref={register("phoneNumber").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Address" icon={MapPin} error={errors.address?.message}>
                <Input 
                  name="address"
                  placeholder="Jl. Sudirman No. 123"
                  value={watch("address") || ""}
                  onChange={(e) => setValue("address", e.target.value)}
                  onBlur={register("address").onBlur}
                  ref={register("address").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Place of Birth" icon={MapPin} error={errors.placeOfBirth?.message}>
                <Input 
                  name="placeOfBirth"
                  placeholder="Jakarta"
                  value={watch("placeOfBirth") || ""}
                  onChange={(e) => setValue("placeOfBirth", e.target.value)}
                  onBlur={register("placeOfBirth").onBlur}
                  ref={register("placeOfBirth").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Date of Birth" icon={Calendar} error={errors.dateOfBirth?.message}>
                <Input 
                  name="dateOfBirth"
                  type="date"
                  value={watch("dateOfBirth") || ""}
                  onChange={(e) => setValue("dateOfBirth", e.target.value)}
                  onBlur={register("dateOfBirth").onBlur}
                  ref={register("dateOfBirth").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Gender" icon={User}>
                <Select
                  value={selectedGender ?? ""}
                  onValueChange={(value) => {
                    setSelectedGender(value);
                    setValue("gender", value);
                  }}
                >
                  <SelectTrigger className="focus:border-blue-500">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Male
                      </div>
                    </SelectItem>
                    <SelectItem value="Female">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Female
                      </div>
                    </SelectItem>
                    <SelectItem value="Other">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Other
                      </div>
                    </SelectItem>
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
                <Input 
                  name="motherName"
                  placeholder="Jane Doe"
                  value={watch("motherName") || ""}
                  onChange={(e) => setValue("motherName", e.target.value)}
                  onBlur={register("motherName").onBlur}
                  ref={register("motherName").ref}
                />
              </InputField>
              
              <InputField label="Father's Name" icon={User}>
                <Input 
                  name="fatherName"
                  placeholder="John Doe Sr."
                  value={watch("fatherName") || ""}
                  onChange={(e) => setValue("fatherName", e.target.value)}
                  onBlur={register("fatherName").onBlur}
                  ref={register("fatherName").ref}
                />
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
                <Input 
                  name="spouseName"
                  placeholder="Spouse name"
                  value={watch("spouseName") || ""}
                  onChange={(e) => setValue("spouseName", e.target.value)}
                  onBlur={register("spouseName").onBlur}
                  ref={register("spouseName").ref}
                />
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
                      name={`childrenNames.${idx}.value`}
                      value={watch(`childrenNames.${idx}.value`) || ""}
                      onChange={(e) => setValue(`childrenNames.${idx}.value`, e.target.value)}
                      onBlur={register(`childrenNames.${idx}.value`).onBlur}
                      ref={register(`childrenNames.${idx}.value`).ref}
                      placeholder={`Child ${idx + 1} name`}
                      className="flex-1 focus:border-blue-500 transition-colors"
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
                ))}                
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendChild({ value: "" })}
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
                    name="officeEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={watch("officeEmail") || ""}
                    onChange={(e) => setValue("officeEmail", e.target.value)}
                    onBlur={register("officeEmail").onBlur}
                    ref={register("officeEmail").ref}
                    className="focus:border-blue-500 transition-colors"
                  />
                </InputField>
                
                <InputField label="Position" icon={Briefcase}>
                  <Input 
                    name="position"
                    placeholder="Software Engineer"
                    value={watch("position") || ""}
                    onChange={(e) => setValue("position", e.target.value)}
                    onBlur={register("position").onBlur}
                    ref={register("position").ref}
                    className="focus:border-blue-500 transition-colors"
                  />
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
                    name="jobLevel"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="1-10"
                    value={watch("jobLevel") || ""}
                    onChange={(e) => setValue("jobLevel", parseInt(e.target.value) || "")}
                    onBlur={register("jobLevel").onBlur}
                    ref={register("jobLevel").ref}
                    className="focus:border-blue-500 transition-colors"
                  />
                </InputField>
                
                <InputField label="Start Date" icon={Calendar}>
                  <Input 
                    name="startDate"
                    type="date"
                    value={watch("startDate") || ""}
                    onChange={(e) => setValue("startDate", e.target.value)}
                    onBlur={register("startDate").onBlur}
                    ref={register("startDate").ref}
                    className="focus:border-blue-500 transition-colors"
                  />
                </InputField>
                
                <InputField label="Probation End Date" icon={Calendar}>
                  <Input 
                    name="probationEndDate"
                    type="date"
                    value={watch("probationEndDate") || ""}
                    onChange={(e) => setValue("probationEndDate", e.target.value)}
                    onBlur={register("probationEndDate").onBlur}
                    ref={register("probationEndDate").ref}
                    className="focus:border-blue-500 transition-colors"
                  />
                </InputField>
                
                <InputField label="Contract End Date" icon={Calendar}>
                  <Input 
                    name="contractEndDate"
                    type="date"
                    value={watch("contractEndDate") || ""}
                    onChange={(e) => setValue("contractEndDate", e.target.value)}
                    onBlur={register("contractEndDate").onBlur}
                    ref={register("contractEndDate").ref}
                    className="focus:border-blue-500 transition-colors"
                  />
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
                <Input 
                  name="identityCard"
                  placeholder="KTP Number"
                  value={watch("identityCard") || ""}
                  onChange={(e) => setValue("identityCard", e.target.value)}
                  onBlur={register("identityCard").onBlur}
                  ref={register("identityCard").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Tax Number (NPWP)" icon={FileText}>
                <Input 
                  name="taxNumber"
                  placeholder="12.345.678.9-012.000"
                  value={watch("taxNumber") || ""}
                  onChange={(e) => setValue("taxNumber", e.target.value)}
                  onBlur={register("taxNumber").onBlur}
                  ref={register("taxNumber").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Driving License" icon={FileText}>
                <Input 
                  name="drivingLicense"
                  placeholder="SIM Number"
                  value={watch("drivingLicense") || ""}
                  onChange={(e) => setValue("drivingLicense", e.target.value)}
                  onBlur={register("drivingLicense").onBlur}
                  ref={register("drivingLicense").ref}
                  className="focus:border-blue-500 transition-colors"
                />
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
                <Input 
                  name="bankName"
                  placeholder="Bank Mandiri"
                  value={watch("bankName") || ""}
                  onChange={(e) => setValue("bankName", e.target.value)}
                  onBlur={register("bankName").onBlur}
                  ref={register("bankName").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Bank Account Number" icon={DollarSign}>
                <Input 
                  name="bankAccountNumber"
                  placeholder="1234567890"
                  value={watch("bankAccountNumber") || ""}
                  onChange={(e) => setValue("bankAccountNumber", e.target.value)}
                  onBlur={register("bankAccountNumber").onBlur}
                  ref={register("bankAccountNumber").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Bank Account Name" icon={User}>
                <Input 
                  name="bankAccountName"
                  placeholder="John Doe"
                  value={watch("bankAccountName") || ""}
                  onChange={(e) => setValue("bankAccountName", e.target.value)}
                  onBlur={register("bankAccountName").onBlur}
                  ref={register("bankAccountName").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="BPJS Health" icon={Heart}>
                <Input 
                  name="bpjsHealth"
                  placeholder="BPJS Health Number"
                  value={watch("bpjsHealth") || ""}
                  onChange={(e) => setValue("bpjsHealth", e.target.value)}
                  onBlur={register("bpjsHealth").onBlur}
                  ref={register("bpjsHealth").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="BPJS Employment" icon={Briefcase}>
                <Input 
                  name="bpjsEmployment"
                  placeholder="BPJS Employment Number"
                  value={watch("bpjsEmployment") || ""}
                  onChange={(e) => setValue("bpjsEmployment", e.target.value)}
                  onBlur={register("bpjsEmployment").onBlur}
                  ref={register("bpjsEmployment").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Insurance Company" icon={Shield}>
                <Input 
                  name="insuranceCompany"
                  placeholder="Insurance Company Name"
                  value={watch("insuranceCompany") || ""}
                  onChange={(e) => setValue("insuranceCompany", e.target.value)}
                  onBlur={register("insuranceCompany").onBlur}
                  ref={register("insuranceCompany").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Insurance Number" icon={FileText}>
                <Input 
                  name="insuranceNumber"
                  placeholder="Insurance Number"
                  value={watch("insuranceNumber") || ""}
                  onChange={(e) => setValue("insuranceNumber", e.target.value)}
                  onBlur={register("insuranceNumber").onBlur}
                  ref={register("insuranceNumber").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Policy Number" icon={FileText}>
                <Input 
                  name="policyNumber"
                  placeholder="Policy Number"
                  value={watch("policyNumber") || ""}
                  onChange={(e) => setValue("policyNumber", e.target.value)}
                  onBlur={register("policyNumber").onBlur}
                  ref={register("policyNumber").ref}
                  className="focus:border-blue-500 transition-colors"
                />
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
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
              
              <InputField label="Height (cm)" icon={User} error={errors.height?.message}>
                <Input
                  name="height"
                  type="number"
                  min="50"
                  max="300"
                  placeholder="170"
                  value={watch("height") || ""}
                  onChange={(e) => setValue("height", parseInt(e.target.value))}
                  onBlur={register("height").onBlur}
                  ref={register("height").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Weight (kg)" icon={User} error={errors.weight?.message}>
                <Input
                  name="weight"
                  type="number"
                  min="20"
                  max="500"
                  placeholder="70"
                  value={watch("weight") || ""}
                  onChange={(e) => setValue("weight", parseInt(e.target.value))}
                  onBlur={register("weight").onBlur}
                  ref={register("weight").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Medical History" icon={FileText}>
                <Textarea
                  name="medicalHistory"
                  placeholder="Medical conditions, surgeries, etc."
                  rows={3}
                  value={watch("medicalHistory") || ""}
                  onChange={(e) => setValue("medicalHistory", e.target.value)}
                  onBlur={register("medicalHistory").onBlur}
                  ref={register("medicalHistory").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Allergies" icon={Heart}>
                <Textarea
                  name="allergies"
                  placeholder="Food allergies, drug allergies, etc."
                  rows={3}
                  value={watch("allergies") || ""}
                  onChange={(e) => setValue("allergies", e.target.value)}
                  onBlur={register("allergies").onBlur}
                  ref={register("allergies").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Emergency Contact Name" icon={User}>
                <Input 
                  name="emergencyContactName"
                  placeholder="Emergency contact name"
                  value={watch("emergencyContactName") || ""}
                  onChange={(e) => setValue("emergencyContactName", e.target.value)}
                  onBlur={register("emergencyContactName").onBlur}
                  ref={register("emergencyContactName").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Emergency Contact Relation" icon={Users}>
                <Input 
                  name="emergencyContactRelation"
                  placeholder="Father, Mother, Spouse, etc."
                  value={watch("emergencyContactRelation") || ""}
                  onChange={(e) => setValue("emergencyContactRelation", e.target.value)}
                  onBlur={register("emergencyContactRelation").onBlur}
                  ref={register("emergencyContactRelation").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Emergency Contact Phone" icon={Phone}>
                <Input 
                  name="emergencyContactPhone"
                  placeholder="+62 812 3456 7890"
                  value={watch("emergencyContactPhone") || ""}
                  onChange={(e) => setValue("emergencyContactPhone", e.target.value)}
                  onBlur={register("emergencyContactPhone").onBlur}
                  ref={register("emergencyContactPhone").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Social Section */}
        {activeSection === "social" && (
          <FormSection title="Social Media" icon={Globe} isActive>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Instagram" icon={Globe}>
                <Input 
                  name="instagram"
                  placeholder="@username"
                  value={watch("instagram") || ""}
                  onChange={(e) => setValue("instagram", e.target.value)}
                  onBlur={register("instagram").onBlur}
                  ref={register("instagram").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Facebook" icon={Globe}>
                <Input 
                  name="facebook"
                  placeholder="facebook.com/username"
                  value={watch("facebook") || ""}
                  onChange={(e) => setValue("facebook", e.target.value)}
                  onBlur={register("facebook").onBlur}
                  ref={register("facebook").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="Twitter" icon={Globe}>
                <Input 
                  name="twitter"
                  placeholder="@username"
                  value={watch("twitter") || ""}
                  onChange={(e) => setValue("twitter", e.target.value)}
                  onBlur={register("twitter").onBlur}
                  ref={register("twitter").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="LinkedIn" icon={Globe}>
                <Input 
                  name="linkedin"
                  placeholder="linkedin.com/in/username"
                  value={watch("linkedin") || ""}
                  onChange={(e) => setValue("linkedin", e.target.value)}
                  onBlur={register("linkedin").onBlur}
                  ref={register("linkedin").ref}
                  className="focus:border-blue-500 transition-colors"
                />
              </InputField>
              
              <InputField label="TikTok" icon={Globe}>
                <Input 
                  name="tiktok"
                  placeholder="@username"
                  value={watch("tiktok") || ""}
                  onChange={(e) => setValue("tiktok", e.target.value)}
                  onBlur={register("tiktok").onBlur}
                  ref={register("tiktok").ref}
                  className="focus:border-blue-500 transition-colors"
                />
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
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 text-sm"
                    >
                      <span>{skill}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSkill(index)}
                        className="h-4 w-4 p-0 ml-1 hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
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
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 text-sm"
                    >
                      <span>{interest}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeInterest(index)}
                        className="h-4 w-4 p-0 ml-1 hover:bg-green-200 dark:hover:bg-green-800"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
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
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 text-sm"
                    >
                      <span>{language}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLanguage(index)}
                        className="h-4 w-4 p-0 ml-1 hover:bg-purple-200 dark:hover:bg-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>
        )}

        {/* Navigation and Submit Section */}
        <Card className="shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
          <CardHeader>
            <CardTitle className="text-center">Form Navigation</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Meter */}
            <div className="w-full">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${((currentIndex + 1) / sections.length) * 100}%` }}
                >
                  <span className="text-xs text-white font-semibold">
                    {Math.round(((currentIndex + 1) / sections.length) * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-center mt-2 text-gray-600 dark:text-gray-300">
                Section {currentIndex + 1} of {sections.length} Completed
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
                  className="flex items-center gap-2"
                >
                  <span>←</span> Previous
                </Button>
              )}
              {!isLastSection && (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  Next <span>→</span>
                </Button>
              )}
              {isLastSection && (
                <Button
                  type="submit"
                  size="lg"
                  className="inline-flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
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
          </CardContent>
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
    </AdminOnly>
  );
};

export default withAuth(EmployeeManagementCreateForm);
