import { z } from 'zod';

// Schema for FormalEducation
export const formalEducationSchema = z.object({
  id: z.number().optional(),
  level: z.string().min(1, "Level pendidikan wajib diisi"),
  schoolName: z.string().min(1, "Nama sekolah wajib diisi"),
  major: z.string().optional().nullable(),
  yearGraduate: z.number().min(1950).max(new Date().getFullYear()).optional().nullable(),
  gpa: z.number().min(0).max(4).optional().nullable(),
});

// Schema for NonFormalEducation  
export const nonFormalEducationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama kursus/pelatihan wajib diisi"),
  institution: z.string().min(1, "Nama institusi wajib diisi"),
  year: z.number().min(1950).max(new Date().getFullYear()).optional().nullable(),
  description: z.string().optional().nullable(),
});

export const employeeSchema = z.object({
  id: z.number().optional(),

  // Core Account Info
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE']),
  email: z.string().email("Email tidak valid"),
  password: z.string().optional().nullable(),
  username: z.string().min(1, "Username wajib diisi").max(50),

  // Personal Data
  nationalId: z.string().optional().nullable(),
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  address: z.string().optional().nullable(),
  placeOfBirth: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  officeEmail: z.string().email().optional().nullable(),

  // Jabatan & Level Jabatan
  position: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  jobLevel: z.number().optional().nullable(),
  employmentType: z.enum(['INTERNSHIP', 'PROBATION', 'CONTRACT', 'PERMANENT']).optional().nullable(),
  startDate: z.string().optional().nullable(),
  probationEndDate: z.string().optional().nullable(),
  contractEndDate: z.string().optional().nullable(),
  resignDate: z.string().optional().nullable(),

  isActive: z.boolean().optional(),
  isOnProbation: z.boolean().optional(),
  isResigned: z.boolean().optional(),

  // Organization Data
  divisionId: z.number().optional().nullable(),
  // Family Data
  motherName: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  spouseName: z.string().optional().nullable(),
  childrenNames: z.array(z.string()).optional().nullable(),

  // Education Arrays - New Structure
  formalEducations: z.array(formalEducationSchema).optional().nullable(),
  nonFormalEducations: z.array(nonFormalEducationSchema).optional().nullable(),

  // Interest & Skills
  interests: z.array(z.string()).optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  languages: z.array(z.string()).optional().nullable(),

  // Documents
  identityCard: z.string().optional().nullable(),
  taxNumber: z.string().optional().nullable(),
  drivingLicense: z.string().optional().nullable(),
  bpjsHealth: z.string().optional().nullable(),
  bpjsEmployment: z.string().optional().nullable(),
  insuranceCompany: z.string().optional().nullable(),
  insuranceNumber: z.string().optional().nullable(),
  policyNumber: z.string().optional().nullable(),
  ptkpStatus: z.enum(['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3']).optional().nullable(),

  // Emergency Contact
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactRelation: z.enum(['Ayah', 'Ibu', 'Suami', 'Istri', 'Anak', 'Kakak', 'Adik', 'Saudara', 'Teman']).optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),

  // Bank Account
  bankName: z.string().optional().nullable(),
  bankAccountNumber: z.string().optional().nullable(),
  bankAccountName: z.string().optional().nullable(),

  // Social Media
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  // Health Info
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'O', 'AB+', 'AB-']).optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  height: z.number().min(0).max(300).optional().nullable(),
  weight: z.number().min(0).max(500).optional().nullable(),
  profilePictureUrl: z.string().optional().nullable(),
}).strict();

export type EmployeeData = z.infer<typeof employeeSchema>;
