import { expect, test, jest } from '@jest/globals';
import { getIngredients } from '@slices';
import store from '../../store';

const expectedResult = {
  success: true,
  data: [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0944',
      name: 'Соус традиционный галактический',
      type: 'sauce',
      proteins: 42,
      fat: 24,
      carbohydrates: 42,
      calories: 99,
      price: 15,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa094a',
      name: 'Сыр с астероидной плесенью',
      type: 'main',
      proteins: 84,
      fat: 48,
      carbohydrates: 420,
      calories: 3377,
      price: 4142,
      image: 'https://code.s3.yandex.net/react/code/cheese.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/cheese-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/cheese-large.png',
      __v: 0
    }
  ]
};

describe('Тестирование загрузки ингредиентов', () => {
  test('Проверка pending загрузки ингредиентов', async () => {
    // Вызываем экшн для загрузки ингредиентов со статусом pending.
    await store.dispatch({
      type: 'ingredients/get/pending',
      payload: null
    });
    // Получаем состояние стора и проверяем, что ожидаемый результат соответствует полученному.
    const { ingridients } = store.getState();
    expect(ingridients?.ingredients).toEqual([]);
    expect(ingridients?.isLoading).toBeTruthy();
    expect(ingridients?.isError).toBeFalsy();
  });
  test('Проверка ошибки загрузки ингредиентов', async () => {
    // Создаем мок-функцию для fetch, который возвращает reject.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(expectedResult),
          ok: false
        })
    );
    // Dиспатчим экшн для загрузки ингредиентов.
    await store.dispatch(getIngredients());
    const { ingridients } = store.getState();
    //Проверяем, что данные не были загружены и есть ошибка.
    expect(ingridients?.ingredients).toEqual([]);
    expect(ingridients?.isLoading).toBeFalsy();
    expect(ingridients?.isError).toBeTruthy();
  });
  test('Проверка загрузки ингредиентов', async () => {
    // Создаем мок-функцию для fetch, который возвращает ожидаемый результат.
    global.fetch = jest.fn(
      (): Promise<any> =>
        Promise.resolve({
          json: () => Promise.resolve(expectedResult),
          ok: true
        })
    );
    // Вызываем экшн для загрузки ингредиентов.
    await store.dispatch(getIngredients());
    // Получаем состояние стора и проверяем, что ожидаемый результат соответствует полученному.
    const { ingridients } = store.getState();
    // Проверяем, что количество ингредиентов равно большему, чем 0, то-есть что данные были загружены.
    expect(ingridients?.ingredients.length).toBeGreaterThan(0);
    // Проверяем, что загрузка завершена и нет ошибок.
    expect(ingridients?.isLoading).toBeFalsy();
    expect(ingridients?.isError).toBeFalsy();
  });
});
