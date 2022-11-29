/* eslint-disable react/sort-comp */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable no-useless-escape */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable spaced-comment */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: [],
      firstName: '', //json user field
      lastName: '',
      email: '',
      alternateEmail: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      companyName: '',
      companyId: '',
      userStatus: '',
      userStatusDate: '',
      userAddedDate: '',

      updatedId: '',
      updatedFirstName: '',
      updatedLastName: '',
      updatedEmail: '',
      updatedAlternateEmail: '',
      updatedMobileNumber: '',
      updatedAlternateMobileNumber: '',
      updatedCompanyName: '',
      updatedCompanyId: '',
      updatedUserStatus: '',
      updatedUserStatusDate: '',
      updatedUserAddedDate: '',

      selectedId: '',
      selectedFirstName: '', // selected name
      selectedLastName: '',
      selectedEmail: '',
      selectedAlternateEmail: '',
      selectedMobileNumber: '',
      selectedAlternateMobileNumber: '',
      selectedCompanyName: '',
      selectedCompanyId: '',
      selectedUserStatus: '',
      selectedUserStatusDate: '',
      selectedUserAddedDate: '',

      selectOptions: [],
      userReading: [],
      userInfo: [],
      jsonName: '',

      User: [], // user which are linked with id's
      openDeleteDialog: false,
      errors: {},
      sameusers: [],
      posts: [],
      Name: [],
      deviceName: '',
      userEquipAccessInfo: [],
    };
    this.user = this.user.bind(this);
  }

  async user() {
    const res = await axios.get(`http://192.168.0.194:5005/api/1.0/userDevices/${this.state.selectedEmail}`);
    const { data } = res;
    this.setState({ userEquipAccessInfo: res.data, loading: false });
  }

  async getOptionsuser() {
    const url = 'http://192.168.0.194:5005/api/1.0/userDetails';
    const response = await axios.get(url);
    this.setState({ userInfo: response.data, loading: false });
  }

  async componentDidMount() {
    this.getOptionsuser();
    this.getOptionss();
  }

  handleDelete = (event) => {
    const urll = 'http://192.168.0.194:5005/api/1.0/userDetails';
    const usertodelete = this.state.selectedEmail;
    this.state.sameusers = this.state.Name.filter(() => this.state.selectedFirstName);
    const confirmAction = confirm('Are you sure you want to delete this user details?');
    if (confirmAction) {
      event.preventDefault();
      axios.delete(`http://192.168.0.194:5005/api/1.0/userDetails/${usertodelete}`)

        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            alert('The user is Deleted!');
          }
          this.getOptionsuser();
        },
        (error) => {
          this.handleErrors(error);
          return error;
        });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleError(error) {
    if (error.response && error.response.status === 404) {
      alert('user not found');
    } else if (error.response && error.response.status === 409) {
      alert('There is already a user with same name..');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 400) {
      alert('Bad Request');
    } else if (error.response && error.response.status === 403) {
      alert('Forbidden');
    }
  }

  handleErrors(error) {
    if (error.response && error.response.status === 404) {
      alert('user not found');
    } else if (error.response && error.response.status === 409) {
      alert('There is already a user with same name..');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 400) {
      alert('Bad Request');
    } else if (error.response && error.response.status === 403) {
      alert('Forbidden');
    }
  }

  async getOptionss() {
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

  async getOptions() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/userDetails');
    const { data } = res;
    console.log(data);
    const options = data.map((d) => ({
      value: d.id,
      label: d.userStatus,
    }));
    this.setState({ selectOptions: options });
  }

  handleChangeDropdown = (e) => {
    this.setState({ updatedUserStatus: e.label });
  }

  handleselectSubmit = (e) => {
    e.preventDefault();
    if (this.validates()) {
      const data = {

        email: this.state.selectedEmail,
        devicesId: this.state.id,
      };
      axios
        .post(`http://192.168.0.194:5005/api/1.0/userDevices/${this.state.selectedEmail}/${this.state.id}/devices`, data)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            alert('Device Added Successfully..');
          }
          this.user();
        },
        (error) => {
          this.handleError(error);
          return error;
        })
        .catch((apiError) => {
          // console.log(apiError);
        });
    }
  };

  handleselectDelete = (event) => {
    const confirmAction = confirm('Are you sure you want to delete this user details?');
    if (confirmAction) {
      event.preventDefault();
      axios.delete(`http://192.168.0.194:5005/api/1.0/userDevices/${this.state.email}/${this.state.id}/devices`)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            alert('Device Deleted Successfully..');
          }
          this.user();

          this.componentDidMount();
          this.state.id = '';
          this.state.deviceName = '';
          this.state.email = '';
        },
        (error) => {
          this.handleErrors(error);
          return error;
        });
    }
  }

  handleChangeDropdown = (e) => {
    this.setState({ deviceName: e.label, id: e.value });
  };

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

  handleUpdatedSubmit = (e) => {
    e.preventDefault();
    this.EditUpdate();
    if (this.validate()) {
      const userdata = {
        firstName: this.state.updatedFirstName,
        lastName: this.state.updatedLastName,
        email: this.state.updatedEmail,
        alternateEmail: this.state.updatedAlternateEmail,
        mobileNumber: this.state.updatedMobileNumber,
        alternateMobileNumber: this.state.updatedAlternateMobileNumber,
        companyName: this.state.updatedCompanyName,
        companyId: this.state.selectedCompanyId,
        userStatus: this.state.updatedUserStatus,
        userStatusDate: this.state.updatedUserStatusDate,
        userAddedDate: this.state.updatedUserAddedDate,
      };
      axios
        .put(`http://192.168.0.194:5005/api/1.0/userDetails/${this.state.selectedEmail}`, userdata)
        .then(
          (res) => {
            if (res.status === 200 || res.status === 201) {
              alert('data updated successfully..');
              window.location.reload();
            }
            (error) => {
              this.handleError(error);
              return error;
            };

            this.state.selectedFirstName = '';
            this.state.selectedLastName = '';
            this.state.selectedEmail = '';
            this.state.selectedAlternateEmail = '';
            this.state.selectedMobileNumber = '';
            this.state.selectedAlternateMobileNumber = '';
            this.state.selectedCompanyName = '';
            this.state.selectedCompanyId = '';
            this.state.selectedUserStatus = '';
            this.state.selectedUserStatusDate = '';
            this.state.selectedUserAddedDate = '';

            this.state.updatedFirstName = '';
            this.state.updatedLastName = '';
            this.state.updatedEmail = '';
            this.state.updatedAlternateEmail = '';
            this.state.updatedMobileNumber = '';
            this.state.updatedAlternateMobileNumber = '';
            this.state.updatedCompanyName = '';
            this.state.updatedCompanyId = '';
            this.state.updatedUserStatus = '';
            this.state.updatedUserStatusDate = '';
            this.state.updatedUserAddedDate = '';

            this.setState({ ...this.state });
            this.componentDidMount();

            this.setState({ ...this.state });
          },
        )
        .catch((apiError) => {
          // console.log(apiError);
        });
    }
  };

  EditUpdate() {
    if (this.state.updatedFirstName == '') {
      this.state.updatedFirstName = this.state.selectedFirstName;
    }
    if (this.state.updatedLastName == '') {
      this.state.updatedLastName = this.state.selectedLastName;
    }

    if (this.state.updatedEmail == '') {
      this.state.updatedEmail = this.state.selectedEmail;
    }

    if (this.state.updatedAlternateEmail == '') {
      this.state.updatedAlternateEmail = this.state.selectedAlternateEmail;
    }

    if (this.state.updatedMobileNumber == '') {
      this.state.updatedMobileNumber = this.state.selectedMobileNumber;
    }

    if (this.state.updatedAlternateMobileNumber == '') {
      this.state.updatedAlternateMobileNumber = this.state.selectedAlternateMobileNumber;
    }

    if (this.state.updatedCompanyName == '') {
      this.state.updatedCompanyName = this.state.selectedCompanyName;
    }

    if (this.state.updatedUserStatus == '') {
      this.state.updatedUserStatus = this.state.selectedUserStatus;
    }

    if (this.state.updatedUserStatusDate == '') {
      this.state.updatedUserStatusDate = this.state.selectedUserStatusDate;
    }

    if (this.state.updatedUserAddedDate == '') {
      this.state.updatedUserAddedDate = this.state.selectedUserAddedDate;
    }
    if (this.state.updatedCompanyId == '') {
      this.state.updatedCompanyId = this.state.selectedCompanyId;
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.updatedFirstName) {
      isValid = false;
      errors.updatedFirstName = 'Please enter your first name.';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(this.state.updatedFirstName)) {
      isValid = false;
      errors.updatedFirstName = 'Name should be character only';
    }

    if (!this.state.updatedLastName) {
      isValid = false;
      errors.updatedLastName = 'Please enter your last name.';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(this.state.updatedLastName)) {
      isValid = false;
      errors.updatedLastName = 'Username should be character only';
    }

    if (!this.state.updatedEmail) {
      isValid = false;
      errors.updatedEmail = 'Please enter Email-Id';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(this.state.updatedEmail)) {
      isValid = false;
      errors.updatedEmail = 'Email Id should be in correct format';
    }

    if (!this.state.updatedAlternateEmail) {
      isValid = false;
      errors.updatedAlternateEmail = 'Please enter Email-Id';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(this.state.updatedAlternateEmail)) {
      isValid = false;
      errors.updatedAlternateEmail = 'Email Id should be in correct format';
    }

    if (!this.state.updatedMobileNumber) {
      isValid = false;
      errors.updatedMobileNumber = 'Please enter mobile No.';
    } else if (!/^[ 0-9 ]+$/i.test(this.state.updatedMobileNumber)) {
      isValid = false;
      errors.updatedMobileNumber = 'Phone no. should be number only';
    }

    if (!this.state.updatedAlternateMobileNumber) {
      isValid = false;
      errors.updatedAlternateMobileNumber = 'Please enter alternate mobile No.';
    } else if (!/^[ 0-9 ]+$/i.test(this.state.updatedAlternateMobileNumber)) {
      isValid = false;
      errors.updatedAlternateMobileNumber = 'Phone no. should be number only';
    }

    if (!this.state.updatedCompanyName) {
      isValid = false;
      errors.updatedCompanyName = 'Please enter Company name.';
    } else if (!/^[ a-z A-Z 0-9 ]+$/i.test(this.state.updatedCompanyName)) {
      isValid = false;
      errors.updatedCompanyName = 'company name should be character only';
    }

    if (!this.state.updatedUserStatus) {
      isValid = false;
      errors.updatedUserStatus = 'Please select user status';
    }

    if (!this.state.updatedUserStatusDate) {
      isValid = false;
      errors.updatedUserStatusDate = 'Please select user status date';
    }

    if (!this.state.updatedUserAddedDate) {
      isValid = false;
      errors.updatedUserAddedDate = 'Please select user addded date';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const userStatus = ['Active', 'Inactive'];

    const usercolumns = [
      { field: 'id', headerName: 'ID', width: 150 },
      { field: 'equipmentName', headerName: 'Equipment Name', width: 200 },
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

    const userrow = [];
    this.state.userEquipAccessInfo.map((it) => {
      userrow.push(
        {
          id: it.iotDevice.id,
          equipmentName: it.iotDevice.deviceName,
          activeStatus: it.activeStatus,
          email: it.email,
        },
      );
    });

    const columns = [
      { field: 'firstName', headerName: 'First Name', width: 200 },
      { field: 'lastName', headerName: 'Last Name', width: 200 },
      { field: 'email', headerName: 'Email', width: 250 },
      { field: 'alternateEmail', headerName: 'Alternate Email', width: 250 },
      { field: 'mobileNumber', headerName: 'Mobile Number', width: 200 },
      { field: 'alternateMobileNumber', headerName: 'Alternate Mobile Number', width: 200 },
      { field: 'companyName', headerName: 'Company Name', width: 220 },
      { field: 'userStatus', headerName: 'User Status', width: 150 },
      { field: 'userStatusDate', headerName: 'Status Date', width: 220 },
      { field: 'userAddedDate', headerName: 'Added Date', width: 130 },

      {
        field: 'editButton',
        headerName: 'Edit',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {

          };

          return (
            <Button type="submit" onClick={onClick}>
              <EditIcon />
            </Button>
          );
        },
      },
      // this should delete whole model with sensors from table
      {
        field: 'deleteButton',
        headerName: 'Delete',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {
          };

          return (

            <Button type="submit" onClick={this.handleDelete}>
              {' '}
              <DeleteIcon />
              {' '}
            </Button>
          );
        },
      },
    ];

    const row = [];
    this.state.userInfo.map((it) => {
      row.push(
        {
          id: it.id,
          firstName: it.firstName,
          lastName: it.lastName,
          email: it.email,
          alternateEmail: it.alternateEmail,
          mobileNumber: it.mobileNumber,
          alternateMobileNumber: it.alternateMobileNumber,
          companyName: it.companyName,
          userStatus: it.userStatus,
          userStatusDate: it.userStatusDate,
          userAddedDate: it.userAddedDate,
          companyId: it.companyId,
        },
      );
    });

    return (
      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ padding: '0' }}>User Page</h3>

          {/* add new button added */}
          <Link to="/um_user/userAddnew.js" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Add New
            </Button>
          </Link>
        </div>
        <div key={row.id}>
          <div style={{
            height: 400, marginTop: '2%',
          }}
          >
            <DataGrid
              checkboxSelection
              rows={row}
              columns={columns}
              pageSize={6}
              icon
              SettingsApplicationsOutlinedIcon
              onRowSelected={(newSelection) => {
                this.user();
                console.log(newSelection.data);
                this.setState({
                  selectedFirstName: newSelection.data.firstName,
                  selectedLastName: newSelection.data.lastName,
                  selectedEmail: newSelection.data.email,
                  selectedAlternateEmail: newSelection.data.alternateEmail,
                  selectedMobileNumber: newSelection.data.mobileNumber,
                  selectedAlternateMobileNumber: newSelection.data.alternateMobileNumber,
                  selectedCompanyName: newSelection.data.companyName,
                  selectedUserStatus: newSelection.data.userStatus,
                  selectedUserStatusDate: newSelection.data.userStatusDate,
                  selectedUserAddedDate: newSelection.data.userAddedDate,
                  selectedCompanyId: newSelection.data.companyId,

                });
              }}
            />
            <br />
          </div>
        </div>

        {(() => {
          if (this.state.selectedFirstName === '') {
            return <h1> </h1>;
          } if (this.state.selectedLastName === '') {
            return <h1> </h1>;
          } if (this.state.selectedEmail === '') {
            return <h1> </h1>;
          } if (this.state.selectedAlternateEmail === '') {
            return <h1> </h1>;
          } if (this.state.selectedMobileNumber === '') {
            return <h1> </h1>;
          } if (this.state.selectedAlternateMobileNumber === '') {
            return <h1> </h1>;
          } if (this.state.selectedCompanyName === '') {
            return <h1> </h1>;
          } if (this.state.selectedUserStatus === '') {
            return <h1> </h1>;
          } if (this.state.selectedUserStatusDate === '') {
            return <h1> </h1>;
          } if (this.state.selectedUserAddedDate === '') {
            return <h1> </h1>;
          }

          return (

            <div style={{ marginTop: '2%' }}>

              <form onSubmit={this.handleUpdatedSubmit}>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old First Name</label>
                    <input
                      name="selectedFirstName"
                      type="text"
                      value={this.state.selectedFirstName}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update First Name</label>
                    <input
                      name="updatedFirstName"
                      type="text"
                      value={this.state.updatedFirstName}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedFirstName}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Last Name</label>
                    <input
                      name="selectedLastName"
                      type="text"
                      value={this.state.selectedLastName}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Last Name</label>
                    <input
                      name="updatedLastName"
                      type="text"
                      value={this.state.updatedLastName}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedLastName}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Email Id</label>

                    <input
                      name="selectedEmail"
                      type="text"
                      value={this.state.selectedEmail}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Email id</label>
                    <input
                      name="updatedEmail"
                      type="text"
                      value={this.state.updatedEmail}
                      className="form-control"
                      disabled
                    />
                    <div className="text-danger">{this.state.errors.updatedEmail}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Alternate Email Id</label>
                    <input
                      name="selectedAlternateEmail"
                      type="text"
                      value={this.state.selectedAlternateEmail}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Alternate Email id</label>
                    <input
                      name="updatedAlternateEmail"
                      type="text"
                      value={this.state.updatedAlternateEmail}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedAlternateEmail}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Mobile No.</label>
                    <input
                      name="selectedMobileNumber"
                      type="text"
                      value={this.state.selectedMobileNumber}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Mobile No.</label>
                    <input
                      name="updatedMobileNumber"
                      type="text"
                      value={this.state.updatedMobileNumber}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedMobileNumber}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Alternate Mobile No.</label>
                    <input
                      name="selectedAlternateMobileNumber"
                      type="text"
                      value={this.state.selectedAlternateMobileNumber}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Alternate Mobile No.</label>
                    <input
                      name="updatedAlternateMobileNumber"
                      type="text"
                      value={this.state.updatedAlternateMobileNumber}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedAlternateMobileNumber}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old User Status</label>
                    <input
                      name="selectedUserStatus"
                      type="text"
                      value={this.state.selectedUserStatus}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-4">
                    <label>Updated User Status</label>
                    <select
                      name="updatedUserStatus"
                      onChange={this.handleChange}
                      className={`form-control
                 ${this.state.errors.updatedUserStatus ? 'is-invalid' : ''}`}
                    >
                      <option value="" />
                      {userStatus.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className="text-danger">
                      {this.state.errors.updatedUserStatus}
                    </div>
                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label> Old User Status Date</label>
                    <input
                      name="selectedUserStatusDate"
                      type="date"
                      value={this.state.selectedUserStatusDate}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                    <div className="text-danger">
                      {this.state.errors.selectedUserStatusDate}
                    </div>
                  </div>

                  <div className="form-group col-4">
                    <label> Updated User Status Date</label>
                    <input
                      name="updatedUserStatusDate"
                      type="date"
                      value={this.state.updatedUserStatusDate}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">
                      {this.state.errors.updatedUserStatusDate}
                    </div>
                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label> Old Added Date</label>
                    <input
                      name="selectedUserAddedDate"
                      type="date"
                      value={this.state.selectedUserAddedDate}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                    <div className="text-danger">
                      {this.state.errors.selectedUserAddedDate}
                    </div>
                  </div>

                  <div className="form-group col-4">
                    <label> Updated Added Date</label>
                    <input
                      name="updatedUserAddedDate"
                      type="date"
                      value={this.state.updatedUserAddedDate}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">
                      {this.state.errors.updatedUserAddedDate}
                    </div>
                  </div>

                </div>

                <input type="submit" value="Edit User" className="btn btn-success" />
              </form>
              <form className="post" onSubmit={this.handleselectSubmit}>
                <div style={{ width: '75%' }}>

                  <div style={{ marginTop: '2%' }}>
                    <div>
                      <Typography>
                        <h5>Equipment Access:</h5>
                      </Typography>
                    </div>
                    <label>Select Equipment</label>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <div style={{ width: '40%' }}>
                        <Select
                          options={this.state.selectOptions}
                          onChange={this.handleChangeDropdown}
                        />
                        <div className="text-danger">
                          {this.state.errors.deviceName}
                        </div>
                      </div>

                      <div>
                        <input type="submit" value="Add Equipment" className="btn btn-primary" color="primary" />
                      </div>
                    </div>
                  </div>
                </div>

              </form>
              <div key={userrow.id}>
                <div style={{
                  height: 300, width: '75%', marginTop: '3%',
                }}
                >
                  <DataGrid
                    checkboxSelection
                    rows={userrow}
                    columns={usercolumns}
                    pageSize={10}
                    icon
                    SettingsApplicationsOutlinedIcon
                    onRowSelected={(newSelection) => {
                      this.setState({
                        id: newSelection.data.id,
                        deviceName: newSelection.data.deviceName,
                        email: newSelection.data.email,
                      });
                    }}
                    SelectionModelCheckbox={this.state.SelectionModelCheckbox}
                  />
                  <br />
                </div>
              </div>
            </div>
          );
        })()}

      </div>

    );
  }
}

export default User;
