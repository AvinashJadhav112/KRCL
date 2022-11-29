/* eslint-disable no-undef */
describe('vtiot cloudapp', () => {
  beforeEach(() => {
    cy.login();
    cy.contains('I O T').click();
  });

  it('Test IOT dropdown elements', () => {
    cy.contains('Model');
    cy.contains('Device');
    cy.contains('Configuration');
    cy.contains('Firmware');
  });
  it('GET iotModels', () => {
    const iotModel = { iotModelName: 'Test Template' };
    cy
      .request('POST', 'http://vtiot-cloudapp.nelkinda.com/api/1.0/iotModels', iotModel)
      .then((response) => {
        expect(response.status).to.eq(201);
      });

    cy.contains('Model').click();

    cy
      .request('GET', 'http://vtiot-cloudapp.nelkinda.com/api/1.0/iotModels')
      .then((response) => {
        const iotModels = response.body;

        iotModels.forEach((iotModel) => cy.contains(`${iotModel.iotModelName}`));
      });
    cy
      .request('DELETE', 'http://vtiot-cloudapp.nelkinda.com/api/1.0/iotModels/Test%20Template')
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('POST iotModels', () => {
    cy.contains('Model').click();
    cy.contains('Add New').click();
    cy.get('[id="title"]').type('Test Crane Template');
    cy.contains('Add Model').click();
    cy.contains('I O T').click();
    cy.contains('Model').click();
    cy.contains('Test Crane Template');
    cy
      .request('DELETE', 'http://vtiot-cloudapp.nelkinda.com/api/1.0/iotModels/Test%20Crane%20Template')
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });
});
