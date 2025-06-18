import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { RootState } from "@/store";

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
    return { businessUnitId, tree: data };
  }
);

export const createDivision = createAsyncThunk(
  "division/create",
  async (payload: { name: string; businessUnitId: number; parentId?: number }) => {
    const { data } = await api.post<Division>("/divisions", payload);
    return data;
  }
);

interface DivisionState {
  list: Division[];
  tree: Record<number, Division[]>; 
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DivisionState = {
  list: [],
  tree: {},
  loading: false,
  status: 'idle',
  error: null,
};

const divisionSlice = createSlice({
  name: "division",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDivisionTree.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchDivisionTree.fulfilled, (state, action) => {
        const { businessUnitId, tree } = action.payload;
        state.loading = false;
        state.status = "succeeded";

        // avoid unnecessary rerenders by shallow comparing before updating
        const existing = state.tree[businessUnitId];
        const isSame =
          existing?.length === tree.length &&
          existing?.every((div, i) => div.id === tree[i].id);

        if (!isSame) {
          state.tree[businessUnitId] = tree;
        }
      })
      .addCase(fetchDivisionTree.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(createDivision.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default divisionSlice.reducer;

export const selectDivisionState = (state: RootState) => state.division;

export const selectDivisionTree = createSelector(
  [selectDivisionState],
  (division) => division.tree
);

export const selectDivisionTreeByBU = (businessUnitId: number) =>
  createSelector([selectDivisionTree], (tree) => tree[businessUnitId] ?? []);
