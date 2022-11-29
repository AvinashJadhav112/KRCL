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

class CompanyAddForm extends Component {
  constructor() {
    super();
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      companyName: '',
      buildingName: '',
      societyName: '',
      landmark: '',
      pincode: '',
      websiteURL: '',
      mobile: '',
      emailID: '',
      city: '',
      state: '',
      country: '',
      selectOptions: [],
      errors: [],

      deviceName: [],
      openDeleteDialog: false,
      companyAddedDate: '',
      status: 'active',
    };
  }

  async componentDidMount() {
    this.getOptions();
    const { data } = await axios.get('http://192.168.0.194:5005/api/1.0/company/');
    this.state.companyList = data;
  }

  handleDelete = (event) => {
    const iotDeviceToDelete = this.state.deviceName;
    event.preventDefault();
    axios.delete('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        console.log(res);
        console.log(res.data);
      });
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
    if (this.validate()) {
      let CompanyTobeStored = true;
      this.state.companyList.map((company) => {
        if (company.companyName === this.state.companyName || company.website === this.state.websiteURL || company.email === this.state.emailID || company.mobileNumber === this.state.mobile) {
          CompanyTobeStored = false;
        }
      });
      console.log(CompanyTobeStored);
      if (CompanyTobeStored) {
        const data = {
          companyName: this.state.companyName,
          website: this.state.websiteURL,
          mobileNumber: this.state.mobile,
          email: this.state.emailID,
          companyAddedDate: this.state.companyAddedDate,
          companyStatus: this.state.status,
        };
        axios
          .post('http://192.168.0.194:5005/api/1.0/company/', data)
          .then((res) => {
            console.log(res);
            console.log(res.data);
            if (res.status === 201) {
              alert('Data Added Successfully..');
            }
          },
          (error) => {
            this.handleError(error);
            return error;
          })
          .catch((apiError) => {
            console.log(apiError);
          });
      } else {
        this.state.companyList.map((company) => {
          if (company.companyName === this.state.companyName && company.website === this.state.websiteURL && company.email === this.state.emailID && company.mobileNumber === this.state.mobile) {
            this.setState({
              companyName: '',
              websiteURL: '',
              emailID: '',
              mobile: '',

            });
            alert('These company details allready exists, please try with different details');
          } else
          if (company.companyName === this.state.companyName) {
            this.setState({
              companyName: '',
            });
            alert('Company Name already exists, please try with different Name');
          } else
          if (company.website === this.state.websiteURL) {
            this.setState({
              websiteURL: '',
            });
            alert('Website URL already exists, please try with different URL');
          } else
          if (company.email === this.state.emailID) {
            this.setState({
              emailID: '',
            });
            alert('This Email ID already exists, please try with different ID');
          } else
          if (company.mobileNumber === this.state.mobile) {
            this.setState({
              mobile: '',
            });
            alert('This Mobile number already exists, please try with different number');
          }
        });
      }
    }
  };

  handleChangeDropdown = (e) => {
    this.setState({ iotModelName: e.label, id: e.value });
  }

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

    if (!this.state.companyName) {
      isValid = false;
      errors.companyName = 'Please enter company name';
    } else if (!/^[a-z A-Z ]+$/i.test(this.state.companyName)) {
      isValid = false;
      errors.companyName = 'Company name should be character only';
    }

    if (!this.state.websiteURL) {
      isValid = false;
      errors.websiteURL = 'Please enter website URL';
    }

    if (!this.state.mobile) {
      isValid = false;
      errors.mobile = 'Please enter mobile number';
    } else if (!/^[6-9]\d{9}$/i.test(this.state.mobile)) {
      isValid = false;
      errors.mobile = 'field should be in correct format ';
    }

    if (!this.state.emailID) {
      isValid = false;
      errors.emailID = 'Please enter email id';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(this.state.emailID)) {
      isValid = false;
      errors.emailID = 'Email Id should be in correct format';
    }

    if (!this.state.companyAddedDate) {
      isValid = false;
      errors.companyAddedDate = 'Please select company added date';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const state = [
      'Andhra Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Goa',
      'Gujrat',
      'Haryana',
      'Himachal Pradesh',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Panjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'west Bengal',

    ];

    return (
      <div>
        <div style={{
          flexGrow: 1, paddingLeft: '20px', paddingTop: '0%', marginTop: '6%',
        }}

        >
          <Typography variant="h4">Add Company</Typography>
        </div>

        <div style={{
          display: 'flex', paddingTop: '0%', paddingBottom: '2%',
        }}
        />
        <form style={{ marginLeft: '2%' }} onSubmit={this.handleSubmit}>
          <div className="form-group col-4">
            <label>Status</label>
            <div check>
              <input
                type="radio"
                value="active"
                checked={this.state.status === 'active'}
                onChange={this.handleRadioChange}
              />
              <span style={{ marginLeft: '5px' }}>Active</span>
            </div>

            <div check style={{ marginTop: '5%' }}>
              <input
                type="radio"
                value="inactive"
                checked={this.state.status === 'inactive'}
                onChange={this.handleRadioChange}
              />
              <span style={{ marginLeft: '5px' }}>InActive</span>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-3">
              <label>Company Name</label>
              <input
                name="companyName"
                type="text"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">{this.state.errors.companyName}</div>
            </div>

            <div className="form-group col-3">
              <label>Website URL</label>
              <input
                name="websiteURL"
                type="int"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">
                {this.state.errors.websiteURL}
              </div>
            </div>
            <div className="form-group col-3">
              <label>Mobile No</label>
              <input
                name="mobile"
                type="int"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">
                {this.state.errors.mobile}
              </div>
            </div>

            <div className="form-group col-3">
              <label>Email ID</label>
              <input
                name="emailID"
                type="int"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">
                {this.state.errors.emailID}
              </div>
            </div>

            <div className="form-group col-4">
              <label> Company Added Date</label>
              <input
                name="companyAddedDate"
                type="date"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">
                {this.state.errors.companyAddedDate}
              </div>
            </div>

          </div>
          {' '}
          <div className="form-group col-4">
            <input type="submit" value="Submit" className="btn btn-primary" />
            <Link to="/um_company/company.js" style={{ textDecoration: 'none' }}>
              <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '2%' }} />
            </Link>
          </div>
        </form>

        <div style={{ marginLeft: '2%', paddingTop: '1%' }}>
          <Typography>
            {/* <h5>Equipment Access:</h5> */}
          </Typography>
        </div>

        <div className="form-group col-4" />
        <div className="form-group col-4" />

        <div style={{ marginLeft: '2%', paddingTop: '1%' }}>
          <Typography>
            {/* <h5>Users:</h5> */}
          </Typography>
        </div>

        <div style={{ marginBottom: '2%', marginLeft: '2%' }}>
          {/* <CompanyAddUserDataGrid /> */}
        </div>

      </div>

    );
  }
}

export default CompanyAddForm;
