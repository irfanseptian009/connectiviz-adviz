import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { AppDispatch } from "@/store";

export interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  divisionId?: number;
  // ...tambahkan field lain sesuai kebutuhan
}

export const fetchUsers = createAsyncThunk("user/fetchAll", async () => {
const { data } = await api.get<User[]>("/users");
  return data;
});

export const createUser = createAsyncThunk(
  "user/create",
  async (payload: AppDispatch) => {
    const { data } = await api.post<User>("/users", payload);
    return data;
  }
);

// Assign satu user ke division
export const assignUserToDivision = createAsyncThunk(
  "user/assignToDivision",
  async ({ userId, divisionId }: { userId: number; divisionId: number }) => {
    const { data } = await api.patch<User>(`/users/${userId}`, { divisionId });
    return data;
  }
);

// Assign multiple users (loop PATCH, sesuai endpoint yang tersedia)
export const assignMultipleUsersToDivision = createAsyncThunk(
  "user/assignMultipleToDivision",
  async ({ userIds, divisionId }: { userIds: number[]; divisionId: number }, { dispatch }) => {
    await Promise.all(
      userIds.map((id) => dispatch(assignUserToDivision({ userId: id, divisionId })))
    );
    return { userIds, divisionId };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { list: [] as User[] },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  }
});

export default userSlice.reducer;
