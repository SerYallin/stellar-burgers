import { expect, test, describe } from '@jest/globals';
import {
  checkUserAuth,
  clearUserError,
  login,
  logout,
  register,
  setUser,
  userSlice
} from '@slices';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../reducers';

const response = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Test User'
  },
  accessToken: 'accsessTokenTest',
  refreshToken: 'refreshTokenTest'
};

const updateResponse = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'SerTester'
  }
};

const logoutResponse = { success: true, message: 'Successful logout' };

let store: any;

beforeEach(() => {
  store = configureStore({ reducer: rootReducer });
});

describe('Проверка процесса регистрации пользователя', () => {
  test('Проверка ошибки при регистрации', async () => {
    // Мок функция для fetch для проверки ошибки
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Ошибка при регистрации'));

    await store.dispatch(
      register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    );

    const { user } = store.getState();
    // Проверяем, что пользователь не был зарегистрирован и ошибка была обработана.
    expect(user.user).toBeNull();
    expect(user.error).toEqual('Ошибка при регистрации');
  });

  test('Проверка успешной регистрации', async () => {
    // Мок функция для fetch для проверки успешной регистрации.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(response),
          ok: true
        })
    );
    await store.dispatch(
      register({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      })
    );

    const { user } = store.getState();
    // Получаем токены из localStorage и Куки.
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');
    // Проверяем, что пользователь был зарегистрирован и токены сохранены.
    expect(user.user).toEqual(response.user);
    expect(refreshToken).toBe(response.refreshToken);
    expect(accessToken).toBe(response.accessToken);
  });
});

describe('Проверка процесса авторизации пользователя', () => {
  test('Проверка ошибки пр авторизации', async () => {
    // Мок функция для fetch для проверки ошибки
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Ошибка при авторизации'));

    await store.dispatch(
      login({
        email: 'test@example.com',
        password: 'password123'
      })
    );

    const { user } = store.getState();
    // Проверяем, что пользователь не был зарегистрирован и ошибка была обработана.
    expect(user.user).toBeNull();
    expect(user.error).toEqual('Ошибка при авторизации');
  });

  test('Проверка успешной авторизации', async () => {
    // Мок функция для fetch для проверки успешной регистрации.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(response),
          ok: true
        })
    );
    await store.dispatch(
      login({
        email: 'test@example.com',
        password: 'password123'
      })
    );

    const { user } = store.getState();
    // Получаем токены из localStorage и Куки.
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');
    // Проверяем, что пользователь был зарегистрирован и токены сохранены.
    expect(user.user).toEqual(response.user);
    expect(refreshToken).toBe(response.refreshToken);
    expect(accessToken).toBe(response.accessToken);
  });
});

describe('Проверка процесса логаута', () => {
  test('Проверка логаута', async () => {
    let state: any,
      refreshToken: string | null,
      accessToken: string | undefined;
    // Мок функция для fetch для авторизации.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(response),
          ok: true
        })
    );

    await store.dispatch(
      login({
        email: 'test@example.com',
        password: 'password123'
      })
    );
    // проверяем, что пользователь авторизован
    state = store.getState();
    refreshToken = localStorage.getItem('refreshToken');
    accessToken = getCookie('accessToken');
    expect(state.user.user).toEqual(response.user);
    expect(refreshToken).toBe(response.refreshToken);
    expect(accessToken).toBe(response.accessToken);
    // Мок функция для fetch для логаута.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(logoutResponse),
          ok: true
        })
    );
    // логаут
    await store.dispatch(logout());
    // проверяем, что пользователь не авторизован
    state = store.getState();
    expect(state.user.user).toBeNull();
    refreshToken = localStorage.getItem('refreshToken');
    accessToken = getCookie('accessToken');
    expect(refreshToken).toBeNull();
    expect(accessToken).toBeUndefined();
  });
});

describe('Проверка состояния авторизован ли пользователь', () => {
  beforeEach(() => {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  });

  test('Проверка авторизован ли пользователь c ошибкой', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('some error'));
    // Устанавливаем токены в localStorage и Куки.
    localStorage.setItem('refreshToken', 'refreshTokenTest1');
    setCookie('accessToken', 'accsessTokenTest1');
    await store.dispatch(checkUserAuth());
    const { user } = store.getState();
    expect(user.error).not.toBeUndefined();
  });

  test('Проверка авторизован ли пользователь для незарегистрированного пользователя', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('some error'));
    await store.dispatch(checkUserAuth());
    const { user } = store.getState();
    // Проверяем что ошибки не появились.
    expect(user.error).toBeUndefined();
  });

  test('Проверка обновления токенов', async () => {
    const oldAccessToken = 'accsessTokenTest1';
    global.fetch = jest.fn((url, options): Promise<any> => {
      const headers = new Headers(options?.headers);
      if (
        (url as string).endsWith('/auth/user') &&
        headers.get('authorization') === oldAccessToken
      ) {
        return Promise.reject(new Error('jwt expired'));
      }
      return Promise.resolve({
        json: () => Promise.resolve(response),
        ok: true
      });
    });
    localStorage.setItem('refreshToken', 'refreshTokenTest1');
    setCookie('accessToken', oldAccessToken);
    await store.dispatch(checkUserAuth());
    // Проверяем что ошибки не появились и токены обновились.
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');
    const { user } = store.getState();
    expect(user.error).toBeUndefined();
    expect(refreshToken).toBe(response.refreshToken);
    expect(accessToken).toBe(response.accessToken);
  });
});

describe('Проверка вспомогательных функций', () => {
  test('Проверка обновления данных пользователя', async () => {
    // Сначала авторизуемся
    let state: any;
    // Мок функция для fetch для авторизации.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(response),
          ok: true
        })
    );
    await store.dispatch(
      login({
        email: 'test@example.com',
        password: 'password123'
      })
    );
    // проверяем, что пользователь авторизован
    state = store.getState();
    expect(state.user.user).toEqual(response.user);
    // Теперь обновим данные
    // Мок функция для fetch для обновления данных пользователя.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(updateResponse),
          ok: true
        })
    );
    await store.dispatch(
      setUser({
        name: 'SerTester',
        email: 'test@example.com',
        password: 'password123'
      })
    );
    state = store.getState();
    // убедимся что данные были обновлены
    expect(state.user.user).toEqual(updateResponse.user);
  });

  test('Проверка очистки ошибки', async () => {
    let state: any;
    // Авторизуемся с ошибкой.
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('Ошибка при авторизации'));

    await store.dispatch(
      login({
        email: 'test@example.com',
        password: 'password123'
      })
    );

    state = store.getState();
    // Проверяем, что пользователь не был зарегистрирован и ошибка была обработана.
    expect(state.user.user).toBeNull();
    expect(state.user.error).toEqual('Ошибка при авторизации');

    const newState = userSlice.reducer(state.user, clearUserError());
    // Проверяем, что ошибка была очищена.
    expect(newState.error).toBeUndefined();
  });
});
