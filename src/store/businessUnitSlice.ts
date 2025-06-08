import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface BusinessUnit {
  id: number;
  name: string;
}

interface BusinessUnitState {
  list: BusinessUnit[];
  loading: boolean;
  error?: string;
}

const initialState: BusinessUnitState = {
  list: [],
  loading: false,
  error: undefined,
};

// Fetch all business units
export const fetchBusinessUnits = createAsyncThunk(
  "businessUnit/fetchAll",
  async () => {
    const { data } = await api.get<BusinessUnit[]>("/business-units");
    return data;
  }
);

// Create new business unit
export const createBusinessUnit = createAsyncThunk(
  "businessUnit/create",
  async (payload: { name: string }) => {
    const { data } = await api.post<BusinessUnit>("/business-units", payload);
    return data;
  }
);

const businessUnitSlice = createSlice({
  name: "businessUnit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessUnits.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchBusinessUnits.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchBusinessUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBusinessUnit.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createBusinessUnit.fulfilled, (state, action) => {
        // Optional: check duplicate by id
        if (!state.list.find((bu) => bu.id === action.payload.id)) {
          state.list.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createBusinessUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default businessUnitSlice.reducer;
