/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
/* eslint-disable no-useless-escape */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 4,
    padding: theme.spacing(1),
    paddingLeft: '20%',
    paddingTop: '0%',
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '54ch',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 425,
  },
  formControl1: {
    margin: theme.spacing(1),
    minWidth: 260,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

class userAddnew extends Component {
  constructor() {
    super();
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      companyName: '',
      userStatus: '',
      userAddedDate: '',
      id: '',
      role: '',
      errors: [],
    };
  }

  async componentDidMount() {
    this.getOptions();
    const { data } = await axios.get(
      'http://192.168.0.194:5005/api/1.0/userDetails',
    );
    this.state.userList = data;
  }

  handleRadioChange(event) {
    this.setState({
      status: event.target.value,
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a sensor with same name');
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('first');
    if (this.validate()) {
      const UserTobeStored = true;
      if (UserTobeStored) {
        const data = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          mobileNumber: this.state.mobileNumber,
          companyName: this.state.companyName,
          userStatus: this.state.userStatus,
          userAddedDate: this.state.userAddedDate,
          role: this.state.role,
          // id: this.state.id,
        };
        axios
          .post('http://192.168.0.194:5005/api/1.0/userDetails', data)
          .then(
            (res) => {
              console.log(res);
              console.log(res.data);
              if (res.status === 201) {
                alert('User Added Successfully..');
                this.props.history.push('/um_user/user.js');
              }
            },
            (error) => {
              this.handleError(error);
              return error;
            },
          )
          .catch((apiError) => {
            console.log(apiError);
          });
      } else {
        this.state.userList.map((user) => {
          if (
            user.firstName === this.state.firstName
            && user.lastName === this.state.lastName
            && user.email === this.state.email
            && user.mobileNumber === this.state.mobileNumber
          ) {
            this.setState({
              firstName: '',
              lastName: '',
              email: '',
              mobileNumber: '',
            });
            alert(
              'These user details already exists, please try with different details',
            );
          } else if (user.firstName === this.state.firstName) {
            this.setState({
              firstName: '',
            });
            alert('User Name already exists, please try with different Name');
          } else if (user.lastName === this.state.lastName) {
            this.setState({
              lastName: '',
            });
            alert('Lastname already exists, please try with different URL');
          } else if (user.email === this.state.email) {
            this.setState({
              email: '',
            });
            alert('This Email ID already exists, please try with different ID');
          } else if (user.mobileNumber === this.state.mobileNumber) {
            this.setState({
              mobileNumber: '',
            });
            alert(
              'This Mobile number already exists, please try with different number',
            );
          }
        });
      }
    }
  };

  handleChangeDropdown = (e) => {
    this.setState({ iotModelName: e.label, id: e.value });
  };

  async getOptions() {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    const { data } = res;
    const options = data.map((d) => ({
      value: d.id,
      label: d.iotModelName,
    }));
    this.setState({ selectOptions: options });
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.firstName) {
      isValid = false;
      errors.firstName = 'Please enter user name';
    } else if (!/^[a-z A-Z ]+$/i.test(this.state.firstName)) {
      isValid = false;
      errors.firstName = 'User name should be character only';
    }

    if (!this.state.lastName) {
      isValid = false;
      errors.lastName = 'lastname should be character only';
    }

    if (!this.state.mobileNumber) {
      isValid = false;
      errors.mobileNumber = 'Please enter mobile number';
    } else if (!/^[0-9]\d{9}$/i.test(this.state.mobileNumber)) {
      isValid = false;
      errors.mobileNumber = 'field should be in correct format ';
    }

    if (!this.state.email) {
      isValid = false;
      errors.email = 'Please enter email id';
    } else if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        this.state.email,
      )
    ) {
      isValid = false;
      errors.email = 'Email Id should be in correct format';
    }

    if (!this.state.userAddedDate) {
      isValid = false;
      errors.userAddedDate = 'Please select user added date';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const options = [
      { value: 'User', label: 'User' },
      { value: 'Admin', label: 'Admin' },
    ];

    const status = [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
    ];

    return (
      <div style={{ marginLeft: '5%', marginTop: '7%' }}>
        <div
          style={{
            border: '1px solid grey',
            width: '50%',
            padding: '2% 0 0% 5%',
            borderRadius: '15px',
            margin: '0 0 0 20%',
          }}
        >
          <div>
            <h3>Add User</h3>
          </div>

          <form style={{ width: '75%' }} onSubmit={this.handleSubmit}>
            <div className="row" style={{ marginRight: '-18%' }}>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className="mt-2 ">
                <label>User Name</label>
                <input
                  // style={{ width: '70%' }}
                  name="firstName"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.firstName}</div>
              </div>

              <div className="mt-2 ">
                <label>Last Name</label>
                <input
                  // style={{ width: '70%' }}
                  name="lastName"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.lastName}</div>
              </div>

              <div className="mt-2 ">
                <label>Email ID</label>
                <input
                  // style={{ width: '70%' }}
                  name="email"
                  type="int"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.email}</div>
              </div>

              <div className="mt-2 ">
                <label>Mobile No</label>
                <input
                  // style={{ width: '70%' }}
                  name="mobileNumber"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.mobileNumber}
                </div>
              </div>

              <div className="mt-2 ">
                <label>Company Name</label>
                <input
                  // style={{ width: '70%' }}
                  name="companyName"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.companyName}
                </div>
              </div>

              <div className="form-group col-12 mt-2">
                <label>User Status</label>
                <select
                  name="userStatus"
                  onChange={this.handleChange}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 20px',
                    borderRadius: '4px',
                  }}
                >
                  {status.map((status) => (
                    <option value={status.value}>{status.value}</option>
                  ))}
                </select>
              </div>

              <div className="mt-2">
                <label> Company Added Date</label>
                <input
                  // style={{ width: '70%' }}
                  name="userAddedDate"
                  type="date"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.userAddedDate}
                </div>
              </div>

              <div className="form-group col-12 mt-2">
                <label>Role</label>
                <select
                  name="role"
                  onChange={this.handleChange}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 20px',
                    borderRadius: '4px',
                  }}
                >
                  {options.map((role) => (
                    <option value={role.value}>{role.value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 ">
              <input type="submit" value="Submit" className="btn btn-primary" />
              <Link to="/um_user/user.js" style={{ textDecoration: 'none' }}>
                <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '2%' }} />
              </Link>
            </div>
          </form>

          <div style={{ marginLeft: '2%', paddingTop: '1%' }}>
            <Typography>{/* <h5>Equipment Access:</h5> */}</Typography>
          </div>

          <div className=" " />
          <div className=" " />

          {/* <div style={{ marginBottom: '2%', marginLeft: '2%' }}>
          <CompEquipmentAccess />
        </div> */}

          <div style={{ marginLeft: '2%', paddingTop: '1%' }}>
            <Typography>{/* <h5>Users:</h5> */}</Typography>
          </div>

          <div style={{ marginBottom: '2%', marginLeft: '2%' }}>
            {/* <CompanyAddUserDataGrid /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default userAddnew;
