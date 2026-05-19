import { create } from 'zustand';

interface Column {
  name: string;
  type: string;
  unit: string;
  comment: string;
}

interface DataStore {
  data: Record<string, any>[];
  columns: Column[];
  templateId: string | null;
  setData: (data: Record<string, any>[], columns: Column[]) => void;
  setTemplateId: (id: string | null) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  columns: [],
  templateId: null,
  setData: (data, columns) => set({ data, columns }),
  setTemplateId: (id) => set({ templateId: id }),
}));