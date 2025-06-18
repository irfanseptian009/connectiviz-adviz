export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface NonFormalEducation {
  name: string;
  institution: string;
  year: number;
  description?: string;
}

export interface User {
  id: number;
  name: string;
  role?: Role;
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
  position?: string;         
  jobLevel?: string;
  // Family data
  motherName?: string;
  fatherName?: string;
  maritalStatus?: string;
  spouseName?: string;
  childrenNames?: string[];
  // Education
  lastEducation?: string;
  facultyName?: string;
  graduationYear?: number;     
  majorName?: string;
  gpa?: string;
  // Non-formal education
  nonFormalEducations?: NonFormalEducation[];
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
}

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  division?: Division;
  photoUrl?: string;
  supervisorId?: number;
  subordinates?: Employee[];
}

export interface Division {
  id: number;
  name: string;
  subDivisions?: Division[];
}

export interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: User | null;
  setEditData: (data: User | null) => void;
  formError: Record<string, string>;
  setFormError: (errors: Record<string, string>) => void;
  handleSave: () => void;
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
}

export interface NonFormalEducation {
  name: string;
  institution: string;
  year: number;
  description?: string;
}