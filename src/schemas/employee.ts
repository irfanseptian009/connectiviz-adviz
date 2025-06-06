import { z } from 'zod';

export const employeeSchema = z.object({
  // Core Data - Required fields
  id: z.number().optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE']),
  email: z.string().email("Email not valid"),
  password: z.string().optional(),
  username: z.string().min(1, "Username must be at least 1 character long").max(50, "Username cannot exceed 50 characters"),

  // jobs
  jobTitle: z.string().min(1, "Job title is required"),
  jobLevel: z.string().min(1, "Job level is required"),


  // Personal Data
  fullName: z.string().min(1, "Full name is required"),
  nationalId: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  placeOfBirth: z.string().optional().nullable(),
  dateOfBirth: z.string().datetime().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE']).optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  officeEmail: z.string().email("Email not valid").optional().nullable(),

  // Division/Business Unit
  divisionId: z.number().optional().nullable(),
  businessUnitId: z.number().optional().nullable(),

  // Family Data
  motherName: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional().nullable(),
  spouseName: z.string().optional().nullable(),
  childrenNames: z.array(z.string()).optional().nullable(),

  // Education
  lastEducation: z.enum(['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3']).optional().nullable(),
  schoolName: z.string().optional().nullable(),
  major: z.string().optional().nullable(),
  yearGraduate: z.number().min(1950,"Year graduate must be at least 1950").max(new Date().getFullYear()).optional().nullable(),

  // education non formal

   nonFormalEducationNames: z.array(z.string()).optional().nullable(),
  nonFormalInstitutions: z.array(z.string()).optional().nullable(),
  nonFormalYears: z.array(z.number()).optional().nullable(),
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
  emergencyContactRelation: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),

  // Bank
  bankName: z.string().optional().nullable(),
  bankAccountNumber: z.string().optional().nullable(),
  bankAccountName: z.string().optional().nullable(),

  // Social Media - all optional
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),

  // Health
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  height: z.number().min(0).max(300,"Height must be between 0 and 300").optional().nullable(),
  weight: z.number().min(0).max(500,"Weight must be between 0 and 500").optional().nullable(),
}).strict();

export type EmployeeData = z.infer<typeof employeeSchema>;
