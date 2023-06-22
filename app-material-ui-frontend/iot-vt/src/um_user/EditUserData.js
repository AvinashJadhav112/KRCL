/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
/* eslint-disable react/destructuring-assignment */
import { Typography } from '@mui/material';
import axios from 'axios';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

export class EditUserData extends Component {
  constructor(props) {
    super(props);

    this.state = {

      response: '',

      updatedFirstname: '',
      updatedLastname: '',
      updatedMobilenumber: '',
      updatedUserstatus: '',
      updatedCompanyname: '',
      updatedemail: '',

      selected_firstname: '',
      selected_lastname: '',
      selected_mobilenumber: '',
      selected_userstatus: '',
      selected_companyname: '',
      selected_email: '',

      errors: {},

    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const email = window.location.href.split('/')[6];
    await axios.get(`http://192.168.0.194:5005/api/1.0/userDetails/${email}`)
      .then((response) => {
        this.setState({ response: response.data });
        this.setState({ selected_firstname: response.data.firstName });
        this.setState({ selected_lastname: response.data.lastName });
        this.setState({ selected_mobilenumber: response.data.mobileNumber });
        this.setState({ selected_userstatus: response.data.userStatus });
        this.setState({ selected_companyname: response.data.companyName });
        this.setState({ selected_companyname: response.data.email });
      });
  }

  async handleChange(e) {
    const status = await e.target.value;
    this.setState({
      updatedUserstatus: status,
    });
  }

    handleSubmit = (e) => {
      const email = window.location.href.split('/')[6];
      e.preventDefault();
      this.EditUpdate();
      if (this.validate()) {
        console.log(this.state.response);
        this.state.response.firstName = this.state.updatedFirstname;
        this.state.response.lastName = this.state.updatedLastname;
        this.state.response.mobileNumber = this.state.updatedMobilenumber;
        this.state.response.userStatus = this.state.updatedUserstatus;
        if (this.state.response.role === null) {
          this.state.response.role = 'User';
        }
        axios
          .put(`http://192.168.0.194:5005/api/1.0/userDetails/${email}`, this.state.response)
          .then(
            (res) => {
              if (res.status === 200) {
                alert('User data updated successfully..');
                this.props.history.push('/um_user/user.js');
              }
            },
            (error) => {
              this.handleErrors(error);
              return error;
            },
          )
          .catch((apiError) => {
            // console.log(apiError);
          });
      }
    }

    EditUpdate() {
      if (this.state.updatedFirstname === '') {
        this.state.updatedFirstname = this.state.selected_firstname;
      }
      if (this.state.updatedLastname === '') {
        this.state.updatedLastname = this.state.selected_lastname;
      }

      if (this.state.updatedMobilenumber === '') {
        this.state.updatedMobilenumber = this.state.selected_mobilenumber;
      }

      if (this.state.updatedUserstatus === '') {
        this.state.updatedUserstatus = this.state.selected_userstatus;
      }

      if (this.state.updatedCompanyname === '') {
        this.state.updatedCompanyname = this.state.selected_companyname;
      }

      if (this.state.updatedemail === '') {
        this.state.updatedemail = this.state.selected_email;
      }
    }

    validate() {
      const errors = {};
      let isValid = true;

      if (!this.state.updatedMobilenumber) {
        isValid = false;
        errors.updatedMobilenumber = 'Please enter Phone No.';
      } else
      if (!/^[ 0-9 ]+$/i.test(this.state.updatedMobilenumber)) {
        isValid = false;
        errors.updatedMobilenumber = 'Phone no. should be number only';
      }

      if (!this.state.updatedFirstname) {
        isValid = false;
        errors.updatedFirstname = 'Please enter User name.';
      } else if (!/^[ a-z A-Z 0-9 ]+$/i.test(this.state.updatedFirstname)) {
        isValid = false;
        errors.updatedFirstname = 'User name should be character only';
      }

      if (!this.state.updatedLastname) {
        isValid = false;
        errors.updatedLastname = 'Please enter lastname.';
      } else
      // eslint-disable-next-line no-constant-condition
      if (!/^[ a-z A-Z 0-9 ]+$/) {
        isValid = false;
        errors.updatedLastname = 'last name should be character only';
      }

      this.setState({
        errors,
      });

      return isValid;
    }

    render() {
      const status = [
        { value: 'Active', name: 'Active' },
        { value: 'Inactive', name: 'Inactive' },
      ];
      return (
        <div>
          <div style={{
            border: '1px solid grey', width: '40%', padding: '2% 0 2% 5%', borderRadius: '15px', margin: '8% 0 0 20%',
          }}
          >
            <form onSubmit={this.handleSubmit} style={{ margin: '2% -9% 0 0', width: '198%' }}>
              <div className="form-row" />
              <Typography>
                <h3>Edit User</h3>
              </Typography>

              <div className="form-row">
                <div className="form-group col-5">
                  <label>Update First Name</label>
                  <input
                    name="updatedFirstname"
                    type="text"
                    placeholder={this.state.selected_firstname}
                    value={this.state.updatedFirstname}
                    onChange={this.handleChange}
                    className="form-control"
                  />
                  <div className="text-danger">{this.state.errors.updatedFirstname}</div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-5">
                  <label>Update Last Name</label>
                  <input
                    name="updatedLastname"
                    type="text"
                    placeholder={this.state.selected_lastname}
                    value={this.state.updatedLastname}
                    onChange={this.handleChange}
                    className="form-control"
                  />
                  <div className="text-danger">{this.state.errors.updatedLastname}</div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-5">
                  <label>Update Mobile No.</label>
                  <input
                    name="updatedMobilenumber"
                    type="text"
                    placeholder={this.state.selected_mobilenumber}
                    value={this.state.updatedMobilenumber}
                    onChange={this.handleChange}
                    className="form-control"
                  />
                  <div className="text-danger">{this.state.errors.updatedMobilenumber}</div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-5">
                  <label>update Status</label>
                  <select
                    className="form-control"
                    name="updatedUserstatus"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 0 6px 10px',
                      borderRadius: '4px',
                    }}
                    onChange={this.handleChange}
                  >
                    <option disabled selected>
                      {this.state.selected_userstatus}
                    </option>
                    {status.map((Change) => (
                      <option>{Change.value}</option>
                    ))}
                  </select>
                  <div className="text-danger">{this.state.errors.updatedUserstatus}</div>
                </div>
              </div>

              <div style={{ display: 'flex' }}>
                <input type="submit" value="Edit User Details" className="btn btn-success" />
                <Link to="/um_user/user.js" style={{ textDecoration: 'none' }}>
                  <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '12%' }} />
                </Link>
              </div>
            </form>
          </div>
        </div>
      );
    }
}

export default withRouter(EditUserData);
