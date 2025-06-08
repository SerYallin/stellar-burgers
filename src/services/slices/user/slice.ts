import { TUser } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  login,
  logout,
  register,
  setUser,
  updateCredentials,
  clearUserError,
  checkUserAuth
} from './actions';
import { deleteCookie, setCookie } from '../../../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | undefined;
};

export const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  error: undefined
};

const setErrorMessage = (state: TAuthState, action: any) => {
  state.error = action.error?.message;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.rejected, setErrorMessage)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(clearUserError, (state) => {
        state.error = undefined;
      })
      .addCase(register.rejected, setErrorMessage)
      .addCase(updateCredentials, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, setErrorMessage);
  }
});

export const { setAuthChecked } = userSlice.actions;
export const { getUser, getIsAuthChecked, getUserError } = userSlice.selectors;
