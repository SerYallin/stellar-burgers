import { expect, test, describe } from '@jest/globals';
import { rootReducer } from './reducers';
import store from './store';

describe('Проверка корневого редюсера', () => {
  test('После инициализации редюсера он должен быть равным store.getState()', () => {
    // Создаем initialState, который будет равен store.getState(), для этого используем
    // undefined в качестве начального состояния, и 'UNKNOWN_ACTION' в качестве типа действия.
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Сравниваем initialState с store.getState(), чтобы убедиться, что они равны.
    expect(initialState).toEqual(store.getState());
  });
});
