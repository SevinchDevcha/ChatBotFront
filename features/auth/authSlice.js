import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';

// localStorage dan dastlabki holat
const savedToken = localStorage.getItem('edu_token');
const savedUser  = JSON.parse(localStorage.getItem('edu_user') || 'null');

// ─── THUNKS ───────────────────────────────────────────────────
export const signUp = createAsyncThunk('auth/signUp', async ({ firstname, lastname }, { rejectWithValue }) => {
  try {
    return await authApi.signUp(firstname, lastname);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const signIn = createAsyncThunk('auth/signIn', async (firstname, { rejectWithValue }) => {
  try {
    return await authApi.signIn(firstname);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// ─── SLICE ────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    savedUser,
    token:   savedToken,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('edu_token');
      localStorage.removeItem('edu_user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error   = null;
    };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.token   = action.payload.token;
      state.user    = action.payload.user;
      localStorage.setItem('edu_token', action.payload.token);
      localStorage.setItem('edu_user', JSON.stringify(action.payload.user));
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    };

    builder
      .addCase(signUp.pending,   handlePending)
      .addCase(signUp.fulfilled, handleFulfilled)
      .addCase(signUp.rejected,  handleRejected)
      .addCase(signIn.pending,   handlePending)
      .addCase(signIn.fulfilled, handleFulfilled)
      .addCase(signIn.rejected,  handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
