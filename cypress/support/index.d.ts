declare namespace Cypress {
  interface Chainable<Subject = any> {
    initApp(withAuth?: boolean): Chainable<void>;
    clickContainerButton(
      selector: string,
      buttonSelector?: string
    ): Chainable<jQuery<HTMLElement>>;
    addIngredients(
      wrapperSelector: string,
      ingredientSelector: string,
      callback?: (item: JQuery<HTMLElement>) => void
    ): Chainable<void>;
  }
}
