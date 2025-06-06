import { Employee } from "./employee";

export interface Props {
  isOpen: boolean;
  onClose(): void;
  editData: Employee | null;
  setEditData(data: Employee | null): void;
  formError: Record<string, string>;
  setFormError(err: Record<string, string>): void;
  handleSave(): Promise<void>;
  selectedTab: number;
  setSelectedTab(idx: number): void;

}