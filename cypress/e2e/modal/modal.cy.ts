describe('Проверка функциональности модального окна', () => {
  beforeEach(() => {
    // Пред-установка перед каждым тестом.
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });
  it('Открытие модального окна ингредиента', () => {
    // Имитируем клик по ингредиенту для открытия модального окна.
    cy.get('[data-cy=ingredient]').first().click();
    // Проверяем, что модальное окно открыто и видимо.
    cy.get('[data-cy=modal]').should('exist').should('be.visible');
  });
  it('Закрытие по клику на крестик', () => {
    cy.get('[data-cy=ingredient]').first().click();
    cy.get('[data-cy=modal]').should('exist').should('be.visible');
    // Имитируем клик по крестику для закрытия модального окна.
    cy.get('[data-cy=modal]').find('button').first().click();
    // Проверяем, что модальное окно закрыто, то-есть не существует.
    cy.get('[data-cy=modal]').should('not.exist');
  });
  it('Закрытие по клику на оверлей', () => {
    cy.get('[data-cy=ingredient]').first().click();
    cy.get('[data-cy=modal]').should('exist').should('be.visible');
    // Имитируем клик по оверлею для закрытия модального окна.
    cy.get('[data-cy=modal]').next().click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});
