import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';

export const getFeeds = createAsyncThunk(
  'feeds/GetFeeds',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);
