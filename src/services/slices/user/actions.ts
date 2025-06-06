import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { getUserApi, TAuthResponse } from '@api';
import { setAuthChecked } from './slice';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { dispatch }) =>
    await loginUserApi(data).then((data) => {
      dispatch(updateCredentials(data));
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);
      return data.user;
    })
);

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue, dispatch }) =>
    await registerUserApi(data).then((data) => {
      dispatch(updateCredentials(data));
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);
      return data.user;
    })
);

export const logout = createAsyncThunk('user/logout', async () => {
  logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const setUser = createAsyncThunk(
  'user/setUser',
  async (data: Partial<TRegisterData>, { rejectWithValue, dispatch }) =>
    await updateUserApi(data).then((data) => data.user)
);

export const clearUserError = createAction('user/clearError');

export const updateCredentials = createAction<
  TAuthResponse,
  'user/updateCredentials'
>('user/updateCredentials');

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch, rejectWithValue }) => {
    if (getCookie('accessToken')) {
      try {
        await getUserApi()
          .then((user) => dispatch(setUser(user.user)))
          .finally(() => dispatch(setAuthChecked(true)));
      } catch (e: any) {
        return rejectWithValue(e.message);
      }
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);
