import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

export const getIngredients = createAsyncThunk(
  'ingredients/get',
  async () => await getIngredientsApi()
);
