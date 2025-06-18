import { selectors } from '../../support/constants';

describe('Базовая манипуляция с ингредиентами', () => {
  // Пред-установка что будет выполниться перед каждым тестом.
  beforeEach(() => {
    cy.initApp();
  });
  it('Ингредиенты загружены и отображаются', () => {
    // Проверяем, что ингредиенты загружены и их больше 1.
    cy.get(`[data-cy=${selectors.ingredient}]`).should(
      'have.length.greaterThan',
      1
    );
  });
  it('Добавление ингредиента', () => {
    // Получаем ингредиенты разделены на списки.
    cy.addIngredients(selectors.ingredients, selectors.ingredient, (item) => {
      // Проверяем, что ингредиент добавлен в бюргере, то-есть его текст появился в блоке бюргера.
      cy.get(`[data-cy=${selectors.burgerConstructor}]`).should(
        'contain',
        item.find(`[data-cy=${selectors.ingredientName}]`).text()
      );
    });
  });
});
