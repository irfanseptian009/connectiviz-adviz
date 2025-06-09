import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* ─── Model ───────────────────────────────────────────────────── */
export interface Division {
  id: number;
  name: string;
  businessUnitId: number;
  parentId?: number | null;
  subDivisions?: Division[];
}

/* ─── Async Thunks ────────────────────────────────────────────── */
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

/* ─── Slice ───────────────────────────────────────────────────── */
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
        state.status = 'loading';
      })
        .addCase(fetchDivisionTree.fulfilled, (state, action) => {
  const { businessUnitId, tree } = action.payload;
  state.loading = false;
  state.status = 'succeeded';
  state.tree[businessUnitId] = tree;
})

      .addCase(fetchDivisionTree.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message ?? "Unknown error";
      })

      .addCase(createDivision.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  }
});

export default divisionSlice.reducer;
