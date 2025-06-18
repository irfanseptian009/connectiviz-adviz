"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchUserById } from "@/store/userSlice";
import { withAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
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
  Coffee,
  BookOpen,
  Laptop
} from "lucide-react";

interface NonFormalEducation {
  name: string;
  institution: string;
  year?: number;
  description?: string;
}

function DetailKaryawanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");  const [activeTab, setActiveTab] = useState("overview");

  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) => state.user.list);
  const status = useSelector((state: RootState) => state.user.status);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(Number(id)));
    }
  }, [dispatch, id]);

  const user = userList.find((u) => u.id === Number(id));

  const formatFieldName = (key: string) => {
    const fieldMappings: Record<string, string> = {
      fullName: "Nama Lengkap",
      email: "Email",
      phoneNumber: "No. HP",
      nationalId: "NIK",
      address: "Alamat",
      placeOfBirth: "Tempat Lahir",
      dateOfBirth: "Tanggal Lahir",
      gender: "Jenis Kelamin",
      position: "Posisi",
      jobLevel: "Level Jabatan",
      divisionId: "Divisi",
      motherName: "Nama Ibu",
      fatherName: "Nama Ayah",
      maritalStatus: "Status Pernikahan",
      spouseName: "Nama Pasangan",
      lastEducation: "Pendidikan Terakhir",
      facultyName: "Fakultas",
      majorName: "Jurusan",
      graduationYear: "Tahun Lulus",
      gpa: "IPK",
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
  };
  const formatFieldValue = (key: string, value: string | number | string[] | NonFormalEducation[] | null | undefined): string => {
    if (!value) return "-";
    if (key === "dateOfBirth") {
      return new Date(value as string).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (Array.isArray(value)) {
      if (key === "nonFormalEducations") {
        return (value as NonFormalEducation[])
          .map(edu => `${edu.name} - ${edu.institution}`)
          .join(", ");
      }
      return value.join(", ");
    }
    return String(value);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                  {getInitials(user.fullName || 'User')}
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="bg-green-500 text-white border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aktif
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
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Building2 className="h-3 w-3 mr-1" />
                        {user.divisionId || "Divisi"}
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
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
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
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lama Bekerja</p>
                  <p className="text-2xl font-bold">2.5 Tahun</p>
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
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
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
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Info */}
              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Utama
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={<User className="h-4 w-4" />} label="Nama Lengkap" value={user.fullName} />
                    <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                    <InfoItem icon={<Phone className="h-4 w-4" />} label="Telepon" value={user.phoneNumber} />
                    <InfoItem icon={<MapPin className="h-4 w-4" />} label="Alamat" value={user.address} />
                    <InfoItem icon={<Calendar className="h-4 w-4" />} label="Tanggal Lahir" value={formatFieldValue("dateOfBirth", user.dateOfBirth)} />
                    <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Posisi" value={user.position} />
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Interests */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Skills & Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Technical Skills</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="secondary">Node.js</Badge>
                        <Badge variant="secondary">Python</Badge>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          <Coffee className="h-3 w-3 mr-1" />
                          Coffee
                        </Badge>
                        <Badge variant="outline">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Reading
                        </Badge>
                        <Badge variant="outline">
                          <Laptop className="h-3 w-3 mr-1" />
                          Technology
                        </Badge>
                      </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetailSection 
                title="Data Pribadi" 
                icon={<User className="h-5 w-5" />}
                fields={["fullName", "nationalId", "placeOfBirth", "dateOfBirth", "gender", "address"]}
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
          </TabsContent>

          {/* Work Tab */}
          <TabsContent value="work" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DetailSection 
                title="Informasi Pekerjaan" 
                icon={<Briefcase className="h-5 w-5" />}
                fields={["position", "jobLevel", "officeEmail", "divisionId"]}
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
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <DetailSection 
              title="Pendidikan Formal" 
              icon={<GraduationCap className="h-5 w-5" />}
              fields={["lastEducation", "facultyName", "majorName", "graduationYear", "gpa"]}
              user={user}
              formatFieldName={formatFieldName}
              formatFieldValue={formatFieldValue}
            />

            {/* Non-Formal Education */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Pendidikan Non-Formal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.nonFormalEducations && user.nonFormalEducations.length > 0 ? (
                  <div className="space-y-4">
                    {(user.nonFormalEducations as NonFormalEducation[]).map((edu, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold">{edu.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                        {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                        {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Belum ada data pendidikan non-formal</p>
                )}
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
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button onClick={() => router.back()} variant="outline" size="lg">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Karyawan
          </Button>
        </div>
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
  email?: string;
  phoneNumber?: string;
  position?: string;
  divisionId?: string | number;
  jobLevel?: string;
  nationalId?: string;
  address?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  gender?: string;
  motherName?: string;
  fatherName?: string;
  maritalStatus?: string;
  spouseName?: string;
  childrenNames?: string[];
  lastEducation?: string;
  facultyName?: string;
  majorName?: string;
  graduationYear?: number;
  gpa?: string;
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
  nonFormalEducations?: NonFormalEducation[];
  officeEmail?: string;
}

const DetailSection = ({ title, icon, fields, user, formatFieldName, formatFieldValue }: {
  title: string;
  icon: React.ReactNode;
  fields: string[];
  user: UserData;
  formatFieldName: (key: string) => string;
  formatFieldValue: (key: string, value: string | number | string[] | NonFormalEducation[] | null | undefined) => string;
}) => {
  const visibleFields = fields.filter((key) => user[key as keyof typeof user] !== undefined);
  
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
