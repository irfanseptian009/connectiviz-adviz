export interface Division {
  id: number;
  name: string;
  businessUnitId: number;
  parentId?: number | null;
  createdAt: string;
  updatedAt: string;
  subDivisions?: Division[];
  parent?: Division;
}

export type DivisionPayload = {
  name: string;
  parentId?: number | null;
  businessUnitId: number;
  data: number|null | undefined;
};