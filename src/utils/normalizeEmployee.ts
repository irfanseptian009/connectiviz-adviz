import { User, NonFormalEducation } from "../types/employee";

interface NormalizedNonFormalEducation extends NonFormalEducation {
    year?: number;
}

interface NormalizedUser extends Omit<User, 'childrenNames' | 'dateOfBirth' | 'nonFormalEducations'> {
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
    childrenNames: typeof d.childrenNames === "string"
        ? d.childrenNames.split(",").map(s => s.trim()).filter(Boolean)
        : d.childrenNames ?? [],
    dateOfBirth: d.dateOfBirth?.length === 10
        ? `${d.dateOfBirth}T00:00:00.000Z`
        : d.dateOfBirth ?? null,
    nonFormalEducations: d.nonFormalEducations?.map((n) => ({
        ...n,
        year: n.year ? Number(n.year) : undefined,
    })),
});
