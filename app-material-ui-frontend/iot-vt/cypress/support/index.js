/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import login from './login';

Cypress.Commands.overwrite('type', (originalFunction, element, text, options) => {
  if (options && options.sensitive) {
    options.log = false;
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(8),
    });
  }
  return originalFunction(element, text, options);
});

const email = 'cloud.team@vervetronics.com';
const password = 'cloud.team@123';
Cypress.Commands.add('login', () => login(email, password));
