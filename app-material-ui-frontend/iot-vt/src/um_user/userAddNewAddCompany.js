/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
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
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';

class UserAddNewAddCompany extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      selectCompany: '',
      role: '',
      selectOptions: [],
      errors: [],
      userAddCompanyDataGridInfo: [],
      id: [],
    };
  }

  async componentDidMount() {
    const url = 'https://jsonplaceholder.typicode.com/users';
    const response = await axios.get(url);

    this.setState({ userAddCompanyDataGridInfo: response.data, loading: false });
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
      const data = {
        selectCompany: this.state.selectCompany,
        role: this.state.role,
      };
      axios
        .post('https://jsonplaceholder.typicode.com/users', data)
        .then((res) => {
          if (res.status === 201) {
            alert('Data Added Successfully..');
          }
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

  handleChangeDropdown = (e) => {
    this.setState({ iotModelName: e.label, id: e.value });
  }

  handleDelete = (event) => {
    const iotDeviceToDelete = this.state.deviceName;
    event.preventDefault();
    axios.delete('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
      });
    setTimeout(() => {
      window.location.reload();
    }, 100);
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

    if (!this.state.selectCompany) {
      isValid = false;
      errors.selectCompany = 'Please select company';
    }

    if (!this.state.role) {
      isValid = false;
      errors.role = 'Please select role';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const selectCompany = [
      'Company1',
      'Company2',
      'Company3',
      'Company4',
    ];

    const role = [
      'App Admin',
      'Customer Admin',
      'Customer User',
    ];

    const columns = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'companyName', headerName: 'Company Name', width: 200 },
      { field: 'role', headerName: 'Role', width: 200 },
      {
        field: 'deleteButton',
        headerName: 'Delete',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {
          };

          return <Button type="submit" onClick={this.handleDelete}><DeleteIcon /></Button>;
        },
      },
    ];

    const row = [];
    this.state.userAddCompanyDataGridInfo.map((it) => {
      row.push(
        {
          id: it.id,
          companyName: it.company.name,
          role: it.role,

        },
      );
    });

    return (
      <div className="post">
        <div style={{ paddingTop: '1%' }}>
          <Typography>
            <h5>Company:</h5>
          </Typography>
        </div>
        <form className="post" onSubmit={this.handleSubmit}>
          <div className="form-row">

            <div className="form-group col-4">
              <label>Select Company</label>
              <select
                name="selectCompany"
                onChange={this.handleChange}
                className={`form-control
                 ${this.state.errors.selectCompany ? 'is-invalid' : ''}`}
              >
                <option value="" />
                {selectCompany.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="text-danger">
                {this.state.errors.selectCompany}
              </div>
            </div>

            <div className="form-group col-4">
              <label>Select Role</label>
              <select
                name="role"
                onChange={this.handleChange}
                className={`form-control
                 ${this.state.errors.role ? 'is-invalid' : ''}`}
              >
                <option value="" />
                {role.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="text-danger">
                {this.state.errors.role}
              </div>
            </div>

            <div className="form-group col-4" style={{ paddingLeft: '7%', paddingTop: '2.5%' }}>
              <input type="submit" value="Add Company" className="btn btn-primary" />
            </div>

          </div>

        </form>

        <div key={row.id}>
          <div style={{
            height: 400, width: '100%', marginTop: '0%', marginLeft: '0%',
          }}
          >
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={10}
              icon
              SettingsApplicationsOutlinedIcon
              onRowSelected={(newSelection) => {
                this.setState({ equipmentName: newSelection.data.equipmentName });
                console.log('buildingName: ', newSelection.data.equipmentName);
              }}
              SelectionModelCheckbox={this.state.SelectionModelCheckbox}
            />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default UserAddNewAddCompany;
