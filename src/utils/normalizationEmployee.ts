import { User } from '../types/employee';

interface NonFormalEducation {
    year?: string | number | null;
    [key: string]: string | number | undefined | null;
}

interface NormalizedNonFormalEducation extends Omit<NonFormalEducation, 'year'> {
    year?: number | null;
}

interface FormalEducation {
    yearGraduate?: string | number | null;
    gpa?: string | number | null;
    [key: string]: string | number | undefined | null;
}

interface NormalizedFormalEducation extends Omit<FormalEducation, 'yearGraduate' | 'gpa'> {
    yearGraduate?: number | null;
    gpa?: number | null;
}

interface NormalizedUser extends Omit<User, 'childrenNames' | 'dateOfBirth' | 'startDate' | 'probationEndDate' | 'contractEndDate' | 'resignDate' | 'formalEducations' | 'nonFormalEducations'> {
    childrenNames: string[] | null;
    dateOfBirth: string | null;
    startDate: string | null;
    probationEndDate: string | null;
    contractEndDate: string | null;
    resignDate: string | null;
    formalEducations?: NormalizedFormalEducation[];
    nonFormalEducations?: NormalizedNonFormalEducation[];
}

const normalizeDate = (date: string | undefined | null): string | null => {
    if (!date) return null;
    return date.length === 10 ? `${date}T00:00:00.000Z` : date;
};

export const normalizeEmployee = (d: User): NormalizedUser => {
    const normalized = {
        ...d,
        childrenNames: typeof d.childrenNames === "string"
            ? (d.childrenNames as string).split(",").map((s: string) => s.trim()).filter(Boolean)
            : d.childrenNames ?? null,
        dateOfBirth: normalizeDate(d.dateOfBirth),
        startDate: normalizeDate(d.startDate),
        probationEndDate: normalizeDate(d.probationEndDate),
        contractEndDate: normalizeDate(d.contractEndDate),
        resignDate: normalizeDate(d.resignDate),
        promotionDate: normalizeDate(d.promotionDate) ?? undefined,
        demotionDate: normalizeDate(d.demotionDate) ?? undefined,
        rehireDate: normalizeDate(d.rehireDate) ?? undefined,
        insuranceEndDate: normalizeDate(d.insuranceEndDate) ?? undefined,
        formalEducations: d.formalEducations?.map(edu => ({
            ...edu,
            yearGraduate: (edu.yearGraduate !== null && edu.yearGraduate !== undefined) 
                ? (typeof edu.yearGraduate === 'string' && edu.yearGraduate !== '') 
                    ? Number(edu.yearGraduate) 
                    : typeof edu.yearGraduate === 'number' 
                        ? edu.yearGraduate 
                        : null
                : null,
            gpa: (edu.gpa !== null && edu.gpa !== undefined) 
                ? (typeof edu.gpa === 'string' && edu.gpa !== '') 
                    ? Number(edu.gpa) 
                    : typeof edu.gpa === 'number' 
                        ? edu.gpa 
                        : null
                : null
        })),
        nonFormalEducations: d.nonFormalEducations?.map(edu => ({
            ...edu,
            year: (edu.year !== null && edu.year !== undefined) 
                ? (typeof edu.year === 'string' && edu.year !== '') 
                    ? Number(edu.year) 
                    : typeof edu.year === 'number' 
                        ? edu.year 
                        : null
                : null
        }))
    };    // Convert empty strings and null values to undefined for optional fields
    const stringFields = [
        'fullName', 'nationalId', 'address', 'placeOfBirth', 'gender', 'phoneNumber', 
        'officeEmail', 'position', 'jobTitle', 'motherName', 'fatherName', 'maritalStatus', 
        'spouseName', 'identityCard', 'taxNumber', 'drivingLicense', 'bpjsHealth', 
        'bpjsEmployment', 'insuranceCompany', 'insuranceNumber', 'policyNumber', 'ptkpStatus',
        'emergencyContactName', 'emergencyContactRelation', 'emergencyContactPhone',
        'bankName', 'bankAccountNumber', 'bankAccountName', 'instagram', 'facebook', 
        'twitter', 'linkedin', 'tiktok', 'bloodType', 'medicalHistory', 'allergies', 
        'profilePictureUrl'
    ] as const;

    stringFields.forEach(field => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((normalized as any)[field] === null || (normalized as any)[field] === '') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (normalized as any)[field] = undefined;
        }
    });

    // Convert null values to undefined for date fields
    const dateFields = [
        'dateOfBirth', 'startDate', 'probationEndDate', 'contractEndDate', 'resignDate',
        'promotionDate', 'demotionDate', 'rehireDate', 'insuranceEndDate'
    ] as const;

    dateFields.forEach(field => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((normalized as any)[field] === null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (normalized as any)[field] = undefined;
        }
    });

    return normalized;
};
