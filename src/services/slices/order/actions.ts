import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[], { dispatch, rejectWithValue }) => {
    try {
      return await orderBurgerApi(data);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderNumber',
  async (number: number, { dispatch, rejectWithValue }) => {
    try {
      return await getOrderByNumberApi(number);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);
