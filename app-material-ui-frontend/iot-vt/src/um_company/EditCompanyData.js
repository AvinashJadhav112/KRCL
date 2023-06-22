/* eslint-disable no-constant-condition */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
/* eslint-disable react/destructuring-assignment */

import { Typography } from '@mui/material';
import axios from 'axios';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

export class EditCompanyData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      // updatedEmail: '',
      updatedPhone: '',
      updatedCompanyname: '',
      updatedWebsite: '',
      updatedcompanyStatus: '',
      // selected_email: '',
      selected_phone: '',
      selected_companyname: '',
      selected_website: '',
      selected_companyStatus: '',
      errors: {},

    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const id = window.location.href.split('/')[6];
    await axios.get(`http://192.168.0.194:5005/api/1.0/company/getCompanyById/${id}`)
      .then((response) => {
        this.setState({ response: response.data });
        // this.setState({ selected_email: response.data.email });
        this.setState({ selected_phone: response.data.mobileNumber });
        this.setState({ selected_companyname: response.data.companyName });
        this.setState({ selected_website: response.data.website });
        this.setState({ selected_companyStatus: response.data.companyStatus });
      });
  }

  async handleChange(e) {
    const status = await e.target.value;
    this.setState({
      updatedcompanyStatus: status,
    });
  }

  handleSubmit = (e) => {
    const companyId = window.location.href.split('/')[6];
    e.preventDefault();
    this.EditUpdate();
    if (this.validate()) {
      console.log(this.state.response);
      this.state.response.companyName = this.state.updatedCompanyname;
      this.state.response.website = this.state.updatedWebsite;
      this.state.response.mobileNumber = this.state.updatedPhone;
      this.state.response.companyStatus = this.state.updatedcompanyStatus;
      // if (this.state.response.mobileNumber === data.mobileNumber
      //   && this.state.response.companyName === data.companyName
      //   && this.state.response.website === data.website) {
      //   alert('data already exists ');
      // } else {
      axios
        .put(
          `http://192.168.0.194:5005/api/1.0/company/updateCompanyById/${companyId}`,
          this.state.response,
        )
        .then(
          (res) => {
            if (res.status === 200) {
              alert('Company data updated successfully..');
              this.props.history.push('/um_company/companyDataTable');
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
  };

  EditUpdate() {
    if (this.state.updatedPhone === '') {
      this.state.updatedPhone = this.state.selected_phone;
    }

    if (this.state.updatedCompanyname === '') {
      this.state.updatedCompanyname = this.state.selected_companyname;
    }

    if (this.state.updatedWebsite === '') {
      this.state.updatedWebsite = this.state.selected_website;
    }

    if (this.state.updatedcompanyStatus === '') {
      this.state.updatedcompanyStatus = this.state.selected_companyStatus;
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.updatedPhone) {
      isValid = false;
      errors.updatedPhone = 'Please enter Phone No.';
    } else if (!/^[ 0-9 ]+$/i.test(this.state.updatedPhone)) {
      isValid = false;
      errors.updatedPhone = 'Phone no. should be number only';
    }

    if (!this.state.updatedCompanyname) {
      isValid = false;
      errors.updatedCompanyname = 'Please enter Company name.';
    } else if (!/^[ a-z A-Z 0-9 ]+$/i.test(this.state.updatedCompanyname)) {
      isValid = false;
      errors.updatedCompanyname = 'company name should be character only';
    }

    if (!this.state.updatedWebsite) {
      isValid = false;
      errors.updatedWebsite = 'Please enter Website.';
    } else if (!/^[ a-z A-Z 0-9 ]+$/) {
      isValid = false;
      errors.updatedWebsite = 'website should be in proper format';
    }

    if (!this.state.updatedcompanyStatus) {
      isValid = false;
      errors.updatedcompanyStatus = 'Please select Company Status.';
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
        <div
          style={{
            border: '1px solid grey',
            width: '40%',
            padding: '2% 0 2% 5%',
            borderRadius: '15px',
            margin: '8% 0 0 20%',
          }}
        >

          <form
            onSubmit={this.handleSubmit}
            style={{ margin: '2% -9% 0 0', width: '198%' }}
          >
            <div className="form-row" />
            <Typography>
              <h3>Edit Company</h3>
            </Typography>
            <div className="form-row">
              <div className="form-group col-5">
                <label>Update Phone No.</label>
                <input
                  name="updatedPhone"
                  type="text"
                  placeholder={this.state.selected_phone}
                  value={this.state.updatedPhone}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.updatedPhone}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-5">
                <label>Update Company Name</label>
                <input
                  name="updatedCompanyname"
                  type="text"
                  placeholder={this.state.selected_companyname}
                  value={this.state.updatedCompanyname}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.updatedCompanyname}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-5">
                <label>Update Website</label>
                <input
                  name="updatedWebsite"
                  type="text"
                  placeholder={this.state.selected_website}
                  value={this.state.updatedWebsite}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.updatedWebsite}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-5">
                <label>update Status</label>
                <select
                  className="form-control"
                  name="updatedcompanyStatus"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 0 6px 10px',
                    borderRadius: '4px',
                  }}
                  onChange={this.handleChange}
                >
                  <option disabled selected>
                    {this.state.selected_companyStatus}
                  </option>
                  {status.map((Change) => (
                    <option>{Change.value}</option>
                  ))}
                </select>
                <div className="text-danger">
                  {this.state.errors.updatedcompanyStatus}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex' }}>
              <input
                type="submit"
                value="Edit Company Details"
                className="btn btn-success"
              />
              <Link
                to="/um_company/companyDataTable"
                style={{ textDecoration: 'none' }}
              >
                <input
                  type="reset"
                  value="Cancel"
                  className="btn btn-secondary"
                  style={{ marginLeft: '12%' }}
                />
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditCompanyData);
