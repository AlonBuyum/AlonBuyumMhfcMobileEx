import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  // POC note: plaintext stored client-side. Acceptable for a local-only demo;
  // in production the auth would live behind a backend with bcrypt or argon2.
  password: string;
  createdAt: string;
}

export interface AuthState {
  usersByEmail: Record<string, StoredUser>;
  currentUserId: string | null;
}

const initialState: AuthState = {
  usersByEmail: {},
  currentUserId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<StoredUser>) => {
      const user = action.payload;
      state.usersByEmail[user.email.toLowerCase()] = user;
      state.currentUserId = user.id;
    },
    signIn: (state, action: PayloadAction<{ userId: string }>) => {
      state.currentUserId = action.payload.userId;
    },
    signOut: (state) => {
      state.currentUserId = null;
    },
  },
});

export const { registerUser, signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
