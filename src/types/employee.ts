export interface Employee {
  id: number;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
  email: string;
  password?: string;
  username: string;
  nationalId?: string;
  fullName?: string;
  address?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  officeEmail?: string;

  // Relation
  divisionId?: number;
  businessUnitId?: number;

  // Job data
  jobTitle?: string;
  jobLevel?: string;

  // Family data
  motherName?: string;
  fatherName?: string;
  maritalStatus?: string;
  spouseName?: string;
  childrenNames?: string[];

  // Education
  lastEducation?: string;
  schoolName?: string;
  major?: string;
  yearGraduate?: number;

  // Non-formal education
  nonFormalEducationNames: string[];
  nonFormalInstitutions: string[];
  nonFormalYears: number[];
  nonFormalDescriptions: string[];

  // Documents
  identityCard?: string;
  taxNumber?: string;
  drivingLicense?: string;
  bpjsHealth?: string;
  bpjsEmployment?: string;
  insuranceCompany?: string;
  insuranceNumber?: string;
  policyNumber?: string;
  ptkpStatus?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;

  // Bank
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;

  // Social Media
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;

  // Health
  bloodType?: string;
  medicalHistory?: string;
  allergies?: string;
  height?: number;
  weight?: number;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: string | number | string[] | number[] | undefined;
}
