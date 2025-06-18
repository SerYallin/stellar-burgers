import { selectors } from '../../support/constants';

describe('Проверка создания заказа.', () => {
  beforeEach(() => {
    // Перехватываем обращения к запросам.
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'orderRequest'
    );
    cy.initApp(true);
  });
  afterEach(function () {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it('Собирается бургер', () => {
    // Собираем бургер с каждого первого элемента из списков с ингредиентами.
    cy.addIngredients(selectors.ingredients, selectors.ingredient, (item) => {
      // Проверяем, что ингредиент добавился в конструктор бургера
      cy.get(`[data-cy=${selectors.burgerConstructor}]`).should(
        'contain',
        item.find(`[data-cy=${selectors.ingredientName}]`).text()
      );
    });
    // Имитируем клик по кнопке "Оформить заказ".
    cy.clickContainerButton(selectors.burgerConstructor);
    // Проверяем, что появилось модальное окно.
    cy.get(`[data-cy=${selectors.modal}]`).should('exist').should('be.visible');
    // Ожидаем, пока запрос на создание заказа будет выполнен.
    cy.wait('@orderRequest').then((xhr) => {
      // Проверяем, что в модальном окне отображается номер заказа.
      cy.get(`[data-cy=${selectors.modal}]`).should(
        'contain',
        xhr.response?.body.order.number
      );
      // Имитируем клик по кнопке "Закрыть".
      cy.clickContainerButton(selectors.modal, selectors.closeModalButton);
      // Проверяем, что модальное окно закрылось.
      cy.get(`[data-cy=${selectors.modal}]`).should('not.exist');

      // Проверяем, что в конструкторе нет ингредиентов и отображается стандартное сообщение.
      cy.get(`[data-cy=${selectors.burgerConstructor}]`)
        .should('contain', 'Выберите булки')
        .should('contain', 'Выберите начинку');
    });
  });
});
