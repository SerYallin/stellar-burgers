import { TOrdersData } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';
import { getFeeds } from './actions';

type TFeedsState = TOrdersData & {
  isLoaded: boolean;
  error: string | undefined;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoaded: false,
  error: undefined
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectFeed: (state) => state,
    selectFeeds: (state) => state.orders,
    selectFeedsItem: (state, number: number) =>
      state.orders.find((item) => item.number === number),
    isLoaded: (state) => state.isLoaded
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoaded = true;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoaded = true;
        state.error = action.error.message;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoaded = false;
      });
  }
});

export const { selectFeeds, isLoaded, selectFeed } = feedsSlice.selectors;
