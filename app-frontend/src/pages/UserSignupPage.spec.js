import React from 'react';
import { 
    render, 
    cleanup, 
    fireEvent, 
    waitFor,
    waitForElementToBeRemoved,
    findByText
} from '@testing-library/react';
import { UserSignupPage } from './UserSignupPage'

const headerSignUp = 'Sign Up';

const emailPlaceHolder = 'Enter Email';
const passwordPlaceHolder = 'Enter Password';
const repeatPasswordPlaceHolder = 'Enter Password Again';

const emailText = 'user-email';
const passwordText = 'P4ssword';

describe('UserSignupPage', () => {

    describe('Layout', () => {
        
        it('has header of Sign Up', () => {
            const { container } = render(<UserSignupPage />);
            const header = container.querySelector('div');
            expect(header).toHaveTextContent(headerSignUp);
        });
        it('has input for email', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const emailInput = queryByPlaceholderText(emailPlaceHolder);
            expect(emailInput).toBeInTheDocument();
        });
        it('has input for password', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText(passwordPlaceHolder);
            expect(passwordInput).toBeInTheDocument();
        });
        it('has input for repeat password', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const repeatPasswordInput = queryByPlaceholderText(repeatPasswordPlaceHolder);
            expect(repeatPasswordInput).toBeInTheDocument();
        });
        it('has password type for password input', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText(passwordPlaceHolder);
            expect(passwordInput.type).toBe('password');
        });
        it('has password type for repeat password input', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const repeatPasswordInput = queryByPlaceholderText(repeatPasswordPlaceHolder);
            expect(repeatPasswordInput.type).toBe('password');
        });
        it('has Enroll User button', () => {
            const { container } = render(<UserSignupPage />);
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
            }
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

        let button, emailInput, passwordInput, repeatPasswordInput;

        const setupForSubmit = (props) => {
            const rendered = render(
                <UserSignupPage {...props}/>
            )

            const { container, queryByPlaceholderText } = rendered;

            emailInput = queryByPlaceholderText(emailPlaceHolder);
            passwordInput = queryByPlaceholderText(passwordPlaceHolder);
            repeatPasswordInput = queryByPlaceholderText(repeatPasswordPlaceHolder);

            fireEvent.change(emailInput, changeEvent(emailText));
            fireEvent.change(passwordInput, changeEvent(passwordText));
            fireEvent.change(repeatPasswordInput, changeEvent(passwordText));

            button = container.querySelector('button');
            return rendered;        
        }


        it('sets the email value into the state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const emailInput = queryByPlaceholderText(emailPlaceHolder);

            fireEvent.change(emailInput, changeEvent(emailText));
            expect(emailInput).toHaveValue(emailText);
        })
        it('sets the password value into the state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText(passwordPlaceHolder);

            fireEvent.change(passwordInput, changeEvent(passwordText));
            expect(passwordInput).toHaveValue(passwordText);
        })
        it('sets the repeat password value into the state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const repeatPasswordInput = queryByPlaceholderText(repeatPasswordPlaceHolder);

            fireEvent.change(repeatPasswordInput, changeEvent(passwordText));
            expect(repeatPasswordInput).toHaveValue(passwordText);
        })
        it('calls postSignup when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({ actions });
            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        })
        it('does not throw exception after the button is clicked when no actions are provided', () => {
            const { container, queryByPlaceholderText } = setupForSubmit()
            expect(() => fireEvent.click(button)).not.toThrow();
        })
        it('calls with user body when the fields are valid', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({ actions });
            fireEvent.click(button);
            const expectedUserObject = {
                email:emailText,
                password: passwordText,
            }
            expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
        })
        // The api calls still happen after the component is unmounted, and hence
        // we get the error. The tutorial is going to use redux, but other solution is 
        // that we can cancel the api call before the component is unmounted.
        it('does not allow user to click the Sign up button when there is ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            };
            setupForSubmit({ actions });
            fireEvent.click(button);
            fireEvent.click(button);

            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        })
        it('displays spinner when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            const spinner = queryByText('Loading...')
            expect(spinner).toBeInTheDocument();
        })

        it('hides spinner after api call finishes successfully', async () => {
            const actions = {
              postSignup: mockAsyncDelayed()
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
            
            await waitForElementToBeRemoved(() => queryByText('Loading...'))
 
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });
        it('hides spinner after api call finishes with error', async () => {
            const actions = {
              postSignup: jest.fn().mockImplementation(() => {
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
        it('displays validation error for email when error is received for the field', async () => {
            const actions = {
              postSignup: jest.fn().mockRejectedValue({
                response: {
                  data: {
                    validationErrors: {
                      email: 'Cannot be null'
                    }
                  }
                }
              })
            }
            const { findByText } = setupForSubmit({ actions });
            fireEvent.click(button);
 
            const errorMessage = await findByText('Cannot be null');
            expect(errorMessage).toBeInTheDocument();      
        })
        it('enables the signup button when password and repeat password have same value', () => {
            setupForSubmit();
            expect(button).not.toBeDisabled();
        });
        it('disables the signup button when password repeat does not match to password', () => {
            setupForSubmit();
            fireEvent.change(repeatPasswordInput, changeEvent('new-pass'));
            expect(button).toBeDisabled();
        });
        it('disables the signup button when password does not match to password repeat', () => {
            setupForSubmit();
            fireEvent.change(passwordInput, changeEvent('new-pass'));
            expect(button).toBeDisabled();
        });
        it('displays error style for password repeat input when password repeat mismatch', () => {
            const { queryByText } = setupForSubmit();
            fireEvent.change(repeatPasswordInput, changeEvent('new-pass'));
            const mismatchWarning = queryByText('Does not match to password');
            expect(mismatchWarning).toBeInTheDocument();
        });
        it('displays error style for password repeat input when password input mismatch', () => {
            const { queryByText } = setupForSubmit();
            fireEvent.change(passwordInput, changeEvent('new-pass'));
            const mismatchWarning = queryByText('Does not match to password');
            expect(mismatchWarning).toBeInTheDocument();
        });
        it('hides the validation error when user changes the content of email', async () => {
            const actions = {
              postSignup: jest.fn().mockRejectedValue({
                response: {
                  data: {
                    validationErrors: {
                      email: 'Cannot be null'
                    }
                  }
                }
              })
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
      
            await waitFor(() => queryByText('Cannot be null'));
            fireEvent.change(emailInput, changeEvent('name updated'));
      
            const errorMessage = queryByText('Cannot be null');
            expect(errorMessage).not.toBeInTheDocument();
        });
        it('hides the validation error when user changes the content of password', async () => {
          const actions = {
            postSignup: jest.fn().mockRejectedValue({
              response: {
                data: {
                  validationErrors: {
                    password: 'Cannot be null'
                  }
                }
              }
            })
          };
          const { queryByText } = setupForSubmit({ actions });
          fireEvent.click(button);
    
          await waitFor(() => queryByText('Cannot be null'));
          fireEvent.change(passwordInput, changeEvent('updated-password'));
    
          const errorMessage = queryByText('Cannot be null');
          expect(errorMessage).not.toBeInTheDocument();
        });

        it('redirects to homePage after successful signup', async () => {
          const actions = {
            postSignup: jest.fn().mockResolvedValue({})
          };
          const history = {
            push: jest.fn()
          };
          setupForSubmit({ actions, history });
          fireEvent.click(button);
    
          await waitFor(() => expect(history.push).toHaveBeenCalledWith('/'));          
        });
    });
});

// TODO remove it once we fix the unmount issue
console.error = () => {}