import React from 'react';
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';

import HomePage from './HomePage'
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';
import 'jest-canvas-mock';

HTMLCanvasElement.prototype.getContext = () => { 
  // return whatever getContext has to return
};

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
        <HomePage />
      </MemoryRouter>
      </Provider>
    );
  };

describe('HomePage', () => {

    describe('Layout', () => {
      it('shows welcome when user is not logged in', () => {
        const { queryByText } = setup();
        const homePageDiv = queryByText('Welcome');
        expect(homePageDiv).toBeInTheDocument();
      })

      it('shows hello user when user is logged in', () => {
        const { queryByText } = setup(loggedInState);
        const homePageDiv = queryByText('Hello user');
        expect(homePageDiv).toBeInTheDocument();
      })
    })
})

console.warn = () => {}