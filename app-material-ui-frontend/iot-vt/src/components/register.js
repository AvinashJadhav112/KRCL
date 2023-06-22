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
import React, { Component, useEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  // const [username, setUsername] = useState("");
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
    // let data = { email, password };
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

        // result.json().then((resp) => {
        console.log(result);
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
        // },
        // (error) => {
        //   handleError(error);
        //   return error;
        // };
      });
    }
  };

  return (
    <div className="container col-4">
      <div className="card card-login mx-auto mt-5">
        <div className="card-header">
          <p>
            <img src="https://www.vervetronics.com/wp-content/uploads/2021/08/cropped-VT_Logo.png" alt="VerveTronics" width="100%" height="100%" />
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

                {/* <div className="text-danger">{email}</div> */}
              </div>
              {/* <div><p style={{color: 'green'}}>{errorMessage}</p></div> */}

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
                {/* <div className="text-danger">{password}</div> */}
              </div>

              <div><p style={{ color: 'green' }}>{errorMessage}</p></div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" type="button" onClick={saveUser}>
                  Register &nbsp;&nbsp;&nbsp;

                </button>

                <button onClick={() => window.history.go(-1)}className="btn btn-secondary btn-block" type="reset">
                  Cancel
                </button>
              </div>

            </form>
          </div>
          {/* <div className="text-center">
                <Link className="d-block small mt-3" to="">Login Your Account</Link>
                <Link className="d-block small" to="#">Forgot Password?</Link>
            </div> */}
        </div>
      </div>

      {/* <h1>Register New User</h1>
      <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} name="email" />
      <br />
      <br />
      <input type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} name="password" />
      <br />
      <br />
      <button type="button" onClick={saveUser}> Submit</button> */}
    </div>
  );
}

export default Register;
