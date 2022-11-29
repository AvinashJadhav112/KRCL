/* eslint-disable no-undef */
describe('Test IOT Device', () => {
  beforeEach(() => {
    cy.login();
    cy.contains('I O T').click();
    cy.contains('Device').click();
  });

  context('When the page is open', () => {
    it('should display "IOT Device" title', () => {
      cy.contains('IOT Devices');
    });
    it('should display "ADD NEW" button', () => {
      cy
        .get('.MuiButton-label')
        .contains('ADD NEW', { matchCase: false });
    });
  });

  context('When fetching all IOT Devices', () => {
    it('should display all IOT Devices', () => {
      cy
        .request('GET', 'http://vtiot-cloudapp.nelkinda.com/api/1.0/devices')
        .then((response) => {
          expect(response).to.have.property('headers');
          expect(response.status).to.eq(200);
          const iotDevices = response.body;

          iotDevices.forEach((iotDevice) => {
            cy
              .get('[data-field="deviceName"]')
              .contains(`${iotDevice.deviceName}`);
          });
        });
    });
  });

  context('When adding new device', () => {
    beforeEach(() => {
      cy
        .get('.MuiButton-label')
        .contains('ADD NEW', { matchCase: false })
        .click();
    });

    it('should display Add new sensor input fields', () => {
      cy.contains('Add New Devices');
      cy.contains('Device Name');
      cy.contains('Device Serial Number');
      cy.contains('Manufacturing Date');
      cy.contains('Model Name');
      cy.contains('Select Firmware');
      cy.contains('Submit');
    });

    it('should add new device', () => {
      cy.get('.form-row').within(() => {
        cy.get(':nth-child(7) > .form-control').type('Car');
        cy.get(':nth-child(8) > .form-control').type('1234567890');
        cy.get(':nth-child(9) > .form-control').type('2020-01-01');
        cy.get('.css-1hwfws3').click();
        cy.get('#react-select-2-option-1').click();
        // cy.get('#react-select-control')
        //   .first()
        //   .click();
        cy.get(':nth-child(11) > .form-control').select('Aether');
      });
      cy.get('#add-device').click();

      cy
        .request('DELETE', 'http://vtiot-cloudapp.nelkinda.com/api/1.0/devices/Car')
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });
  });
});
