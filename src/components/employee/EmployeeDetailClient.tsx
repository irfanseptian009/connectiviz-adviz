"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchUserById } from "@/store/userSlice";
import { withAuth, useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormalEducation, NonFormalEducation } from "@/types/employee";
import ProfilePhotoUpload from "@/components/user-profile/ProfilePhotoUpload";
import UserAvatar from "@/components/common/UserAvatar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  User as UserIcon,
  Building2,
  GraduationCap,
  Heart,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  DollarSign,
  Globe,
  FileText,
  Download,
  Edit,
  Share,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Activity,
  TrendingUp,
  Award,
  Target,
  Zap,
  BookOpen,
  Camera
} from "lucide-react";

import {
  calculateWorkDuration,
  exportEmployeeToCSV,
  exportEmployeeToJSON,
  exportEmployeeToPDF,
  shareEmployee
} from "@/utils/employeeUtils";
import EditEmployeeModal from "@/components/employee/editEmployeeModal";
import { editUser, fetchUsers } from "@/store/userSlice";
import { employeeUpdateSchema } from "@/schemas/employeeUpdateSchema";
import { normalizeEmployee } from "@/utils/normalizationEmployee";
import { toast } from "react-hot-toast";


// Tambahkan tipe props
import { User } from "@/types/employee";

interface EmployeeDetailClientProps {
  user?: User;
}

