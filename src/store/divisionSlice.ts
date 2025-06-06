import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Division {
  id: number;
  name: string;
  businessUnitId: number;
  parentId?: number | null;
  subDivisions?: Division[];
}

export const fetchDivisionTree = createAsyncThunk(
  "division/fetchTree",
  async (businessUnitId: number) => {
    const { data } = await api.get<Division[]>(`/divisions/tree/${businessUnitId}`);
    return data;
  }
);

export const createDivision = createAsyncThunk(
  "division/create",
  async (payload: { name: string; businessUnitId: number; parentId?: number }) => {
    const { data } = await api.post<Division>("/divisions", payload);
    return data;
  }
);

const divisionSlice = createSlice({
  name: "division",
  initialState: { list: [] as Division[], tree: [] as Division[] },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDivisionTree.fulfilled, (state, action) => {
        state.tree = action.payload;
      })
      .addCase(createDivision.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  }
});
export default divisionSlice.reducer;
