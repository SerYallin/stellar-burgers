import { combineSlices } from '@reduxjs/toolkit';
import {
  ingredientsSlice,
  userSlice,
  constructorSlice,
  orderSlice,
  feedsSlice
} from '@slices';

export const rootReducer = combineSlices(
  ingredientsSlice,
  userSlice,
  constructorSlice,
  orderSlice,
  feedsSlice
);
