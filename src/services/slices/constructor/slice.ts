import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import exp from 'constants';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const prepare = (ingredient: TIngredient) => ({
  payload: { ...ingredient, id: nanoid() }
});

const moveIngredient =
  (index: number, step: number) => (state: TConstructorState) => {
    state.ingredients.splice(
      index + step,
      0,
      state.ingredients.splice(index, 1)[0]
    );
  };

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialState,
  reducers: {
    addBun: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.bun = action.payload;
      },
      prepare
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.ingredients.push(action.payload);
      },
      prepare
    },
    deleteIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveUpIngredient(state, action: PayloadAction<number>) {
      moveIngredient(action.payload, -1)(state);
    },
    moveDownIngredient(state, action: PayloadAction<number>) {
      moveIngredient(action.payload, 1)(state);
    },
    resetConstructor: (state) => initialState
  },
  selectors: {
    getBun: (state) => state.bun,
    getConstructor: (state) => state
  }
});

export const {
  addBun,
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetConstructor
} = constructorSlice.actions;
export const { getBun, getConstructor } = constructorSlice.selectors;
