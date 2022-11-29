import React from 'react';
import { 
    render, 
    fireEvent, 
    waitFor,
    waitForElementToBeRemoved 
} from '@testing-library/react';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
    describe('Layout', () => {
        it('has header of Login', () => {
            const { container } = render(<LoginPage />);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Login');
        });
        it('has input for email', () => {
            const { queryByPlaceholderText } = render(<LoginPage />);
            const emailInput = queryByPlaceholderText('Your email');
            expect(emailInput).toBeInTheDocument();
        });
        it('has input for password', () => {
            const { queryByPlaceholderText } = render(<LoginPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        });
      
        it('has password type for password input', () => {
            const { queryByPlaceholderText } = render(<LoginPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');
        });
        it('has login button', () => {
            const { container } = render(<LoginPage />);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });      
    })
    describe('Interactions', () => {
        const changeEvent = (content) => {
          return {
            target: {
              value: content
            }
          };
        };

        const mockAsyncDelayed = () => {
            return jest.fn().mockImplementation(() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve({});
                }, 300);
              });
            });
        };

        let emailInput, passwordInput, button;

        const setupForSubmit = (props) => {
          const rendered = render(<LoginPage {...props} />);
    
          const { container, queryByPlaceholderText } = rendered;
    
          emailInput = queryByPlaceholderText('Your email');
          fireEvent.change(emailInput, changeEvent('my-email'));
          passwordInput = queryByPlaceholderText('Your password');
          fireEvent.change(passwordInput, changeEvent('P4ssword'));
          button = container.querySelector('button');
    
          return rendered;
        };
    
        it('sets the email value into state', () => {
          const { queryByPlaceholderText } = render(<LoginPage />);
          const emailInput = queryByPlaceholderText('Your email');
          fireEvent.change(emailInput, changeEvent('my-email'));
          expect(emailInput).toHaveValue('my-email');
        });
        it('sets the password value into state', () => {
          const { queryByPlaceholderText } = render(<LoginPage />);
          const passwordInput = queryByPlaceholderText('Your password');
          fireEvent.change(passwordInput, changeEvent('P4ssword'));
          expect(passwordInput).toHaveValue('P4ssword');
        });

        it('calls postLogin when the actions are provided in props and input fields have value', () => {
            const actions = {
              postLogin: jest.fn().mockResolvedValue({})
            };
            setupForSubmit({ actions });
            fireEvent.click(button);
            expect(actions.postLogin).toHaveBeenCalledTimes(1);
        });

        it('does not throw exception when clicking the button when actions not provided in props', () => {
            setupForSubmit();
            expect(() => fireEvent.click(button)).not.toThrow();
        });

        it('calls postLogin with credentials in body', () => {
            const actions = {
              postLogin: jest.fn().mockResolvedValue({})
            };
            setupForSubmit({ actions });
            fireEvent.click(button);
      
            const expectedUserObject = {
              email: 'my-email',
              password: 'P4ssword'
            };
      
            expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject);
        });

        it('enables the button when email and password is not empty', () => {
            setupForSubmit();
            expect(button).not.toBeDisabled();
        });

        it('disables the button when email is empty', () => {
            setupForSubmit();
            fireEvent.change(emailInput, changeEvent(''));
            expect(button).toBeDisabled();
        });

        it('disables the button when password is empty', () => {
            setupForSubmit();
            fireEvent.change(passwordInput, changeEvent(''));
            expect(button).toBeDisabled();
        });

        it('displays alert when login fails', async () => {
            const actions = {
              postLogin: jest.fn().mockRejectedValue({
                response: {
                  data: {
                    message: 'Login failed'
                  }
                }
              })
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
      
            await waitFor(() => queryByText('Login failed'));
            const alert = queryByText('Login failed')
            expect(alert).toBeInTheDocument();
        });

        it('clears alert when user changes email', async () => {
            const actions = {
              postLogin: jest.fn().mockRejectedValue({
                response: {
                  data: {
                    message: 'Login failed'
                  }
                }
              })
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
      
            await waitFor(() => queryByText('Login failed'));
            fireEvent.change(emailInput, changeEvent('updated email'));
      
            const alert = queryByText('Login failed');
            expect(alert).not.toBeInTheDocument();
        });

        it('clears alert when user changes password', async () => {
            const actions = {
              postLogin: jest.fn().mockRejectedValue({
                response: {
                  data: {
                    message: 'Login failed'
                  }
                }
              })
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
      
            await waitFor(() => queryByText('Login failed'));
            fireEvent.change(passwordInput, changeEvent('updated-P4ssword'));
      
            const alert = queryByText('Login failed');
            expect(alert).not.toBeInTheDocument();
        });

        it('does not allow user to click the Login button when there is an ongoing api call', () => {
            const actions = {
              postLogin: mockAsyncDelayed()
            };
            setupForSubmit({ actions });
            fireEvent.click(button);
      
            fireEvent.click(button);
            expect(actions.postLogin).toHaveBeenCalledTimes(1);
        });

        it('displays spinner when there is an ongoing api call', () => {
            const actions = {
              postLogin: mockAsyncDelayed()
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
      
            const spinner = queryByText('Loading...');
            expect(spinner).toBeInTheDocument();
          });

          it('hides spinner after api call finishes successfully', async () => {
            const actions = {
              postLogin: mockAsyncDelayed()
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
      
            await waitForElementToBeRemoved(() => queryByText('Loading...'))      
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
          });
          it('hides spinner after api call finishes with error', async () => {
            const actions = {
              postLogin: jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    reject({
                      response: { data: {} }
                    });
                  }, 300);
                });
              })
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
             // this can be used
            await waitForElementToBeRemoved(() => queryByText('Loading...'))
 
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });

        it('redirects to homePage after successful login', async () => {
          const actions = {
            postLogin: jest.fn().mockResolvedValue({})
          };
          const history = {
            push: jest.fn()
          };
          setupForSubmit({ actions, history });
          fireEvent.click(button);
    
          await waitFor(() => expect(history.push).toHaveBeenCalledWith('/'));
    
          
        });

      });
})

// TODO remove it once we fix the unmount issue
console.error = () => {}