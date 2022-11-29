/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/react-in-jsx-scope */

import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom';
import './App.css';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Register from './components/register';
import Dashboard_KRCL from './components/dashboard_KRCL';

const App = () => {
  const user = window.localStorage.getItem('User');
  return (

    <Router>

      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />

        {
          user === 'Admin' ? <Dashboard /> : <Dashboard_KRCL />
        }

      </Switch>

    </Router>

  );
};

export default App;
