/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable react/sort-comp */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import TitleComponent from './title';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
      redirect: false,
      authError: false,
      isLoading: false,
      location: {},
      errors: [],
      newresult: ' ',
      toDashboard: false,
      result2: '',
      roles: '',
      showPassword: false,
    };
  }

  componentDidMount() {
    function changeHashOnLoad() {
      window.location.href += '#';
      // eslint-disable-next-line no-implied-eval
      setTimeout(changeHashAgain(), '50');
    }
    function changeHashAgain() {
      window.location.href += '1';
    }
    const storedHash = window.location.hash;
    window.setInterval(() => {
      if (window.location.hash !== storedHash) {
        window.location.hash = storedHash;
      }
    }, 50);
    window.onload = changeHashOnLoad;
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePwdChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleClickShowPassword = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    if (this.validate()) {
      const data = {
        email: this.email,
        password: this.password,
      };
      const { email } = this.state;
      const { password } = this.state;

      const str = `${this.state.email}:${this.state.password}`;
      const result1 = window.btoa(str);

      const result2 = window.atob(result1);

      this.setState({ newresult: result2 });
      this.setState({ result2 });

      const handle = () => {
        localStorage.setItem(this.state.email, this.email);
        localStorage.setItem(this.state.password, this.password);
      };

      const token = Buffer.from(`${this.state.email}:${this.state.password}`, 'utf8').toString('base64');
      localStorage.getItem('email');
      localStorage.getItem('password');

      fetch('http://192.168.0.194:5005/api/1.0/login', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),

      }).then((result) => {
        result.json().then((resp) => {
          localStorage.setItem('Basic', JSON.stringify(resp));

          return fetch(`http://192.168.0.194:5005/api/1.0/users/roles/${this.state.email}`);
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(response);
        }).then((userData) => {
          console.log(userData);
          this.setState({ userData });

          if (result.status === 200 && this.state.email === 'admin@vervetronics.com') {
            alert('Admin Logged in successfully..');
            this.props.history.push('/dash_summary/SummaryDashboard.js');
            window.localStorage.setItem('User', 'Admin');
            window.location.reload();
          } else if (result.status === 200 && this.state.email === 'krcl@vervetronics.com') {
            alert('KRCL User logged in successfully..!!');
            this.props.history.push('/dash_summary/summaryKRCL');
            window.localStorage.setItem('User', 'KRCL');
            window.location.reload();
          } else alert('Invalid credentials..!!');
        });
      });
      this.setState({ isLoading: false });
    }
  };

  renderRedirect = () => {

  };

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.email) {
      isValid = false;
      errors.email = 'Please enter email id';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(this.state.email)) {
      isValid = false;
      errors.email = 'Email Id should be in correct format';
    }

    if (!this.state.password) {
      isValid = false;
      errors.password = 'Please enter password';
    } else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(this.state.password)) {
      isValid = false;
      errors.password = 'Password should be in correct format';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const { isLoading } = this.state;
    return (
      <>
        <div className="form group">
          <div className="container col-4">
            <TitleComponent title="VerveTronics" />
            <div className="card card-login mx-auto mt-5">
              <div className="form group">
                <div className="card-header">
                  <p>
                    <img src="//vervetronics.com/wp-content/uploads/2019/11/Verv_Logo_Final_resized.jpg" alt="VerveTronics" width="100%" height="100%" />
                  </p>
                  <h3 style={{ paddingLeft: '40%' }}>Login</h3>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      name="email"
                      type="text"
                      onChange={this.handleEmailChange}
                      className={`form-control ${this.state.authError ? 'is-invalid' : ''}`}
                    />
                    <div className="text-danger">{this.state.errors.email}</div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <OutlinedInput
                      style={{
                        borderRight: 'none', borderBottom: 'none', borderLeft: 'none', borderTop: '1px solid #00000030',
                      }}

                      // eslint-disable-next-line react/jsx-props-no-multi-spaces
                      name="password"
                      type={this.state.showPassword ? 'text' : 'password'}
                      placeholder="*****"
                      onChange={this.handlePwdChange}
                      className="form-control"
                      endAdornment={(
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleClickShowPassword}
                            edge="end"
                          >
                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )}
                    />
                    <div className="text-danger">{this.state.errors.password}</div>
                  </div>

                  <div className="form-group">
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" value="remember-me" />
                        Remember Password
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      className="btn btn-primary btn-block"
                      type="submit"
                      disabled={!!this.state.isLoading}
                    >
                      Login &nbsp;&nbsp;&nbsp;
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      ) : (
                        <span />
                      )}
                    </button>
                  </div>

                </form>
                <div className="form group">
                  <div className="text-center">
                    <a className="d-block small" href="forgot-password.html">Forgot Password?</a>
                  </div>
                </div>
              </div>
            </div>
            {this.renderRedirect()}
          </div>
        </div>

      </>
    );
  }
}

export default Login;
