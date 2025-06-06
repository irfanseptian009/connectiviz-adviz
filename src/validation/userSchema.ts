import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  nationalId: z.string().optional(),
  fullName: z.string().optional(),
  address: z.string().optional(),
  placeOfBirth: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  phoneNumber: z.string().optional(),
  officeEmail: z.string().optional(),

  position: z.string().optional(),
  jobLevel: z.string().optional(),

  divisionId: z.string().optional(),

  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  maritalStatus: z.string().optional(),
  spouseName: z.string().optional(),
  childrenNames: z.array(z.string()).optional(),

  identityCard: z.string().optional(),
  taxNumber: z.string().optional(),
  drivingLicense: z.string().optional(),
  bpjsHealth: z.string().optional(),
  bpjsEmployment: z.string().optional(),
  insuranceCompany: z.string().optional(),
  insuranceNumber: z.string().optional(),
  policyNumber: z.string().optional(),
  ptkpStatus: z.string().optional(),

  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),

  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  tiktok: z.string().optional(),

  bloodType: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
});
export type UserFormType = z.infer<typeof userSchema>;
export const nonFormalEducations = z.object({
  name: z.string(),
  institution: z.string(),
  year: z.string(),
});