function DetailKaryawanPage(props: EmployeeDetailClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("overview");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [selectedTab, setSelectedTab] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) => state.user.list);
  const status = useSelector((state: RootState) => state.user.status);
  const { user: currentUser, isAdmin, isSuperAdmin, isEmployee } = useAuth();

  const user = props.user || (id ? userList.find((u) => u.id === Number(id)) : undefined);  // Handler functions
  const handleEdit = () => {
    if (!user) return;
    setEditData({ ...user });
    setFormError({});
    setSelectedTab(0);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      const normalized = normalizeEmployee(editData);           
      console.log('Normalized data being sent:', normalized);
      const validated = employeeUpdateSchema.parse(normalized);
      console.log('Validated data:', validated);
      const { id, ...updateFields } = validated;
      
      const payload = Object.fromEntries(
        Object.entries(updateFields).map(([key, value]) => [key, value === null ? undefined : value])
      );
      console.log('Final payload:', payload);

      await dispatch(editUser({ id: validated.id, payload })).unwrap();
      await dispatch(fetchUsers());       

      toast.success("Data karyawan berhasil diperbarui");
      setEditOpen(false);
      
      if (id) {
        dispatch(fetchUserById(Number(id)));
      }
    } catch (err: unknown) {
      console.error('Error in handleSave:', err);
      if (err && typeof err === 'object' && 'errors' in err) {
        const obj: Record<string,string> = {};
        const zodErr = err as { errors: Array<{ path: string[], message: string }> };
        zodErr.errors.forEach(e => obj[e.path[0]] = e.message);
        setFormError(obj);                  
      } else {
        const apiErr = err as { response?: { data?: string } };
        toast.error(apiErr?.response?.data ?? "Gagal menyimpan");
      }
    }
  };
  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    if (!user) return;
    
    if (format === 'csv') {
      exportEmployeeToCSV(user);
    } else if (format === 'json') {
      exportEmployeeToJSON(user);
    } else if (format === 'pdf') {
      exportEmployeeToPDF(user);
    }
    setShowExportModal(false);
  };

  const handleShare = async () => {
    if (!user) return;
    await shareEmployee(user);
  };

  useEffect(() => {
    if (id && !props.user) {
      dispatch(fetchUserById(Number(id)));
    }
  }, [dispatch, id, props.user]);

  useEffect(() => {
    if (user) {
      console.log('User data:', user);
      console.log('Formal educations:', user.formalEducations);
      console.log('Non-formal educations:', user.nonFormalEducations);
    }
  }, [user]);

  // Role-based access control
  const canAccessEmployeeDetail = (targetUserId?: number) => {
    // Admins and Super Admins can access any employee detail
    if (isAdmin() || isSuperAdmin()) return true;
    
    // Employees can only access their own detail
    if (isEmployee() && currentUser && targetUserId) {
      return currentUser.id === targetUserId;
    }
    
    return false;
  };

  // Check access permission
  const hasAccess = canAccessEmployeeDetail(user?.id);

  if (!hasAccess) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don&apos;t have permission to view this employee&apos;s details.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatFieldName = (key: string) => {
    const fieldMappings: Record<string, string> = {
      fullName: "Nama Lengkap",
      username: "Username",
      email: "Email",
      officeEmail: "Email Kantor",
      phoneNumber: "No. HP",
      nationalId: "NIK",
      address: "Alamat",
      placeOfBirth: "Tempat Lahir",
      dateOfBirth: "Tanggal Lahir",
      gender: "Jenis Kelamin",
      role: "Role",
      employmentType: "Tipe Kerja",
      startDate: "Tanggal Mulai Kerja",
      probationEndDate: "Tanggal Selesai Probation",
      contractEndDate: "Tanggal Selesai Kontrak",
      resignDate: "Tanggal Resign",
      isActive: "Status Aktif",
      isOnProbation: "Status Probation",
      isResigned: "Status Resign",
      profilePictureUrl: "Foto Profil",
      position: "Posisi",
      jobTitle: "Jabatan",
      jobLevel: "Level Jabatan",
      divisionId: "Divisi",
      motherName: "Nama Ibu",
      fatherName: "Nama Ayah",
      maritalStatus: "Status Pernikahan",
      spouseName: "Nama Pasangan",
      childrenNames: "Nama Anak-anak",
      interests: "Minat",
      skills: "Keahlian",
      languages: "Bahasa",
      formalEducations: "Pendidikan Formal",
      nonFormalEducations: "Pendidikan Non-Formal",
      identityCard: "KTP",
      taxNumber: "NPWP",
      drivingLicense: "SIM",
      bpjsHealth: "BPJS Kesehatan",
      bpjsEmployment: "BPJS Ketenagakerjaan",
      insuranceCompany: "Perusahaan Asuransi",
      insuranceNumber: "No Asuransi",
      policyNumber: "No Polis",
      ptkpStatus: "Status PTKP",
      bloodType: "Golongan Darah",
      medicalHistory: "Riwayat Penyakit",
      allergies: "Alergi",
      height: "Tinggi (cm)",
      weight: "Berat (kg)",
      emergencyContactName: "Nama Kontak Darurat",
      emergencyContactRelation: "Hubungan",
      emergencyContactPhone: "No HP Kontak Darurat",
      bankName: "Bank",
      bankAccountNumber: "No Rekening",
      bankAccountName: "Nama di Rekening",
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
    };
    return fieldMappings[key] || key;
  };  const formatFieldValue = (key: string, value: string | number | string[] | FormalEducation[] | NonFormalEducation[] | boolean | { id: number; name: string } | null | undefined): string => {
    if (!value && value !== false && value !== 0) return "-";
    
    // Handle dates
    if (key === "dateOfBirth" || key === "startDate" || key === "probationEndDate" || key === "contractEndDate" || key === "resignDate") {
      return new Date(value as string).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    // Handle boolean values
    if (typeof value === "boolean") {
      return value ? "Ya" : "Tidak";
    }

    // Handle division object
    if (key === "division" && typeof value === "object" && value !== null) {
      return (value as { id: number; name: string }).name;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (key === "formalEducations") {
        return (value as FormalEducation[])
          .map(edu => `${edu.level} ${edu.major || ''} - ${edu.schoolName} ${edu.yearGraduate ? `(${edu.yearGraduate})` : ''}`)
          .join(", ");
      }
      if (key === "nonFormalEducations") {
        return (value as NonFormalEducation[])
          .map(edu => `${edu.name} - ${edu.institution} ${edu.year ? `(${edu.year})` : ''}`)
          .join(", ");
      }
      // Handle string arrays (interests, skills, languages, childrenNames)
      return (value as string[]).join(", ");
    }
    
    // Handle employment type
    if (key === "employmentType") {
      const employmentTypeMap: Record<string, string> = {
        INTERNSHIP: "Magang",
        PROBATION: "Probation",
        CONTRACT: "Kontrak",
        PERMANENT: "Tetap"
      };
      return employmentTypeMap[value as string] || String(value);
    }

    // Handle role
    if (key === "role") {
      const roleMap: Record<string, string> = {
        SUPER_ADMIN: "Super Admin",
        ADMIN: "Admin",
        EMPLOYEE: "Karyawan"
      };
      return roleMap[value as string] || String(value);
    }    
    return String(value);
  };  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <LoadingSpinner variant="skeleton" text="Loading employee data..." rows={6} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-24 w-24 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Data tidak ditemukan</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Karyawan yang Anda cari tidak ditemukan.</p>
        <Button onClick={() => router.back()} variant="outline">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header with Avatar and Quick Actions */}
        <Card className="mb-8 overflow-hidden border-none shadow-xl bg-gradient-to-r dark:from-slate-700 dark:to-purple-900 to-blue-700 from-blue-400  text-white">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">              {/* Avatar Section */}
              <div className="relative">                <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30">
                  <UserAvatar 
                    src={user.profilePictureUrl}
                    name={user.fullName}
                    size={128}
                    fallbackBg="bg-white/30"
                    textColor="text-white"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="bg-green-500  text-white border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {user.isActive ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{user.fullName || "Nama Karyawan"}</h1>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {user.position || "Posisi"}
                      </Badge>                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Building2 className="h-3 w-3 mr-1" />
                        {user.division?.name || `Divisi ID: ${user.divisionId}` || "Divisi"}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Star className="h-3 w-3 mr-1" />
                        {user.jobLevel || "Level"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-white/80">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    </div>
                  </div>                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={handleEdit}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={handleShare}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={() => setShowExportModal(true)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lama Bekerja</p>
                  <p className="text-2xl font-bold">{calculateWorkDuration(user.startDate || null)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Goals Met</p>
                  <p className="text-2xl font-bold">90%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${props.user ? 'grid-cols-7' : 'grid-cols-6'} lg:w-auto lg:grid-cols-none lg:flex`}>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="work" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Work
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            {/* Tampilkan tab Edit hanya untuk profil sendiri */}
            {props.user && (
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Info */}
              <Card className="lg:col-span-2 border-none shadow-lg">                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Informasi Utama
                  </CardTitle>
                </CardHeader>                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={<UserIcon className="h-4 w-4" />} label="Nama Lengkap" value={user.fullName} />
                    <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                    <InfoItem icon={<Phone className="h-4 w-4" />} label="Telepon" value={user.phoneNumber} />
                    <InfoItem icon={<MapPin className="h-4 w-4" />} label="Alamat" value={user.address} />
                    <InfoItem icon={<Calendar className="h-4 w-4" />} label="Tanggal Lahir" value={formatFieldValue("dateOfBirth", user.dateOfBirth)} />
                    <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Posisi" value={user.position} />
                    <InfoItem icon={<Building2 className="h-4 w-4" />} label="Tipe Kerja" value={formatFieldValue("employmentType", user.employmentType)} />
                    <InfoItem icon={<Calendar className="h-4 w-4" />} label="Mulai Kerja" value={formatFieldValue("startDate", user.startDate)} />
                  </div>
                </CardContent>
              </Card>              {/* Skills & Interests */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Keahlian & Minat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Skills */}
                    <div>
                      <p className="text-sm font-medium mb-2">Keahlian Teknis</p>
                      {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada data keahlian</p>
                      )}
                    </div>
                    <Separator />
                    {/* Interests */}
                    <div>
                      <p className="text-sm font-medium mb-2">Minat</p>
                      {user.interests && user.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, index) => (
                            <Badge key={index} variant="outline">
                              <Heart className="h-3 w-3 mr-1" />
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada data minat</p>
                      )}
                    </div>
                    <Separator />
                    {/* Languages */}
                    <div>
                      <p className="text-sm font-medium mb-2">Bahasa</p>
                      {user.languages && user.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              <Globe className="h-3 w-3 mr-1" />
                              {language}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada data bahasa</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Aktivitas Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem 
                    icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                    title="Menyelesaikan Project Q4"
                    time="2 jam yang lalu"
                    description="Successfully completed the quarterly project ahead of deadline"
                  />
                  <ActivityItem 
                    icon={<Award className="h-4 w-4 text-purple-500" />}
                    title="Mendapat Employee of the Month"
                    time="1 minggu yang lalu"
                    description="Recognized for outstanding performance and teamwork"
                  />
                  <ActivityItem 
                    icon={<GraduationCap className="h-4 w-4 text-blue-500" />}
                    title="Menyelesaikan Training"
                    time="2 minggu yang lalu"
                    description="Completed advanced React.js certification course"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">              <DetailSection 
                title="Data Pribadi" 
                icon={<UserIcon className="h-5 w-5" />}
                fields={["fullName", "username", "nationalId", "placeOfBirth", "dateOfBirth", "gender", "address"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />
              
              <DetailSection 
                title="Keluarga" 
                icon={<Users className="h-5 w-5" />}
                fields={["motherName", "fatherName", "maritalStatus", "spouseName", "childrenNames"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              <DetailSection 
                title="Kesehatan" 
                icon={<Heart className="h-5 w-5" />}
                fields={["bloodType", "height", "weight", "medicalHistory", "allergies"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              <DetailSection 
                title="Kontak Darurat" 
                icon={<Phone className="h-5 w-5" />}
                fields={["emergencyContactName", "emergencyContactRelation", "emergencyContactPhone"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />
            </div>
          </TabsContent>          {/* Work Tab */}
          <TabsContent value="work" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetailSection 
                title="Informasi Pekerjaan" 
                icon={<Briefcase className="h-5 w-5" />}
                fields={["position", "jobTitle", "jobLevel", "employmentType", "startDate", "probationEndDate", "contractEndDate", "resignDate"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              <DetailSection 
                title="Status Karyawan" 
                icon={<Shield className="h-5 w-5" />}
                fields={["isActive", "isOnProbation", "isResigned", "role"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              <DetailSection 
                title="Kontak Kantor" 
                icon={<Mail className="h-5 w-5" />}
                fields={["officeEmail", "divisionId"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              <DetailSection 
                title="Keuangan" 
                icon={<DollarSign className="h-5 w-5" />}
                fields={["bankName", "bankAccountNumber", "bankAccountName"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              {/* Skills & Interests Section */}
              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Keahlian & Minat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Skills */}
                    <div>
                      <p className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Keahlian</p>
                      {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada data keahlian</p>
                      )}
                    </div>

                    {/* Interests */}
                    <div>
                      <p className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Minat</p>
                      {user.interests && user.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, index) => (
                            <Badge key={index} variant="outline">{interest}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada data minat</p>
                      )}
                    </div>

                    {/* Languages */}
                    <div>
                      <p className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Bahasa</p>
                      {user.languages && user.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.languages.map((language, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                              <Globe className="h-3 w-3 mr-1" />
                              {language}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belum ada data bahasa</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">            {/* Formal Education Array */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Pendidikan Formal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  console.log('Checking formalEducations:', user.formalEducations);
                  console.log('Type of formalEducations:', typeof user.formalEducations);
                  console.log('Is array:', Array.isArray(user.formalEducations));
                  
                  if (user.formalEducations && Array.isArray(user.formalEducations) && user.formalEducations.length > 0) {
                    return (
                      <div className="space-y-4">
                        {user.formalEducations.map((edu, index) => (
                          <div key={edu.id || index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{edu.level || 'Tingkat Pendidikan'}</h4>
                              {edu.yearGraduate && (
                                <span className="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  Lulus: {edu.yearGraduate}
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                              {edu.schoolName || 'Nama Sekolah/Universitas'}
                            </p>
                            {edu.major && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                                Jurusan: {edu.major}
                              </p>
                            )}
                            {edu.gpa && (
                              <p className="text-sm text-gray-500 mt-2">
                                GPA: <span className="font-semibold">{edu.gpa}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada data pendidikan formal</p>
                        <p className="text-sm text-gray-400 mt-1">Data pendidikan formal akan ditampilkan di sini</p>
                        {user.formalEducations && (
                          <p className="text-xs text-red-400 mt-2">
                            Debug: {JSON.stringify(user.formalEducations)}
                          </p>
                        )}
                      </div>
                    );
                  }
                })()}
              </CardContent>
            </Card>            {/* Non-Formal Education */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Pendidikan Non-Formal & Sertifikasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  console.log('Checking nonFormalEducations:', user.nonFormalEducations);
                  console.log('Type of nonFormalEducations:', typeof user.nonFormalEducations);
                  console.log('Is array:', Array.isArray(user.nonFormalEducations));
                  
                  if (user.nonFormalEducations && Array.isArray(user.nonFormalEducations) && user.nonFormalEducations.length > 0) {
                    return (
                      <div className="space-y-4">
                        {user.nonFormalEducations.map((edu, index) => (
                          <div key={edu.id || index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{edu.name || 'Nama Pelatihan/Sertifikasi'}</h4>
                              {edu.year && (
                                <span className="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  Tahun: {edu.year}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              {edu.institution || 'Institusi Penyelenggara'}
                            </p>
                            {edu.description && (
                              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                                <p className="text-sm">{edu.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada data pendidikan non-formal</p>
                        <p className="text-sm text-gray-400 mt-1">Sertifikasi dan pelatihan akan ditampilkan di sini</p>
                        {user.nonFormalEducations && (
                          <p className="text-xs text-red-400 mt-2">
                            Debug: {JSON.stringify(user.nonFormalEducations)}
                          </p>
                        )}
                      </div>
                    );
                  }
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetailSection 
                title="Dokumen Identitas" 
                icon={<FileText className="h-5 w-5" />}
                fields={["identityCard", "taxNumber", "drivingLicense"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              <DetailSection 
                title="Asuransi & BPJS" 
                icon={<Shield className="h-5 w-5" />}
                fields={["bpjsHealth", "bpjsEmployment", "insuranceCompany", "insuranceNumber", "policyNumber", "ptkpStatus"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />

              <DetailSection 
                title="Media Sosial" 
                icon={<Globe className="h-5 w-5" />}
                fields={["instagram", "facebook", "twitter", "linkedin", "tiktok"]}
                user={user}
                formatFieldName={formatFieldName}
                formatFieldValue={formatFieldValue}
              />
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Timeline Aktivitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <TimelineItem 
                    date="Hari ini"
                    time="09:00"
                    title="Check-in Office"
                    description="Masuk kantor tepat waktu"
                    icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                  />
                  <TimelineItem 
                    date="Kemarin"
                    time="17:30"
                    title="Project Submission"
                    description="Mengirimkan deliverable project Q4"
                    icon={<FileText className="h-4 w-4 text-blue-500" />}
                  />
                  <TimelineItem 
                    date="2 hari lalu"
                    time="14:00"
                    title="Team Meeting"
                    description="Menghadiri meeting mingguan tim"
                    icon={<Users className="h-4 w-4 text-purple-500" />}
                  />
                  <TimelineItem 
                    date="3 hari lalu"
                    time="10:00"
                    title="Training Session"
                    description="Mengikuti training React Advanced"
                    icon={<GraduationCap className="h-4 w-4 text-orange-500" />}
                  />
                </div>
              </CardContent>
            </Card>          </TabsContent>

          {/* Edit Profile Tab - Hanya untuk profil sendiri */}
          {props.user && (
            <TabsContent value="edit" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photo Upload Section */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Foto Profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfilePhotoUpload
                      currentPhotoUrl={user.profilePictureUrl}
                      onPhotoUpdated={(photoUrl) => {
                        // Callback when photo is updated - this will be handled by the component itself
                        console.log('Photo updated:', photoUrl);
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Quick Profile Info */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Informasi Cepat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                        <UserAvatar 
                          src={user.profilePictureUrl}
                          name={user.fullName}
                          size={80}
                          fallbackBg="bg-gray-100"
                          textColor="text-gray-500"
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{user.fullName}</h3>
                      <p className="text-gray-600">{user.position}</p>
                      <p className="text-sm text-gray-500">{user.division?.name}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium">{user.phoneNumber || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Edit Options */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Pengaturan Profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Informasi Personal
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Ubah Password
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Social Media
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Upload Dokumen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Export Employee Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Choose the format to export {user.fullName || user.username}&apos;s data:
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleExport('csv')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Export as CSV
                  <span className="text-xs text-gray-500 ml-auto">Spreadsheet format</span>
                </Button>
                
                <Button
                  onClick={() => handleExport('json')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Export as JSON
                  <span className="text-xs text-gray-500 ml-auto">Developer format</span>
                </Button>
                
                <Button
                  onClick={() => handleExport('pdf')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Export as PDF
                  <span className="text-xs text-gray-500 ml-auto">Document format</span>
                </Button>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowExportModal(false)}
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>          </div>
        )}

        {/* Edit Employee Modal */}
        <EditEmployeeModal
          isOpen={isEditOpen}
          onClose={() => setEditOpen(false)}
          editData={editData}
          setEditData={setEditData}
          formError={formError}
          setFormError={setFormError}
          handleSave={handleSave}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>
    </div>
  );
}

// Helper Components
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | undefined | null }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="text-gray-500 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white truncate">{value || "-"}</p>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, time, description }: { icon: React.ReactNode; title: string; time: string; description: string }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="mt-0.5">{icon}</div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

const TimelineItem = ({ date, time, title, description, icon }: { date: string; time: string; title: string; description: string; icon: React.ReactNode }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full">
        {icon}
      </div>
      <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 mt-2"></div>
    </div>
    <div className="flex-1 pb-6">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      <span className="text-xs text-gray-400">{date}</span>
    </div>
  </div>
);

interface UserData {
  id?: number;
  fullName?: string;
  username?: string;
  email?: string;
  officeEmail?: string;
  phoneNumber?: string;
  position?: string;
  jobTitle?: string;
  divisionId?: string | number;
  division?: { id: number; name: string };
  jobLevel?: string | number;
  nationalId?: string;
  address?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  gender?: string;
  role?: string;
  employmentType?: string;
  startDate?: string;
  probationEndDate?: string;
  contractEndDate?: string;
  resignDate?: string;
  isActive?: boolean;
  isOnProbation?: boolean;
  isResigned?: boolean;
  profilePictureUrl?: string;
  motherName?: string;
  fatherName?: string;
  maritalStatus?: string;
  spouseName?: string;
  childrenNames?: string[];
  interests?: string[];
  skills?: string[];
  languages?: string[];
  identityCard?: string;
  taxNumber?: string;
  drivingLicense?: string;
  bpjsHealth?: string;
  bpjsEmployment?: string;
  insuranceCompany?: string;
  insuranceNumber?: string;
  policyNumber?: string;
  ptkpStatus?: string;
  bloodType?: string;
  medicalHistory?: string;
  allergies?: string;
  height?: number;
  weight?: number;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  formalEducations?: FormalEducation[];
  nonFormalEducations?: NonFormalEducation[];
}

const DetailSection = ({ title, icon, fields, user, formatFieldName, formatFieldValue }: {
  title: string;
  icon: React.ReactNode;
  fields: string[];
  user: UserData;
  formatFieldName: (key: string) => string;
  formatFieldValue: (key: string, value: string | number | string[] | FormalEducation[] | NonFormalEducation[] | boolean | { id: number; name: string } | null | undefined) => string;
}) => {
  const visibleFields = fields.filter((key) => {
    const value = user[key as keyof typeof user];
    return value !== undefined && value !== null && value !== "";
  });
  
  if (visibleFields.length === 0) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleFields.map((key) => (
            <div key={key} className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex-1">
                {formatFieldName(key)}
              </span>
              <span className="text-sm text-gray-900 dark:text-white text-right flex-1">
                {formatFieldValue(key, user[key as keyof typeof user])}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default withAuth(DetailKaryawanPage);
