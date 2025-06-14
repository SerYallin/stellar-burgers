describe('Проверка создания заказа.', () => {
  beforeEach(() => {
    // Перехватываем обращения к запросам.
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('PATCH', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'orderRequest'
    );
    // Устанавливаем токены для авторизации.
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify(
        'fc43c73779c09bcb7c787f811a1451a50456a2d65740503062f49e0e08171c29670bcc5ce86a0dd1'
      )
    );
    // Устанавливаем куки для авторизации.
    cy.setCookie(
      'accessToken',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDgwNTUxYzJmMzBjMDAxY2IyYjUzZSIsImlhdCI6MTc0OTU1MDQxNywiZXhwIjoxNzQ5NTUxNjE3fQ.Htp7eikfFHzGyS0vL4GcIdnnka3iVzbbB2jhay1rCis'
    );
    cy.viewport(1300, 800);
    cy.visit('/');
  });
  afterEach(function () {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it('Собирается бургер', () => {
    // Собираем бургер с каждого первого элемента из списков с ингредиентами.
    cy.get('[data-cy=ingredients-list]').each((list) => {
      cy.wrap(list)
        .contains('Добавить')
        .click()
        .then((element) => {
          cy.get('[data-cy=burger-constructor]').should(
            'contain',
            element.parent('li').find('.text_type_main-default').text()
          );
        });
    });
    // Имитируем клик по кнопке "Оформить заказ".
    cy.get('[data-cy=burger-constructor]').contains('Оформить заказ').click();
    // Проверяем, что появилось модальное окно.
    cy.get('[data-cy=modal]').should('exist').should('be.visible');
    // Ожидаем, пока запрос на создание заказа будет выполнен.
    cy.wait('@orderRequest').then((xhr) => {
      // Проверяем, что в модальном окне отображается номер заказа.
      cy.get('[data-cy=modal]').should(
        'contain',
        xhr.response?.body.order.number
      );
      // Имитируем клик по кнопке "Закрыть".
      cy.get('[data-cy=modal]').find('button').first().click();
      // Проверяем, что модальное окно закрылось.
      cy.get('[data-cy=modal]').should('not.exist');

      // Проверяем, что в конструкторе нет ингредиентов и отображается стандартное сообщение.
      cy.get('[data-cy=burger-constructor]')
        .should('contain', 'Выберите булки')
        .should('contain', 'Выберите начинку');
    });
  });
});
