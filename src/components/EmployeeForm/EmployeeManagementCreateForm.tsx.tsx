
"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormType } from "@/validation/userSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, User, Shield, Heart, Building2, GraduationCap, FileText, DollarSign, Globe, Phone, MapPin, Calendar, Users, Briefcase, LucideIcon } from "lucide-react";
import NonFormalEducationArray, { NonFormalEducation } from "./NonFormalEducationArray";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchBusinessUnits } from "@/store/businessUnitSlice";
import { fetchDivisionTree } from "@/store/divisionSlice";
import { createUser } from "@/store/userSlice";
import { toast } from "react-hot-toast";
import { divisionTreeToOptions } from "@/utils/divisionTreeToOptions";
import BusinessUnitModal from "./BusinessUnitModal";
import DivisionModal from "./DivisionModal";
import UserSelectModal from "./UserSelectModal";

const EmployeeManagementCreateForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const businessUnits = useSelector((state: RootState) => state.businessUnit.list);
  const divisionTree = useSelector((state: RootState) => state.division.tree);

  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<number | null>(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);
  const [showBusinessUnitModal, setShowBusinessUnitModal] = useState(false);
  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("auth");
  

  // Non formal education array (state)
  const [nonFormalEducations, setNonFormalEducations] = useState<NonFormalEducation[]>([]);

  // --- Form hook & fieldArray for childrenNames
  const { register, handleSubmit, setValue, formState: { errors }, control, reset } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      childrenNames: [],
    }
  });
  const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
    control,
    name: "childrenNames",
  });

  // Fetch business unit & division tree
  useEffect(() => {
    dispatch(fetchBusinessUnits());
  }, [dispatch]);
  useEffect(() => {
    if (selectedBusinessUnit) {
      dispatch(fetchDivisionTree(selectedBusinessUnit));
    }
  }, [dispatch, selectedBusinessUnit]);
  const divisionOptions = divisionTreeToOptions(divisionTree);

  // Handler tambah non formal education
  const handleAddNonFormalEducation = (education: NonFormalEducation) => {
    setNonFormalEducations(prev => [...prev, education]);
  };

  // Modal BU/Division handler
  const handleBusinessUnitCreate = async () => {
    // ...implementasi create
    setShowBusinessUnitModal(false);
  };
  const handleDivisionCreate = async () => {
    // ...implementasi create
    setShowDivisionModal(false);
  };

  // Form submit
  const onSubmit = async (data: UserFormType) => {
    try {
      await dispatch(createUser({ ...data, nonFormalEducations }));
      toast.success("User created!");
      reset();
      setNonFormalEducations([]);
      setSelectedDivisionId(null);
    } catch {
      toast.error("Failed to create user!");
    }
  };


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
  ];

  const FormSection = ({ title, icon: Icon, children, isActive }: { title: string; icon: LucideIcon; children: React.ReactNode; isActive: boolean }) => (
    <Card className={`transition-all duration-300 ${isActive ? 'ring-4 ring-blue-500/10 shadow-lg' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Icon className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
  const InputField = ({ label, icon: Icon, children, error }: { label: string; icon?: LucideIcon; children: React.ReactNode; error?: string }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {label}
      </Label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management System</h1>
        <p className="text-gray-600 dark:text-white">Create comprehensive employee profiles and organizational structure</p>
      </div>

     {/* Navigation */}
<Card className="transition-all duration-300 shadow hover:shadow-xl bg-white/90 dark:bg-blue-600/20 rounded-lg p-4">
  <div
    className="
      flex gap-2
      overflow-x-auto
      whitespace-nowrap
      scrollbar-thin
      hide-scrollbar

    "
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    {sections.map((section) => {
      const Icon = section.icon;
      const isActive = activeSection === section.id;
      return (
        <Button
          key={section.id}
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSection(section.id)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 transition
            ${isActive ? 'bg-blue-600 text-white  shadow-md' : 'bg-white text-gray-800 dark:text-white hover:bg-blue-50'}
            border border-gray-200
            font-semibold
          `}
          style={{ minWidth: "max-content" }}
        >
          <Icon className="w-4 h-4 mr-1" />
          {section.title}
        </Button>
      );
    })}
  </div>
