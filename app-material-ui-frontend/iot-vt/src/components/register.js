/* eslint-disable brace-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unreachable */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import '../App.css';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const validate = () => {
    let errorMessage = '';
    if (email === '') {
      errorMessage = 'Enter email';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(email)) {
      errorMessage = 'Please enter mail id in correct format';
    }

    if (password === '') {
      errorMessage = 'Enter password';
    } else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(password)) {
      errorMessage = 'Please enter password in correct format';
    }
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return false;
    }
    return true;
  };

  const handleError = (error) => {
    if (error.result && error.result.status === 409) {
      alert('There is already a device present with same name');
    } else if (error.result && error.result.status === 404) {
      alert('User not found');
    } else if (error.result && error.result.status === 500) {
      alert('Internal server error');
    } else if (error.result && error.result.status === 400) {
      alert('Bad Request');
    } else if (error.result && error.result.status === 403) {
      alert('Forbidden');
    }
  };

  const saveUser = () => {
    const isValid = validate();
    if (isValid) {
      const data = {
        email,
        password,
      };

      console.warn(email, password);
      fetch('http://192.168.0.194:5005/api/1.0/users', {
        method: 'POST',
        headers: {
          Authorization: 'Basic YWRtaW5AdmVydmV0cm9uaWNzLmNvbTpWZXJ2ZUFkbWluQDEyMw==',
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((result) => {
        console.warn('result', result);
        console.log(result);
        console.log(result.status);

        localStorage.setItem('Basic', JSON.stringify(result));
        if (result.status === 200 || result.status === 201) {
          alert('Registered successfully..');
          history.push('/');
          window.location.reload();
        } else if (result.status === 500) {
          alert('Internal server error');
        } else if (result.status === 400) {
          alert('Bad Request');
        } else if (result.status === 403) {
          alert('Forbidden');
        } else if (result.status === 404) {
          alert('User not found');
        } else if (result.status === 409) {
          alert('There is already a user present with same name');
        }
        else {
          alert('invalid credentials');
        }
      });
    }
  };

  return (
    <div className="container col-4">
      <div className="card card-login mx-auto mt-5">
        <div className="card-header">
          <p>
            <img src="//vervetronics.com/wp-content/uploads/2019/11/Verv_Logo_Final_resized.jpg" alt="VerveTronics" width="100%" height="100%" />
          </p>

          <h3 style={{ textAlign: 'center' }}>Register</h3>

        </div>
        <div className="card-body">
          <div>
            <form>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); }}
                  name="email"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="******"
                  onChange={(e) => { setPassword(e.target.value); }}

                  className="form-control"
                />
              </div>

              <div><p style={{ color: 'green' }}>{errorMessage}</p></div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" type="button" onClick={saveUser}>
                  Register &nbsp;&nbsp;&nbsp;

                </button>

                <button className="btn btn-secondary btn-block" type="reset">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
