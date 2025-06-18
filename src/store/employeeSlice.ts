import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { User } from "@/types/employee";
import { AxiosError } from "axios";

interface EmployeeState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchEmployeeChart = createAsyncThunk(
  "employee/fetchChart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<User>("/users/chart");
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Error fetching chart");
      }
      return rejectWithValue("Error fetching chart");
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeChart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployeeChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
