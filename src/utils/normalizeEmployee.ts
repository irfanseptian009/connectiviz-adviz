import { User } from "../types/employee";

import { NonFormalEducation as ImportedNonFormalEducation } from "../types/employee";

interface NonFormalEducation extends ImportedNonFormalEducation {
    year: number;
}

interface NormalizedNonFormalEducation extends Omit<NonFormalEducation, 'year'> {
    year?: number;
}

interface NormalizedUser extends Omit<User, 'graduationYear' | 'childrenNames' | 'dateOfBirth' | 'nonFormalEducations'> {
    graduationYear: number | null;
    childrenNames: string[];
    dateOfBirth: string | null;
    nonFormalEducations?: NormalizedNonFormalEducation[];
}

type DateString = string & {
    length: 10;
}

interface NormalizeEmployeeInput extends Omit<User, 'childrenNames'> {
    dateOfBirth?: DateString | string;
    childrenNames?: string | string[];
}

export const normalizeEmployee = (d: NormalizeEmployeeInput): NormalizedUser => ({
    ...d,
    graduationYear: d.graduationYear ? Number(d.graduationYear) : null,
    childrenNames: typeof d.childrenNames === "string"
        ? d.childrenNames.split(",").map(s => s.trim()).filter(Boolean)
        : d.childrenNames ?? [],
    dateOfBirth: d.dateOfBirth?.length === 10
        ? `${d.dateOfBirth}T00:00:00.000Z`
        : d.dateOfBirth ?? null,
    nonFormalEducations: d.nonFormalEducations?.map((n: NonFormalEducation) => ({
        ...n,
        year: n.year ? Number(n.year) : undefined,
    })),
});
