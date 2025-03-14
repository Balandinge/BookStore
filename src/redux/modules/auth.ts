import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppUser, AuthState } from "../../types/auth";

const initialState: AuthState = {
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AppUser | null>) {
      return { ...state, user: action.payload, loading: false };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      return { ...state, loading: action.payload };
    },
  },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
