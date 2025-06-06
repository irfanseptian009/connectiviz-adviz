import { Division } from './division';

export interface BusinessUnit {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  divisions?: Division[];
}
