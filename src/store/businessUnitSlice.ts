import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface BusinessUnit {
  id: number;
  name: string;
}

export const fetchBusinessUnits = createAsyncThunk(
  "businessUnit/fetchAll",
  async () => {
    const { data } = await api.get<BusinessUnit[]>("/business-units");
    return data;
  }
);

export const createBusinessUnit = createAsyncThunk(
  "businessUnit/create",
  async (payload: { name: string }) => {
    const { data } = await api.post<BusinessUnit>("/business-units", payload);
    return data;
  }
);

const businessUnitSlice = createSlice({
  name: "businessUnit",
  initialState: { list: [] as BusinessUnit[], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBusinessUnits.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createBusinessUnit.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  }
});

export default businessUnitSlice.reducer;
