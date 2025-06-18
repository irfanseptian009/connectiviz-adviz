import { z } from 'zod';

export const employeeUpdateSchema = z.object({
  id: z.number(),

  // Auth
  username: z.string().min(1, 'Username wajib diisi'),
  email: z.string().email('Email tidak valid'),

  // Optional personal details
  fullName: z.string().optional(),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.string().optional(),
  phoneNumber: z.string().optional(),
  officeEmail: z.string().optional(),

  dateOfBirth: z
    .string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}T.*$/.test(val), {
      message: 'Format tanggal tidak valid',
    })
    .optional()
    .or(z.null()),

  // Jabatan
  position: z.string().optional(),
  jobLevel: z.string().optional(),

  divisionId: z.number().optional().nullable(),

  // Family
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  maritalStatus: z.string().optional(),
  spouseName: z.string().optional(),

  childrenNames: z.array(z.string()).optional().nullable(),

  // Education
  lastEducation: z.string().optional(),
  facultyName: z.string().optional(),
  majorName: z.string().optional(),
  graduationYear: z.number().optional().or(z.null()),

  gpa: z
    .string()
    .refine((val) => !val || !isNaN(parseFloat(val)), {
      message: 'GPA harus berupa angka',
    })
    .optional()
    .or(z.null()),

  // Nested NonFormalEducation
  nonFormalEducations: z
    .array(
      z.object({
        name: z.string().min(1, 'Nama pelatihan wajib'),
        institution: z.string().min(1, 'Lembaga wajib'),
        year: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),

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

  // Emergency
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Bank
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),

  // Social Media
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  tiktok: z.string().optional(),

  // Health
  bloodType: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  height: z.number().optional().or(z.null()),
  weight: z.number().optional().or(z.null()),
});
