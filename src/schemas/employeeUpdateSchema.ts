import { z } from 'zod';
import { formalEducationSchema, nonFormalEducationSchema } from './employee';

export const employeeUpdateSchema = z.object({
  id: z.number(),

  // Auth
  username: z.string().min(1, 'Username wajib diisi').optional(),
  email: z.string().email('Email tidak valid').optional(),
  // Personal details
  fullName: z.string().optional().nullable(),
  nationalId: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  placeOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  officeEmail: z.string().optional().nullable(),
  dateOfBirth: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  // Jabatan & Level Jabatan
  position: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  jobLevel: z.number().optional().nullable(),
  employmentType: z.enum(['INTERNSHIP', 'PROBATION', 'CONTRACT', 'PERMANENT']).optional().nullable(),
  startDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  probationEndDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  contractEndDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  resignDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  // Career tracking fields
  promotionDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  demotionDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  rehireDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  // Insurance end date
  insuranceEndDate: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),
  isActive: z.boolean().optional().nullable(),
  isOnProbation: z.boolean().optional().nullable(),
  isResigned: z.boolean().optional().nullable(),

  divisionId: z.number().optional().nullable(),
  // Family
  motherName: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  spouseName: z.string().optional().nullable(),
  childrenNames: z.array(z.string()).optional().nullable(),

  // Education - New Structure
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
  ptkpStatus: z.string().optional().nullable(),

  // Emergency Contact
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactRelation: z.string().optional().nullable(),
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
  bloodType: z.string().optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),  height: z.number().optional().nullable(),
  weight: z.number().optional().nullable(),
  profilePictureUrl: z.string().optional().nullable(),
});

export type EmployeeUpdateData = z.infer<typeof employeeUpdateSchema>;
