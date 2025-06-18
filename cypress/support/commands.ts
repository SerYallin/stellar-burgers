/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { selectors, tokens } from './constants';
import Chainable = Cypress.Chainable;

Cypress.Commands.add('initApp', (withAuth?: boolean) => {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  if (withAuth) {
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('PATCH', 'api/auth/user', { fixture: 'user.json' });

    // Устанавливаем токены для авторизации.
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify(tokens.refreshToken)
    );
    // Устанавливаем куки для авторизации.
    cy.setCookie('accessToken', tokens.accessToken);
  }
  cy.viewport(1300, 800);
  cy.visit('/');
});

Cypress.Commands.add(
  'clickContainerButton',
  (wrapperSelector: string, buttonSelector?: string) => {
    return cy
      .get(`[data-cy=${wrapperSelector}]`)
      .find(buttonSelector ? `[data-cy=${buttonSelector}]` : `[type=button]`)
      .first()
      .click();
  }
);

Cypress.Commands.add(
  'addIngredients',
  (
    wrapperSelector: string,
    ingredientSelector: string,
    callback?: (item: JQuery<HTMLElement>) => void
  ) => {
    cy.get(`[data-cy=${wrapperSelector}]`).each(($el) => {
      cy.wrap($el)
        .contains('Добавить')
        .click()
        .then((clickedBtn) => {
          callback?.(clickedBtn.parent(`[data-cy=${ingredientSelector}]`));
        });
    });
  }
);
