import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TopBar from './TopBar';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';

const loggedInState = {
  id: 1,
  email: 'user@vervetronics.com',
  password: 'FoxyFox@123',
  isLoggedIn: true
}

const defaultState = {
  id: 0,
  email: '',
  password: '',
  isLoggedIn: false
}

const setup = (state = defaultState) => {
  const store = createStore(authReducer, state);
    return render(
      <Provider store={store}>
        <MemoryRouter>
        <TopBar />
      </MemoryRouter>
      </Provider>
    );
  };
  
  describe('TopBar', () => {
    describe('Layout', () => {
      it('has application logo', () => {
        const { container } = setup();
        const image = container.querySelector('img');
        expect(image.src).toContain('http://localhost/vertronics-logo.jpg');
      });
  
      it('has link to home from logo', () => {
        const { container } = setup();
        const image = container.querySelector('img');
        expect(image.parentElement.getAttribute('href')).toBe('/');
      });
  
      it('has link to signup', () => {
        const { queryByText } = setup(loggedInState);
        const signupLink = queryByText('Sign Up');
        expect(signupLink.getAttribute('href')).toBe('/signup');
      });
      it('has link to login', () => {
        const { queryByText } = setup();
        const loginLink = queryByText('Login');
        expect(loginLink.getAttribute('href')).toBe('/login');
      });
      it('has link to logout when user logged in', () => {
        const { queryByText } = setup(loggedInState);
        const logoutLink = queryByText('Logout');
        expect(logoutLink).toBeInTheDocument();
      });
      it('has link to templates when user logged in', () => {
        const { queryByText } = setup(loggedInState);
        const templateLink = queryByText('Templates');
        expect(templateLink).toBeInTheDocument();
      });
      xit('has link to user profile when user logged in', () => {
        const { queryByText } = setup(loggedInState);
        const profileLink = queryByText('My Profile');
        expect(profileLink.getAttribute('href')).toBe('/user@vervetronics.com');
      })
    });

    describe('Interactions', () => {
      it('displays the login link when user clicks logout', () => {
        const { queryByText } = setup(loggedInState);
        const logoutLink = queryByText('Logout');
        fireEvent.click(logoutLink);
        const loginLink = queryByText('Login');
        expect(loginLink).toBeInTheDocument();
      })
      it('displays the login link when user clicks logout', () => {
        const { queryByText } = setup(loggedInState);
        const logoutLink = queryByText('Logout');
        fireEvent.click(logoutLink);
        const loginLink = queryByText('Login');
        expect(loginLink).toBeInTheDocument();
      });
    })
  });