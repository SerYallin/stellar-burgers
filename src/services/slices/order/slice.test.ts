import { expect, test, describe } from '@jest/globals';
import store from '../../store';
import {
  clearModalOrder,
  createOrder,
  getOrderByNumber,
  getOrders,
  orderSlice
} from '@slices';
import { TOrder } from '@utils-types';

const newOrder: string[] = [
  '643d69a5c3f7b9001cfa093d',
  '643d69a5c3f7b9001cfa093e',
  '643d69a5c3f7b9001cfa0943'
];

const accessToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDgwNTUxYzJmMzBjMDAxY2IyYjUzZSIsImlhdCI6MTc0OTcyMTQ2MCwiZXhwIjoxNzQ5NzIyNjYwfQ.MZU1tWu-jljqCkZY4k0v1zKmkgreK-X9Ms3YAPwLZ1c';

const headers = {
  'Content-Type': 'application/json;charset=utf-8',
  authorization: accessToken
};

const newOrderResponse = {
  success: true,
  name: 'Space флюоресцентный люминесцентный бургер',
  order: {
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa093e',
        name: 'Филе Люминесцентного тетраодонтимформа',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
        __v: 0
      }
    ],
    _id: '684aab7ec2f30c001cb2be67',
    owner: {
      name: 'SerTester',
      email: 'sytest@mail.ru',
      createdAt: '2025-06-10T10:13:37.137Z',
      updatedAt: '2025-06-10T13:14:32.141Z'
    },
    status: 'done',
    name: 'Space флюоресцентный люминесцентный бургер',
    createdAt: '2025-06-12T10:27:10.951Z',
    updatedAt: '2025-06-12T10:27:11.779Z',
    number: 81087,
    price: 2056
  }
};

const ordersResponse = {
  success: true,
  orders: [
    {
      _id: '68480770c2f30c001cb2b546',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0942'
      ],
      status: 'done',
      name: 'Краторный spicy био-марсианский бургер',
      createdAt: '2025-06-10T10:22:40.568Z',
      updatedAt: '2025-06-10T10:22:41.390Z',
      number: 80835
    },
    {
      _id: '68480797c2f30c001cb2b547',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0942'
      ],
      status: 'done',
      name: 'Краторный spicy био-марсианский бургер',
      createdAt: '2025-06-10T10:23:19.101Z',
      updatedAt: '2025-06-10T10:23:19.956Z',
      number: 80836
    },
    {
      _id: '684aa17ac2f30c001cb2bde0',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0943'
      ],
      status: 'done',
      name: 'Space флюоресцентный люминесцентный бургер',
      createdAt: '2025-06-12T09:44:26.638Z',
      updatedAt: '2025-06-12T09:44:27.401Z',
      number: 81066
    },
    {
      _id: '684aab7ec2f30c001cb2be67',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0943'
      ],
      status: 'done',
      name: 'Space флюоресцентный люминесцентный бургер',
      createdAt: '2025-06-12T10:27:10.951Z',
      updatedAt: '2025-06-12T10:27:11.779Z',
      number: 81087
    }
  ],
  total: 80759,
  totalToday: 171
};

const orderResponse = {
  success: true,
  orders: [
    {
      _id: '684aab7ec2f30c001cb2be67',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0943'
      ],
      owner: '68480551c2f30c001cb2b53e',
      status: 'done',
      name: 'Space флюоресцентный люминесцентный бургер',
      createdAt: '2025-06-12T10:27:10.951Z',
      updatedAt: '2025-06-12T10:27:11.779Z',
      number: 81087,
      __v: 0
    }
  ]
};

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  modalOrder: {
    _id: newOrderResponse.order._id,
    status: newOrderResponse.order.status,
    name: newOrderResponse.order.name,
    createdAt: newOrderResponse.order.createdAt,
    updatedAt: newOrderResponse.order.updatedAt,
    number: newOrderResponse.order.number,
    ingredients: newOrder
  },
  orderRequest: false
};

