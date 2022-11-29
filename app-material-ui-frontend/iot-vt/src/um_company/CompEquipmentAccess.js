/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/sort-comp */
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
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid } from '@material-ui/data-grid';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

class CompEquipmentAccess extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      selectEquipment: '',
      selectStatus: '',
      selectOptions: [],
      errors: [],
      sensorReadingOne: [],

      companyEquipAccessInfo: [],
      loading: true,
      id: [],
    };
  }

  async componentDidMount() {
    const url = 'https://jsonplaceholder.typicode.com/users';
    const response = await axios.get(url);
    console.log(response.data);
    this.setState({ companyEquipAccessInfo: response.data, loading: false });
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

  fetchDevices = () => {
    fetch('http://192.168.0.194:5005/api/1.0/dashboard/devices')
      .then((response) => response.json())
      .then((devicelist) => {
        this.setState({ sensorReadingOne: devicelist, loading: true });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const data = {
        selectEquipment: this.state.selectEquipment,
        selectStatus: this.state.selectStatus,
      };
      axios
        .post('https://jsonplaceholder.typicode.com/users', data)
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

    if (!this.state.selectEquipment) {
      isValid = false;
      errors.selectEquipment = 'Please select equipment';
    }

    if (!this.state.selectStatus) {
      isValid = false;
      errors.selectStatus = 'Please select status';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const selectEquipment = [
      'Equipment1',
      'Equipment2',
    ];

    const selectStatus = [
      'Active',
      'InActive',
    ];

    const columns = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'equipmentName', headerName: 'Equipment Name', width: 200 },
      { field: 'activeStatus', headerName: 'Active Status', width: 200 },
      { field: 'statusDate', headerName: 'Status Date', width: 200 },

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
    this.state.companyEquipAccessInfo.map((it) => {
      row.push(
        {
          id: it.id,
          equipmentName: it.company.name,
          activeStatus: it.activeStatus,
          statusDate: it.statusDate,

        },
      );
    });

    console.log(row);

    return (
      <div className="post">

        <form className="post" onSubmit={this.handleSubmit}>
          <div className="form-row">

            <div className="form-group col-4">
              <label>Select Equipment</label>

              <select
                name="selectEquipment"
                style={{ width: 370, height: 37 }}
                onClick={this.fetchDevices}
                onChange={this.handleChange}
                className={`form-control
                 ${this.state.errors.selectEquipment ? 'is-invalid' : ''}`}
              >
                <option value="" />
                {this.state.sensorReadingOne.map((fid, i) => <option style={{ width: 300, height: 37 }} key={i} value={fid.id}>{fid.deviceName}</option>)}
              </select>
              <div className="text-danger">
                {this.state.errors.selectEquipment}
              </div>

            </div>

            <div className="form-group col-4">
              <label>Select Status</label>
              <select
                name="selectStatus"
                onChange={this.handleChange}
                className={`form-control
                 ${this.state.errors.selectStatus ? 'is-invalid' : ''}`}
              >
                <option value="" />
                {selectStatus.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="text-danger">
                {this.state.errors.selectStatus}
              </div>
            </div>
            <div className="form-group col-4" style={{ paddingLeft: '5%', paddingTop: '2%' }}>
              <input type="submit" value="Add Equipment" className="btn btn-primary" />
            </div>

          </div>

        </form>

        <div key={row.id}>
          <div style={{
            height: 350, width: '90%', marginTop: '0%',
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

export default CompEquipmentAccess;
