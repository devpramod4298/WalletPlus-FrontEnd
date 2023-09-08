import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    username: null,
    email: null,
  },
  reducers: {
    LOGIN: (state, action) => {
      localStorage.setItem("Wallet__token", action.payload.token);
      localStorage.setItem("Wallet__email", action.payload.email);
      localStorage.setItem("Wallet__username", action.payload.username);
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },

    LOGOUT: (state, action) => {
      localStorage.removeItem("Wallet__token");
      localStorage.removeItem("Wallet__email");
      localStorage.removeItem("Wallet__username");
      state.token = null;
      state.email = null;
      state.username = null;
    },
  },
});

export const { LOGIN, LOGOUT } = authSlice.actions;

export const selectUserData = (state) => state.auth;

export default authSlice.reducer;
