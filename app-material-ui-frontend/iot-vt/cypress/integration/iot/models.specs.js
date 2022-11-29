/* eslint-disable no-undef */
describe('Test IOT Model', () => {
  beforeEach(() => {
    cy.login();
  });

  context('When the page is open', () => {
    beforeEach(() => {
      getModelsWithData([]);
    });

    it('should display "Add Model" button', () => {
      cy.contains('IOT Model');
    });
  });

  context('When there is IOT Model in response', () => {
    beforeEach(() => {
      getModelsWithData([]);
    });
    it('should not display any IOT Model data', () => {
      cy.get('[data-id]').should('have.length', 0);
    });
  });
});

function getModelsWithData(data) {
  cy.intercept('GET', 'http://vtiot-cloudapp.nelkinda.com/api/1.0/iotModels', data).as('getIotModels');
  cy.contains('I O T').click();
  cy.contains('Model').click();
  cy.wait('@getIotModels');
}
