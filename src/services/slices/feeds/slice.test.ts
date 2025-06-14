import { expect, test, describe } from '@jest/globals';
import store from '../../store';
import { getFeeds } from '@slices';

const initialState = store.getState().feeds;

const expectedResult = {
  success: true,
  orders: [
    {
      _id: '684a94fcc2f30c001cb2bd78',
      ingredients: [
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0943'
      ],
      status: 'done',
      name: 'Краторный space бургер',
      createdAt: '2025-06-12T08:51:08.196Z',
      updatedAt: '2025-06-12T08:51:08.889Z',
      number: 81055
    },
    {
      _id: '684a9455c2f30c001cb2bd75',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный бессмертный био-марсианский бургер',
      createdAt: '2025-06-12T08:48:21.498Z',
      updatedAt: '2025-06-12T08:48:22.332Z',
      number: 81054
    },
    {
      _id: '684a92c9c2f30c001cb2bd66',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный метеоритный бургер',
      createdAt: '2025-06-12T08:41:45.772Z',
      updatedAt: '2025-06-12T08:41:46.569Z',
      number: 81053
    }
  ],
  total: 3,
  totalToday: 1
};

describe('Тестирование списка заказов', () => {
  test('Проверка pending загрузки всех заказов', async () => {
    // Вызываем экшн для загрузки заказов со статусом pending.
    await store.dispatch({
      type: 'feeds/GetFeeds/pending',
      payload: null
    });
    // Получаем состояние згрузки.
    const { feeds } = store.getState();
    // Проверяем, что состояние равно начальному, но со статусом загрузки isLoaded - true.
    expect(feeds).toEqual({ ...initialState, isLoaded: true });
  });

  test('Проверка rejected загрузки всех заказов', async () => {
    // Создаем мок-функцию для fetch, который возвращает reject.
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Ошибка при получении данных'));

    await store.dispatch(getFeeds());
    // Получаем состояние згрузки.
    const { feeds } = store.getState();
    // Проверяем, что состояние, где есть ошибка и статус загрузки isLoaded - false.
    expect(feeds).toEqual({
      ...initialState,
      error: expect.any(String),
      isLoaded: false
    });
  });
  test('Проверка успешной загрузки всех заказов', async () => {
    // Создаем мок-функцию для fetch, который возвращает результаты.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(expectedResult),
          ok: true
        })
    );

    await store.dispatch(getFeeds());
    // Получаем состояние згрузки.
    const { feeds } = store.getState();
    // Проверяем, что состояние с результатами и статус загрузки isLoaded - true.
    expect(feeds).toEqual({
      ...initialState,
      orders: expectedResult.orders,
      total: expectedResult.total,
      totalToday: expectedResult.totalToday,
      isLoaded: false
    });
  });
});
