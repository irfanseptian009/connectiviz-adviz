import { z } from 'zod';

export const employeeSchema = z.object({
  id: z.number().optional(),

  // Core Account Info
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE']),
  email: z.string().email("Email tidak valid"),
  password: z.string().optional().nullable(),
  username: z.string().min(1, "Username wajib diisi").max(50),

  // Job Information
  position: z.string().optional().nullable(),
  jobLevel: z.enum(['Junior', 'Senior', 'Lead', 'Manager', 'Director']).optional().nullable(),

  // Personal Data
  fullName: z.string().min(1, "Full name wajib diisi"),
  nationalId: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  placeOfBirth: z.string().optional().nullable(),
  dateOfBirth: z.string().datetime().optional().nullable(),
  gender: z.enum(['Laki-laki', 'Perempuan', 'Other']).optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  officeEmail: z.string().email().optional().nullable(),

  // Organization Data
  divisionId: z.number().optional().nullable(),
  businessUnitId: z.number().optional().nullable(),

  // Family Data
  motherName: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  maritalStatus: z.enum(['Single', 'Menikah', 'Divorced', 'Widowed']).optional().nullable(),
  spouseName: z.string().optional().nullable(),
  childrenNames: z.array(z.string()).optional().nullable(),

  // Education - Formal
  lastEducation: z.enum(['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3']).optional().nullable(),
  facultyName: z.string().optional().nullable(),
  majorName: z.string().optional().nullable(),
  graduationYear: z.number().min(1950).max(new Date().getFullYear()).optional().nullable(),
  gpa: z.string().optional().nullable(),

  // Education - Non Formal
  nonFormalEducationNames: z.array(z.string()).optional().nullable(),
  nonFormalInstitutions: z.array(z.string()).optional().nullable(),
  nonFormalYears: z.array(z.number().min(1950).max(new Date().getFullYear())).optional().nullable(),
  nonFormalDescriptions: z.array(z.string()).optional().nullable(),

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
}).strict();

export type EmployeeData = z.infer<typeof employeeSchema>;
