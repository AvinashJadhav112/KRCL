/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-dupe-keys */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable react/sort-comp */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
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
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

class UserAddNew extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleselectSubmit = this.handleselectSubmit.bind(this);
    this.state = {
      id: [],
      firstName: '',
      lastName: '',
      email: '',
      alternateEmail: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      companyName: '',
      userStatus: '',
      userStatusDate: '',
      userAddedDate: '',
      errors: [],
      selectOptions: [],

      companyName: '',
      companyId: '',

      companyData: {},
      selecterrors: [],

      id: '',
      iotModelName: '',
      selectOptions: [],
      deviceName: '',
      userEquipAccessInfo: [],

    };
  }

  async getOptionsUserDevices() {
    const ress = await axios.get(`http://192.168.0.194:5005/api/1.0/userDevices/${this.state.email}`);
    console.log(ress);
    console.log(ress.data);
    if (ress.status === 403) {
      alert('Forbidden');
    }
    this.setState({ userEquipAccessInfo: ress.data, loading: false });
  }

  async getOptions() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/dashboard/devices');
    const { data } = res;
    if (res.status === 403) {
      alert('Forbidden');
    }

    const options = data.map((d) => ({
      value: d.id,
      label: d.deviceName,
    }));

    this.setState({ selectOptions: options });
  }

  async componentDidMount() {
    this.getOptionsCompany();
    this.getOptionsUserDevices();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleErrors(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a Equipment with same name');
    } else if (res.status === 404) {
      alert('Equipment not found');
    } else if (res.status === 500) {
      alert('Internal server error');
    } else if (res.status === 400) {
      alert('Bad Request');
    } else if (res.status === 403) {
      alert('Forbidden');
    } else if (res.status === 401) {
      alert('Unauthorized');
    }
  }

  handleErrorsss(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a user with same email');
    } else if (res.status === 404) {
      alert('User not found');
    } else if (res.status === 500) {
      alert('Internal server error');
    } else if (res.status === 400) {
      alert('Bad Request');
    } else if (res.status === 403) {
      alert('Forbidden');
    } else if (res.status === 401) {
      alert('Unauthorized');
    }
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a user with same email');
    } else if (res.status === 404) {
      alert('User not found');
    } else if (res.status === 500) {
      alert('Internal server error');
    } else if (res.status === 400) {
      alert('Bad Request');
    } else if (res.status === 403) {
      alert('Forbidden');
    } else if (res.status === 401) {
      alert('Unauthorized');
    }
  }

  handleselectSubmit = (e) => {
    e.preventDefault();
    if (this.validates()) {
      const data = {

        email: this.state.email,
        devicesId: this.state.id,
      };
      axios.post(`http://192.168.0.194:5005/api/1.0/userDevices/${this.state.email}/${this.state.id}/devices`, data)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          if (res.status === 201 || res.status === 200) {
            alert('Device Added Successfully..');
          }
        },
        (error) => {
          this.handleError(error);
          return error;
        })
        .catch((apiError) => {
          console.log(apiError);
        });
    }
  };

  handleselectDelete = (event) => {
    const iotDeviceToDelete = this.state.deviceName;
    event.preventDefault();
    axios.delete(`http://192.168.0.194:5005/api/1.0/userDevices/${this.state.email}/${this.state.devicesId}/devices`)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.status === 201 || res.status === 200) {
          alert('Device Deleted Successfully..');
        }
      },
      (error) => {
        this.handleErrors(error);
        return error;
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        alternateEmail: this.state.alternateEmail,
        mobileNumber: this.state.mobileNumber,
        alternateMobileNumber: this.state.alternateMobileNumber,
        companyName: this.state.companyName,
        companyId: this.state.companyId,
        userStatus: this.state.userStatus,
        userStatusDate: this.state.userStatusDate,
        userAddedDate: this.state.userAddedDate,

      };

      console.log(data);
      axios
        .post('http://192.168.0.194:5005/api/1.0/userDetails', data)
        .then((res) => {
          console.log(res);
          console.log(data);
          if (res.status === 201 || res.status === 200) {
            alert('User Data Added Successfully..');
          }
        },
        (error) => {
          this.handleErrorsss(error);
          return error;
        })
        .catch((apiError) => {
          console.log(apiError);
        });
    }
  };

  handleChangeDropdown = (e) => {
    this.setState({ companyName: e.label, companyId: e.value });
  }

  async getOptionsCompany() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/company/');
    const { data } = res;
    const options = data.map((d) => ({
      value: d.id,
      label: d.companyName,
    }));
    this.setState({ selectOptions: options });
  }

  validates() {
    const errors = {};
    let isValid = true;

    if (!this.state.deviceName) {
      isValid = false;
      errors.deviceName = 'Please select device';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.firstName) {
      isValid = false;
      errors.firstName = 'Please enter first name';
    } else if (!/^[a-z A-Z ]+$/i.test(this.state.firstName)) {
      isValid = false;
      errors.firstName = 'First name should be character only';
    }

    if (!this.state.lastName) {
      isValid = false;
      errors.lastName = 'Please enter last name.';
    } else if (!/^[a-z A-Z ]+$/i.test(this.state.lastName)) {
      isValid = false;
      errors.lastName = 'Last name should be character only';
    }

    if (!this.state.email) {
      isValid = false;
      errors.email = 'Please enter email';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(this.state.email)) {
      isValid = false;
      errors.email = 'Email Id should be in correct format';
    }

    if (!this.state.alternateEmail) {
      isValid = false;
      errors.alternateEmail = 'Please enter alternate email';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(this.state.alternateEmail)) {
      isValid = false;
      errors.alternateEmail = 'Email Id should be in correct format';
    }

    if (!this.state.mobileNumber) {
      isValid = false;
      errors.mobileNumber = 'Please enter mobile number';
    } else if (!/^[6-9]\d{9}$/i.test(this.state.mobileNumber)) {
      isValid = false;
      errors.mobileNumber = 'field should be in correct format ';
    }

    if (!this.state.alternateMobileNumber) {
      isValid = false;
      errors.alternateMobileNumber = 'Please enter alternate mobile number';
    } else if (!/^[6-9]\d{9}$/i.test(this.state.alternateMobileNumber)) {
      isValid = false;
      errors.alternateMobileNumber = 'field should be in correct format ';
    }

    if (!this.state.companyName) {
      isValid = false;
      errors.companyName = 'Please enter company name';
    } else if (!/^[a-z A-Z ]+$/i.test(this.state.companyName)) {
      isValid = false;
      errors.companyName = 'Company name should be character only';
    }

    if (!this.state.userStatus) {
      isValid = false;
      errors.userStatus = 'Please select user status';
    }

    if (!this.state.userStatusDate) {
      isValid = false;
      errors.userStatusDate = 'Please select user status date';
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
    const columns = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'equipmentName', headerName: 'Equipment Name', width: 200 },
      { field: 'activeStatus', headerName: 'Active Status', width: 200 },
      { field: 'email', headerName: 'Email', width: 200 },
      {
        field: 'deleteButton',
        headerName: 'Delete',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {
          };

          return <Button type="submit" onClick={this.handleselectDelete}><DeleteIcon /></Button>;
        },
      },
    ];

    const row = [];
    this.state.userEquipAccessInfo.map((it) => {
      row.push(
        {
          id: it.id,
          activeStatus: it.activeStatus,
          email: it.email,
        },
      );
    });

    const userStatus = ['Active', 'Inactive'];
    return (

      <div style={{ marginLeft: '5%', marginTop: '8%' }}>
        <div>
          <Typography variant="h5">Add User</Typography>
        </div>

        <div className="post">

          <form className="post" onSubmit={this.handleSubmit} style={{ marginTop: '1%' }}>
            <div className="form-row">

              <div className="form-group col-4">
                <label>First Name</label>
                <input
                  name="firstName"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.firstName}</div>
              </div>

              <div className="form-group col-4">
                <label>Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.lastName}
                </div>
              </div>

              <div className="form-group col-4">
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.email}
                </div>
              </div>

              <div className="form-group col-4">
                <label>Alternate Email</label>
                <input
                  name="alternateEmail"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.alternateEmail}
                </div>
              </div>

              <div className="form-group col-4">
                <label>Mobile No</label>
                <input
                  name="mobileNumber"
                  type="int"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.mobileNumber}
                </div>
              </div>

              <div className="form-group col-4">
                <label>Alternate Mobile No</label>
                <input
                  name="alternateMobileNumber"
                  type="int"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.alternateMobileNumber}
                </div>
              </div>

              <div className="form-group col-4">
                <label>Select User Status</label>
                <select
                  name="userStatus"
                  onChange={this.handleChange}
                  className={`form-control
                 ${this.state.errors.userStatus ? 'is-invalid' : ''}`}
                >
                  <option value="" />
                  {userStatus.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className="text-danger">
                  {this.state.errors.userStatus}
                </div>
              </div>

              <div className="form-group col-4">
                <label> User Status Date</label>
                <input
                  name="userStatusDate"
                  type="date"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.userStatusDate}
                </div>
              </div>

              <div className="form-group col-4">
                <label> User Added Date</label>
                <input
                  name="userAddedDate"
                  type="date"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.userAddedDate}
                </div>
              </div>

              <div className="form-group col-4">
                <label>Company Name</label>
                <Select
                  options={this.state.selectOptions}
                  onChange={this.handleChangeDropdown}
                />
                <div className="text-danger">
                  {this.state.errors.companyName}
                </div>
              </div>

            </div>
            <div className="form-group col-4">
              <input type="submit" value="Submit" className="btn btn-primary" />
              <Link to="/um_user/user.js" style={{ textDecoration: 'none' }}>
                <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '2%' }} />
              </Link>
            </div>
          </form>
        </div>

        <div className="form-group col-4" />
        <div className="form-group col-4" />
      </div>
    );
  }
}

export default UserAddNew;
