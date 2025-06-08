import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { User } from "@/types/employee";

export const fetchUsers = createAsyncThunk("user/fetchAll", async () => {
  const { data } = await api.get<User[]>("/users");
  return data;
});

export const createUser = createAsyncThunk(
  "user/create",
  async (payload: Partial<User>, { rejectWithValue }) => {
    try {
      const { data } = await api.post<User>("/users", payload);
      return data;
    } catch (err: unknown) {
      const error = err as Error & { response?: { data: string } };
      return rejectWithValue(error.response?.data || "Failed to create user");
    } 
  }
);

export const assignUserToDivision = createAsyncThunk(
  "user/assignToDivision",
  async ({ userId, divisionId }: { userId: number; divisionId: number }) => {
    const { data } = await api.patch<User>(`/users/${userId}`, { divisionId });
    return data;
  }
);

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
  initialState: {
    list: [] as User[],
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload && !state.list.find(u => u.id === action.payload.id)) {
          state.list.push(action.payload);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});


export default userSlice.reducer;
