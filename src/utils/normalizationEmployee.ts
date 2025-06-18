import { User } from '../types/employee';

interface NonFormalEducation {
    year?: string | number;
    [key: string]: string | number | undefined;
}

interface NormalizedNonFormalEducation extends Omit<NonFormalEducation, 'year'> {
    year?: number;
}

interface NormalizedUser extends Omit<User, 'graduationYear' | 'childrenNames' | 'dateOfBirth' | 'nonFormalEducations'> {
    graduationYear: number | null;
    childrenNames: string[] | null;
    dateOfBirth: string | null;
    nonFormalEducations?: NormalizedNonFormalEducation[];
}

export const normalizeEmployee = (d: User): NormalizedUser => ({
    ...d,
    graduationYear: d.graduationYear ? Number(d.graduationYear) : null,
    childrenNames: typeof d.childrenNames === "string"
        ? (d.childrenNames as string).split(",").map((s: string) => s.trim()).filter(Boolean)
        : d.childrenNames ?? null,
    dateOfBirth: d.dateOfBirth?.length === 10
        ? `${d.dateOfBirth}T00:00:00.000Z`
        : d.dateOfBirth ?? null,
    nonFormalEducations: d.nonFormalEducations?.map(edu => ({
        ...edu,
        year: edu.year ? Number(edu.year) : undefined
    }))
});