describe('Тестируем процесс создания заказа', () => {
  test('Проверяем pending статус при создании заказа', async () => {
    await store.dispatch({
      type: 'order/createOrder/pending',
      payload: null
    });
    // Получаем состояние згрузки.
    const { orders } = store.getState();
    // Проверяем, что orderRequest равно true.
    expect(orders.orderRequest).toBeTruthy();
  });

  test('Проверяем rejected статус при создании заказа', async () => {
    // Создаем мок на функцию fetch, что возвращает ошибку.
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Something went wrong'));
    const state = await store.dispatch(createOrder(newOrder));
    const { orders } = store.getState();
    // Проверяем, что requestStatus действительно равен rejected.
    expect(state.meta.requestStatus).toBe('rejected');
    // Проверяем, что orderRequest равно false.
    expect(orders.orderRequest).toBeFalsy();
  });

  test('Проверяем fulfilled статус при создании заказа', async () => {
    // Создаем мок на функцию fetch, для успешного запроса.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(newOrderResponse),
          ok: true
        })
    );
    await store.dispatch(createOrder(newOrder));
    const { orders } = store.getState();
    // Проверяем, что orderRequest равно false.
    expect(orders.orderRequest).toBeFalsy();
    // Проверяем, что ордер создан и в modalOrder содержится новый заказ.
    expect(orders.modalOrder).toEqual(newOrderResponse.order);
  });
});

describe('Тестируем процесс получение заказов', () => {
  test('Проверяем pending статус.', async () => {
    await store.dispatch({
      type: 'order/getOrders/pending',
      payload: null
    });
    // Получаем состояние згрузки.
    const { orders } = store.getState();
    // Проверяем, что orderRequest равно true.
    expect(orders.orderRequest).toBeTruthy();
  });

  test('Проверяем rejected статус.', async () => {
    // Создаем мок на функцию fetch, что возвращает ошибку.
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Something went wrong'));
    const state = await store.dispatch(getOrders());
    const { orders } = store.getState();
    // Проверяем, что requestStatus действительно равен rejected.
    expect(state.meta.requestStatus).toBe('rejected');
    // Проверяем, что orderRequest равно false.
    expect(orders.orderRequest).toBeFalsy();
  });

  test('Проверяем fulfilled статус.', async () => {
    // Создаем мок на функцию fetch, для успешного запроса.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(ordersResponse),
          ok: true
        })
    );
    await store.dispatch(getOrders());
    const { orders } = store.getState();
    // Проверяем, что orderRequest равно false.
    expect(orders.orderRequest).toBeFalsy();
    // Проверяем, что ордер создан и в modalOrder содержится новый заказ.
    expect(orders.orders).toEqual(ordersResponse.orders);
  });
});

describe('Тестируем процесс получение заказа по номеру', () => {
  test('Проверяем pending статус.', async () => {
    await store.dispatch({
      type: 'order/getOrderNumber/pending',
      payload: null
    });
    // Получаем состояние згрузки.
    const { orders } = store.getState();
    // Проверяем, что orderRequest равно true.
    expect(orders.orderRequest).toBeTruthy();
  });

  test('Проверяем rejected статус.', async () => {
    // Создаем мок на функцию fetch, что возвращает ошибку.
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Something went wrong'));
    const state = await store.dispatch(
      getOrderByNumber(orderResponse.orders[0].number)
    );
    const { orders } = store.getState();
    // Проверяем, что requestStatus действительно равен rejected.
    expect(state.meta.requestStatus).toBe('rejected');
    // Проверяем, что orderRequest равно false.
    expect(orders.orderRequest).toBeFalsy();
  });

  test('Проверяем fulfilled статус.', async () => {
    // Создаем мок на функцию fetch, для успешного запроса.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(orderResponse),
          ok: true
        })
    );
    await store.dispatch(getOrderByNumber(orderResponse.orders[0].number));
    const { orders } = store.getState();
    // Проверяем, что orderRequest равно false.
    expect(orders.orderRequest).toBeFalsy();
    // Проверяем, что ордер создан и в modalOrder содержится новый заказ.
    expect(orders.currentOrder).toEqual(orderResponse.orders[0]);
  });
});

describe('Проверка не асинхронных редюсеров', () => {
  test('Тестируем процесс очистки модального окна с заказом', () => {
    const state = orderSlice.reducer(initialState, clearModalOrder());
    // Проверяем, что state.modalOrder очищен.
    expect(state.modalOrder).toBeNull();
  });
});
