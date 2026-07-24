import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
