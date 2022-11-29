/* eslint-disable no-undef */
describe('vtiot cloudapp', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Visit vtiot cloudapp website', () => {
    cy.contains('User Management');
    cy.contains('I O T');
    cy.contains('M.H.E');
    cy.contains('Dashboard');
    cy.contains('Alert');
  });
});
