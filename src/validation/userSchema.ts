import { z } from "zod";
import { Role, EmploymentType } from "@/types/employee";

export const formalEducationSchema = z.object({
  level: z.string().min(1, "Education level is required"),
  schoolName: z.string().min(1, "School name is required"),
  major: z.string().optional(),
  yearGraduate: z.number().optional(),
  gpa: z.number().min(0).max(4).optional(),
});

export const nonFormalEducationSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.number().optional(),
  description: z.string().optional(),
});

export const userSchema = z.object({
  // Required fields
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
    // Optional personal information
  nationalId: z.string().optional(),
  fullName: z.string().optional(),
  address: z.string().optional(),
  placeOfBirth: z.string().optional(),
  dateOfBirth: z.string().optional(), // ISO date string
  gender: z.string().optional(),
  phoneNumber: z.string().optional(),
  officeEmail: z.string().email("Invalid office email format").optional().or(z.literal("")),
  profilePictureUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  educationLevel: z.string().optional(),
  // Role and employment
  role: z.nativeEnum(Role),
  employmentType: z.nativeEnum(EmploymentType).optional(),
  
  // Job information
  position: z.string().optional(),
  jobTitle: z.string().optional(),
  jobLevel: z.number().min(1).max(10).optional(),
  startDate: z.string().optional(), // ISO date string
  probationEndDate: z.string().optional(), // ISO date string
  contractEndDate: z.string().optional(), // ISO date string
  resignDate: z.string().optional(), // ISO date string

  // Status flags
  isActive: z.boolean().optional().default(true),
  isOnProbation: z.boolean().optional().default(false),
  isResigned: z.boolean().optional().default(false),

  // Division relationship
  divisionId: z.union([z.string(), z.number()]).optional(),

  // Family information
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  maritalStatus: z.string().optional(),
  spouseName: z.string().optional(),
  childrenNames: z.array(z.string()).default([]),

  // Interests and skills
  interests: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),

  // Education arrays
  formalEducations: z.array(formalEducationSchema).default([]),
  nonFormalEducations: z.array(nonFormalEducationSchema).default([]),

  // Documents
  identityCard: z.string().optional(),
  taxNumber: z.string().optional(),
  drivingLicense: z.string().optional(),
  bpjsHealth: z.string().optional(),
  bpjsEmployment: z.string().optional(),
  insuranceCompany: z.string().optional(),
  insuranceNumber: z.string().optional(),
  policyNumber: z.string().optional(),
  ptkpStatus: z.string().optional(),

  // Emergency contact
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Bank information
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),

  // Social media
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  tiktok: z.string().optional(),

  // Health information
  bloodType: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  height: z.number().min(50).max(300).optional(),
  weight: z.number().min(20).max(500).optional(),
});

export type UserFormType = z.infer<typeof userSchema>;
