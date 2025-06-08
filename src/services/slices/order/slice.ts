import { TOrder, TOrdersData } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';
import { createOrder, getOrderByNumber, getOrders } from './actions';

type TOrderState = TOrdersData & {
  orderRequest: boolean;
  currentOrder: TOrder | null;
  modalOrder: TOrder | null;
};

const initialState: TOrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  modalOrder: null,
  orderRequest: false
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearModalOrder: (state) => {
      state.modalOrder = null;
    }
  },
  selectors: {
    isOrderRequest: (state) => state.orderRequest,
    getModalOrder: (state) => state.modalOrder,
    selectOrders: (state) => state.orders,
    selectOrder: (state, number: number) =>
      state.currentOrder?.number === number
        ? state.currentOrder
        : state.orders.find((item) => item.number === number)
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.modalOrder = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload.orders[0];
        state.orderRequest = false;
      })
      .addCase(getOrders.pending, (state, action) => {
        state.orderRequest = true;
      })
      .addCase(getOrders.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.orderRequest = false;
      });
  }
});

export const { clearModalOrder } = orderSlice.actions;
export const { isOrderRequest, getModalOrder, selectOrders, selectOrder } =
  orderSlice.selectors;
