import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import employeeReducer from "./employeeSlice";
import businessUnitReducer from "./businessUnitSlice";
import divisionReducer from "./divisionSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    businessUnit: businessUnitReducer,
    division: divisionReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

