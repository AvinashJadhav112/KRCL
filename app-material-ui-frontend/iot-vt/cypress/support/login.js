/* eslint-disable no-undef */
export default function login(email, password) {
  cy.viewport(1366, 768);
  cy.visit('http://vtiot-cloudapp.nelkinda.com/');
  cy.get('#inputEmail')
    .type(email);
  cy.get('#inputPassword')
    .type(password, { sensitive: true });
  cy.get('.btn').contains('Login').click();
}
