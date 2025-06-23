export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export enum EmploymentType {
  INTERNSHIP = "INTERNSHIP",
  PROBATION = "PROBATION", 
  CONTRACT = "CONTRACT",
  PERMANENT = "PERMANENT",
}

export interface FormalEducation {
  id?: number;
  level: string;
  schoolName: string;
  major?: string;
  yearGraduate?: number;
  gpa?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NonFormalEducation {
  id?: number;
  name: string;
  institution: string;
  year?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
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

  // Jabatan & Level Jabatan
  position?: string;
  jobTitle?: string;
  jobLevel?: number;
  employmentType?: EmploymentType;
  startDate?: string;
  probationEndDate?: string;
  contractEndDate?: string;
  resignDate?: string;

  isActive?: boolean;
  isOnProbation?: boolean;
  isResigned?: boolean;

  // Relasi Division
  divisionId?: number;
  division?: Division;

  // Family data
  motherName?: string;
  fatherName?: string;
  maritalStatus?: string;
  spouseName?: string;
  childrenNames?: string[];

  // Education
  formalEducations?: FormalEducation[];
  nonFormalEducations?: NonFormalEducation[];

  // Interest & skills
  interests?: string[];
  skills?: string[];
  languages?: string[];  // Documents
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
  profilePictureUrl?: string;

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
  businessUnitId: number;
  businessUnit?: BusinessUnit;
  parentId?: number;
  parent?: Division;
  subDivisions?: Division[];
  users?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessUnit {
  id: number;
  name: string;
  divisions?: Division[];
  createdAt?: string;
  updatedAt?: string;
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