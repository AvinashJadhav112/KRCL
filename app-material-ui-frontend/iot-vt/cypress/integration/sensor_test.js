/* eslint-disable no-undef */
describe('vtiot cloudapp', () => {
  beforeEach(() => {
    cy.login();
    cy.contains('I O T').click();
    cy.contains('Model').click();
    cy.get('a[href*="iot_model/iotAddSensorMapping.js').first().click();
  });

  it('Test Sensor Mapping content', () => {
    cy.contains('Add Sensor Mapping');
    cy.contains('Sensor id');
    cy.contains('Dashboard sequence number');
    cy.contains('name');
    cy.contains('min');
    cy.contains('max');
    cy.contains('alertTime');
    cy.contains('formula');
    cy.contains('rawDataType');
    cy.contains('processedDataType');
    cy.contains('unit');
    cy.contains('Alert Criticality');
    cy.contains('Add Sensor');
    cy.contains('Delete Model');
  });
});
