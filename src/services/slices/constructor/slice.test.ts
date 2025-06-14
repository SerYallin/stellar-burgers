import { expect, test, describe } from '@jest/globals';
import {
  addBun,
  addIngredient,
  constructorSlice,
  deleteIngredient,
  moveDownIngredient,
  moveUpIngredient,
  resetConstructor,
  TConstructorState
} from '@slices';
import { TIngredient } from '@utils-types';

const initState: TConstructorState = {
  bun: null,
  ingredients: [
    {
      _id: '643d69a5c3f7b9001cfa0940',
      id: '643d69a5c3f7b9001cfa0940',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0944',
      id: '643d69a5c3f7b9001cfa0944',
      name: 'Соус традиционный галактический',
      type: 'sauce',
      proteins: 42,
      fat: 24,
      carbohydrates: 42,
      calories: 99,
      price: 15,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
    }
  ]
};

const ingredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};
const bun: TIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

describe('Проверка конструктора', () => {
  describe('Проверка добавления ингредиента', () => {
    test('Проверка добавления начинки', () => {
      const state = constructorSlice.reducer(
        initState,
        addIngredient(ingredient)
      );

      // Сравниваем полученный и ожидаемый результат.
      expect(state.ingredients).toEqual([
        ...initState.ingredients,
        { ...ingredient, id: expect.any(String) }
      ]);
      // Проверяем, что булка не добавилась.
      expect(state.bun).toBeNull();
    });

    test('Проверка добавления булки', () => {
      const state = constructorSlice.reducer(initState, addBun(bun));

      // Начинка не должна меняться
      expect(state.ingredients).toHaveLength(initState.ingredients.length);
      // Сравниваем полученный и ожидаемый результат булки.
      expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
    });
  });
  describe('Проверка удаления ингредиента', () => {
    beforeAll(() => {
      // Тестирование будет проводиться с добавленной булкой и начинкой.
      initState.bun = { ...bun, id: 'bun' };
    });
    afterAll(() => {
      // Очищаем добавленную булку.
      initState.bun = null;
    });

    test('Проверка удаления начинки', () => {
      const state = constructorSlice.reducer(
        initState,
        deleteIngredient('643d69a5c3f7b9001cfa0944')
      );
      // Длина массива ингредиентов должна уменьшиться на 1.
      expect(state.ingredients).toHaveLength(initState.ingredients.length - 1);
      // Проверяем, что булка не удалилась.
      expect(state.bun).toEqual(initState.bun);
    });

    // Булку мы не можем удалить, поэтому тестируем ее замену.
    test('Проверка замены булки', () => {
      const state = constructorSlice.reducer(initState, addBun(bun));
      // При добавлении ингредиента у него генерируется id, поэтому проверяем, что у новой булки новый id.
      expect(state.bun?.id).not.toEqual(initState.bun?.id);
    });
  });

  test('Изменения порядка ингредиентов в начинке', () => {
    // Второй ингредиент поместили на верх.
    let state = constructorSlice.reducer(initState, moveUpIngredient(1));

    //Проверяем, что ингредиенты поменялись местами.
    expect(state.ingredients[0]).toEqual(initState.ingredients[1]);
    expect(state.ingredients[1]).toEqual(initState.ingredients[0]);

    // Первый ингредиент поместили вниз.
    state = constructorSlice.reducer(initState, moveDownIngredient(0));

    //Проверяем, что ингредиенты поменялись.
    expect(state.ingredients[0]).toEqual(initState.ingredients[1]);
    expect(state.ingredients[1]).toEqual(initState.ingredients[0]);
  });

  test('Проверка очистки списка ингредиентов в конструкторе', () => {
    // Заполним изначальный список ингредиентов с булкой и начинками.
    initState.bun = { ...bun, id: 'bun' };
    // Убедимся в том, что список ингредиентов и булка не пустые.
    expect(initState.ingredients.length).toBeGreaterThan(0);
    expect(initState.bun).not.toBeNull();
    // Очистим список ингредиентов.
    const state = constructorSlice.reducer(initState, resetConstructor());
    // Проверяем, что список ингредиентов и булка пустые.
    expect(state.ingredients).toHaveLength(0);
    expect(state.bun).toBeNull();
  });
});