</Card>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Authentication Section */}
        {activeSection === "auth" && (
          <FormSection title="Authentication" icon={Shield} isActive={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Email Address" icon={Globe}>
                <Input {...register("email")} type="email" placeholder="user@company.com" />
              </InputField>
              <InputField label="Password" icon={Shield}>
                <Input {...register("password")} type="password" placeholder="••••••••" />
              </InputField>
              <InputField label="Username" icon={User}>
                <Input {...register("username")} placeholder="johndoe" />
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Personal Information Section */}
        {activeSection === "personal" && (
          <FormSection title="Personal Information" icon={User} isActive={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Full Name" icon={User}>
                <Input {...register("fullName")} placeholder="John Doe" />
              </InputField>
              <InputField label="National ID" icon={FileText}>
                <Input {...register("nationalId")} placeholder="1234567890123456" />
              </InputField>
              <InputField label="Phone Number" icon={Phone}>
                <Input {...register("phoneNumber")} placeholder="+62 812 3456 7890" />
              </InputField>
              <InputField label="Address" icon={MapPin}>
                <Input {...register("address")} placeholder="Jl. Sudirman No. 123" />
              </InputField>
              <InputField label="Place of Birth" icon={MapPin}>
                <Input {...register("placeOfBirth")} placeholder="Jakarta" />
              </InputField>
              <InputField label="Date of Birth" icon={Calendar}>
                <Input {...register("dateOfBirth")} type="date" />
              </InputField>
              <InputField label="Gender">
                <Select {...register("gender")}>
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

        {/* Family Information Section */}
        {activeSection === "family" && (
          <FormSection title="Family Information" icon={Users} isActive={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Mother's Name" icon={User}>
                <Input {...register("motherName")} placeholder="Jane Doe" />
              </InputField>
              <InputField label="Father's Name" icon={User}>
                <Input {...register("fatherName")} placeholder="John Doe Sr." />
              </InputField>
              <InputField label="Marital Status">
                <Input {...register("maritalStatus")} placeholder="Single/Married/Divorced" />
              </InputField>
              <InputField label="Spouse Name" icon={User}>
                <Input {...register("spouseName")} placeholder="Spouse name" />
              </InputField>
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 text-gray-500" />
                Children Names
              </Label>
              <div className="space-y-2">
                {childrenFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <Input {...register(`childrenNames.${idx}`)} placeholder={`Child ${idx + 1} name`} className="flex-1" />
                    <Button type="button" size="icon" variant="destructive" onClick={() => removeChild(idx)}>
                      ×
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => appendChild("")} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Child
                </Button>
              </div>
            </div>
          </FormSection>
        )}

        {/* Organization Section */}
        {activeSection === "organization" && (
          <FormSection title="Organization Structure" icon={Building2} isActive={true}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Office Email" icon={Globe}>
                  <Input {...register("officeEmail")} type="email" placeholder="john@company.com" />
                </InputField>
                <InputField label="Position" icon={Briefcase}>
                  <Input {...register("position")} placeholder="Software Engineer" />
                </InputField>
                <InputField label="Job Level">
  <Select {...register("jobLevel")}>
    <SelectTrigger>
      <SelectValue placeholder="Select Job Level" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Intern">Intern</SelectItem>
      <SelectItem value="Junior">Junior</SelectItem>
      <SelectItem value="Middle">Middle</SelectItem>
      <SelectItem value="Senior">Senior</SelectItem>
      <SelectItem value="Lead">Lead</SelectItem>
      <SelectItem value="Manager">Manager</SelectItem>
      <SelectItem value="Director">Director</SelectItem>
      <SelectItem value="VP">VP</SelectItem>
      <SelectItem value="C-Level">C-Level</SelectItem>
    </SelectContent>
  </Select>
</InputField>

              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Business Unit" icon={Building2}>
                  <div className="flex gap-2">
                    <Select
                        value={selectedBusinessUnit !== null ? String(selectedBusinessUnit) : undefined}
                      onValueChange={v => {
                        setSelectedBusinessUnit(Number(v));
                        setSelectedDivisionId(null);
                        setValue("divisionId", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Business Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessUnits.map(bu => (
                          <SelectItem key={bu.id} value={String(bu.id)}>{bu.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" size="icon" variant="outline" onClick={() => setShowBusinessUnitModal(true)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </InputField>
                
                <InputField label="Division" error={errors.divisionId?.message}>
                  <div className="flex gap-2">
                    <Select
                       {...register("divisionId")}
   value={selectedDivisionId !== null ? String(selectedDivisionId) : undefined}
                      onValueChange={v => {
                        setSelectedDivisionId(Number(v));
                        setValue("divisionId", v);
                      }}
                      disabled={!selectedBusinessUnit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisionOptions.length === 0 ? (
                          <div className="p-2 text-muted-foreground text-sm">No division available</div>
                        ) : (
                          divisionOptions.map(opt => (
                            <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button type="button" size="icon" variant="outline" onClick={() => setShowDivisionModal(true)}>
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
          <FormSection title="Documents & Identification" icon={FileText} isActive={true}>
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
                <Input {...register("ptkpStatus")} placeholder="TK/0, K/1, etc." />
              </InputField>
            </div>
          </FormSection>
        )}

        {/* Finance & Insurance Section */}
        {activeSection === "finance" && (
          <FormSection title="Finance & Insurance" icon={DollarSign} isActive={true}>
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

        {/* Health Information Section */}
        {activeSection === "health" && (
          <FormSection title="Health Information" icon={Heart} isActive={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InputField label="Blood Type" icon={Heart}>
                <Input {...register("bloodType")} placeholder="A+, B-, O+, etc." />
              </InputField>
              <InputField label="Height (cm)" icon={User}>
                <Input {...register("height", { valueAsNumber: true })} type="number" placeholder="170" />
              </InputField>
              <InputField label="Weight (kg)" icon={User}>
                <Input {...register("weight", { valueAsNumber: true })} type="number" placeholder="70" />
              </InputField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Medical History" icon={FileText}>
                <Input {...register("medicalHistory")} placeholder="Medical conditions, surgeries, etc." />
              </InputField>
              <InputField label="Allergies" icon={Heart}>
                <Input {...register("allergies")} placeholder="Food allergies, drug allergies, etc." />
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

        {/* Social Media Section */}
        {activeSection === "social" && (
          <FormSection title="Social Media" icon={Globe} isActive={true}>
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
          <FormSection title="Education" icon={GraduationCap} isActive={true}>
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                Non-Formal Education
              </Label>
              <NonFormalEducationArray
                educations={nonFormalEducations}
                onAdd={handleAddNonFormalEducation}
              />
            </div>
          </FormSection>
        )}

        {/* Submit Button */}
        <Card className="p-6">
          <Button type="submit" size="lg" className="w-full text-lg font-semibold">
            <User className="w-5 h-5 mr-2" />
            Create Employee Profile
          </Button>
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
      <UserSelectModal 
        open={showUserSelectModal} 
        onOpenChange={setShowUserSelectModal} 
        divisionId={selectedDivisionId} 
      />
    </div>
  );
};

export default EmployeeManagementCreateForm;