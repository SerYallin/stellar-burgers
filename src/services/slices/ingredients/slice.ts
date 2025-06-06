import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredients } from './actions';

export type TIngridientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  isError: boolean;
};

const initialState: TIngridientsState = {
  ingredients: [],
  isLoading: false,
  isError: false
};

export const ingredientsSlice = createSlice({
  name: 'ingridients',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredient: (state, id: string | undefined) =>
      state.ingredients.find((item) => item._id === id),
    selectBuns: (state) =>
      state.ingredients.filter((item) => item.type === 'bun'),
    selectSauces: (state) =>
      state.ingredients.filter((item) => item.type === 'sauce'),
    selectMains: (state) =>
      state.ingredients.filter((item) => item.type === 'main'),
    isIngredientsLoading: (state) => state.isLoading,
    isIngredientsError: (state) => state.isError
  }
});

export const {
  selectIngredient,
  selectIngredients,
  selectBuns,
  selectSauces,
  selectMains,
  isIngredientsLoading,
  isIngredientsError
} = ingredientsSlice.selectors;
