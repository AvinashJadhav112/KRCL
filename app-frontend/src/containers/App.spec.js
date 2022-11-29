import React from 'react';
import { render, fireEvent, waitFor, waitForDomChange } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux'
import axios from 'axios';
import configureStore from '../redux/configureStore';

beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
})

const setup = (path) => {
  const store = configureStore(false);
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
      </Provider>
    );
  };

describe('App', () => {
    it('displays homepage when url is /', () => {
        const { queryByText } = setup('/');
        expect(queryByText('Welcome')).toBeInTheDocument();
    });
    
    it('displays LoginPage when url is /login', () => {
        const { container } = setup('/login');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
    });

    it('displays LoginPage when url is /templates', () => {
      const { container } = setup('/templates');
      const header = container.querySelector('h1');
      expect(header).toHaveTextContent('Templates');
  });

    it('displays only LoginPage when url is /login', () => {
        const { queryByTestId } = setup('/login');
        expect(queryByTestId('homepage')).not.toBeInTheDocument();
    });

    it('displays UserSignupPage when url is /signup', () => {
        const { container } = setup('/signup');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');
    });

    it('displays userpage when url is other than /, /login or /signup', () => {
        const { queryByTestId } = setup('/user1');
        expect(queryByTestId('userpage')).toBeInTheDocument();
    });

    it('displays topBar when url is /', () => {
        const { container } = setup('/');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
      });
      it('displays topBar when url is /login', () => {
        const { container } = setup('/login');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
      });
      it('displays topBar when url is /signup', () => {
        const { container } = setup('/signup');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
      });
      it('displays topBar when url is /user1', () => {
        const { container } = setup('/user1');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
      });

      it('displays topBar when url is /templates', () => {
        const { container } = setup('/templates');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
      });
    
      xit('shows the UserSignupPage when clicking signup', () => {
        const { queryByText, container } = setup('/');
        const signupLink = queryByText('Sign Up');
        fireEvent.click(signupLink);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');
      });
      it('shows the LoginPage when clicking login', () => {
        const { queryByText, container } = setup('/');
        const loginLink = queryByText('Login');
        fireEvent.click(loginLink);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
      });
    
      it('shows the HomePage when clicking the logo', () => {
        const { queryByText, container } = setup('/login');
        const logo = container.querySelector('img');
        fireEvent.click(logo);
        expect(queryByText('Welcome')).toBeInTheDocument();
      });
      it('displays Logout on Topbar after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login')
        const changeEvent = (content) => {
          return {
            target: {
              value: content
            }
          };
        };
        const emailInput = queryByPlaceholderText('Your email');
        fireEvent.change(emailInput, changeEvent('my-email'));
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        const button = container.querySelector('button');

        axios.post = jest.fn().mockResolvedValue({
          data: {
            id: 1,
            email: 'my-email'
          }
        })

        fireEvent.click(button);
        
        // TODO add similar test for Templates

        await waitFor(() => expect(queryByText('Logout').toBeInTheDocument))
      })

      it('saves logged in user data to localStorage after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login')
        const changeEvent = (content) => {
          return {
            target: {
              value: content
            }
          };
        };
        const emailInput = queryByPlaceholderText('Your email');
        fireEvent.change(emailInput, changeEvent('my-email'));
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        const button = container.querySelector('button');

        axios.post = jest.fn().mockResolvedValue({
          data: {
            id: 1,
            email: 'my-email'
          }
        })

        fireEvent.click(button);

        await waitFor(() => queryByText('Logout'))
        const dataInStorage = JSON.parse(localStorage.getItem('user-auth'));
        expect (dataInStorage).toEqual({
          id: 1,
          email: 'my-email',
          password: 'P4ssword',
          isLoggedIn: true
        })
      })

      it('displays logged in topBar when storage has logged in user data', () => {
        localStorage.setItem(
          'user-auth',
          JSON.stringify({
            id: 1,
            email: 'my-email',
            password: 'P4ssword',
            isLoggedIn: true
          })
        );
        const { queryByText } = setup('/');
        const logoutLink = queryByText('Logout');
        expect(logoutLink).toBeInTheDocument();
      })

      xit('sets axios authorization wiht base64 encoded user credentials after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login')
        const changeEvent = (content) => {
          return {
            target: {
              value: content
            }
          };
        };
        const emailInput = queryByPlaceholderText('Your email');
        fireEvent.change(emailInput, changeEvent('my-email'));
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        const button = container.querySelector('button');

        axios.post = jest.fn().mockResolvedValue({
          data: {
            id: 1,
            email: 'my-email'
          }
        })

        fireEvent.click(button);

        await waitFor(() => queryByText('Logout'))
        const axiosAuthorization = axios.defaults.headers.common['Authorization'];

        const encoded = btoa('my-email:P4ssword');
        const expectedAuthorization = `Basic ${encoded}`;
        expect(axiosAuthorization).toBe(expectedAuthorization);

      })

      xit('sets axios authorization wiht base64 encoded user credentials when storage has logged in user data', () => {
        localStorage.setItem(
          'user-auth',
          JSON.stringify({
            id: 1,
            email: 'my-email',
            password: 'P4ssword',
            isLoggedIn: true
          })
        );
        setup('/');
        const axiosAuthorization = axios.defaults.headers.common['Authorization'];

        const encoded = btoa('my-email:P4ssword');
        const expectedAuthorization = `Basic ${encoded}`;
        expect(axiosAuthorization).toBe(expectedAuthorization);
      })

      it('removes axios authorization header when user logout', () => {
        localStorage.setItem(
          'user-auth',
          JSON.stringify({
            id: 1,
            email: 'my-email',
            password: 'P4ssword',
            isLoggedIn: true
          })
        );
        const { queryByText } = setup('/');
        fireEvent.click(queryByText('Logout'));

        const axiosAuthorization = axios.defaults.headers.common['Authorization'];
        expect(axiosAuthorization).toBeFalsy();
      })
})

console.warn = () => {}
