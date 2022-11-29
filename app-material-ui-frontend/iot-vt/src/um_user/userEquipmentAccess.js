/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-array-index-key */
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
import Select from 'react-select';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';

class UserEquipmentAccess extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      selectEquipment: '',
      selectOptions: [],
      sensorReadingOne: [],
      errors: [],
      id: [],
      userEquipAccessInfo: [],
    };
  }

  async componentDidMount() {
    const url = 'https://jsonplaceholder.typicode.com/users';
    const response = await axios.get(url);
    this.setState({ userEquipAccessInfo: response.data, loading: false });
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

  // eslint-disable-next-line react/sort-comp
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

  handleDelete = (event) => {
    const iotDeviceToDelete = this.state.deviceName;
    event.preventDefault();
    axios.delete('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        // console.log(res);
      });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

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
      errors.selectEquipment = 'Please select  equipment';
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
      'Equipment3',
      'Equipment4',
    ];

    const columns = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'equipmentName', headerName: 'Equipment Name', width: 200 },
      { field: 'activeStatus', headerName: 'Active Status', width: 200 },
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
    this.state.userEquipAccessInfo.map((it) => {
      row.push(
        {
          id: it.id,
          equipmentName: it.company.name,
          activeStatus: it.activeStatus,
        },
      );
    });

    return (
      <div className="post">
        <div style={{ paddingTop: '1%' }}>
          <Typography>
            <h5>Equipment Access:</h5>
          </Typography>
        </div>
        <form className="post" onSubmit={this.handleSubmit}>
          <div className="form-row">

            <div className="form-group col-4">
              <label>Select Equipment</label>

              <select
                name="selectEquipment"
                style={{ width: 300, height: 37 }}
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

            <div className="form-group col-4" style={{ paddingLeft: '7%', paddingTop: '2%' }}>
              <input type="submit" value="Add Equipment" className="btn btn-primary" />
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

export default UserEquipmentAccess;
