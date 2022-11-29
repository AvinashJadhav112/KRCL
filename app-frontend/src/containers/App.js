import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserSignupPage from '../pages/UserSignupPage';
import UserPage from '../pages/UserPage';
import TopBar from '../components/TopBar';
import Templates from '../pages/Templates'


function App() {
  return (
    <div>
      <TopBar />
      <div className="container">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage}/>
          <Route path="/signup" component={UserSignupPage}/>
          <Route path="/templates" component={Templates}/>
          <Route path="/:email" component={UserPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
