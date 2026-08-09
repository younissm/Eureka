import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/axios.config";

import CookieServices from "../../services/CookieServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

export const selectUserData = (state) => state.login.data;

export const userLogin = createAsyncThunk(
  "login/userLogin",
  async ({ email, password }, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const { data } = await axiosInstance.post(`/users/login`, {
        email,
        password,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const loginSlice = createSlice({
  initialState,
  name: "login",
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.success = true;

        const date = new Date();
        const EXPIRES_AT = 365 * 24 * 60 * 60 * 1000;
        date.setTime(date.getTime() + EXPIRES_AT);
        const options = { path: "/", expires: date };

        CookieServices.set("jwt", action.payload.token, options);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const selectLogin = ({ login }) => login;
export default loginSlice.reducer;
