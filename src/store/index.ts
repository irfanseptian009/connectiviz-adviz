import { configureStore } from "@reduxjs/toolkit";
import businessUnitReducer from "./businessUnitSlice";
import divisionReducer from "./divisionSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    businessUnit: businessUnitReducer,
    division: divisionReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
