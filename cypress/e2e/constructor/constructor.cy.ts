describe('Базовая манипуляция с ингредиентами', () => {
  // Пред-установка что будет выполниться перед каждым тестом.
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });
  it('Ингредиенты загружены и отображаются', () => {
    // Проверяем, что ингредиенты загружены и их больше 1.
    cy.get('[data-cy=ingredient]').should('have.length.greaterThan', 1);
  });
  it('Добавление ингредиента', () => {
    // Получаем ингредиенты разделены на списки.
    cy.get('[data-cy=ingredients-list]').each((list) => {
      // В каждом списке нажимаем на первую кнопку елемента, чтобы добавить.
      cy.wrap(list)
        .contains('Добавить')
        .click()
        .then((element) => {
          // Проверяем, что ингредиент добавлен в бюргере, то-есть его текст появился в блоке бюргера.
          cy.get('[data-cy=burger-constructor]').should(
            'contain',
            element.parent('li').find('.text_type_main-default').text()
          );
        });
    });
  });
});
