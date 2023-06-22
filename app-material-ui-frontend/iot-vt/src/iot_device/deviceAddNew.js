/* eslint-disable consistent-return */
/* eslint-disable react/sort-comp */
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
import Select from 'react-select';

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

class deviceAddnew extends Component {
  constructor() {
    super();
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      companyName: '',
      deviceName: '',
      serialNumber: '',
      manufacturingDate: '',
      modelName: '',
      status: '',
      serverFirmwareVersion: '',
      deviceFirmwareVersion: '',
      mheEquipmentName: '',
      selectOptionsModel: [],
      selectOptions: [],
      selectOptionsmheequipment: [],
      errors: [],
    };
  }

  async componentDidMount() {
    await this.getOptions();
    await this.getOptionsModel();
    await this.getEquipments();
    const { data } = await axios.get(
      'http://192.168.0.194:5005/api/1.0/devices',
    );
    this.state.deviceList = data;
  }

  handleRadioChange(event) {
    this.setState({
      status: event.target.value,
    });
  }

  async getOptions() {
    const response = await axios.get(
      'http://192.168.0.194:5005/api/1.0/company/',
    );
    const { data } = response;
    const options = data.map((data) => ({
      label: data.companyName,
    }));
    this.setState({ selectOptions: options });
  }

  handleChangeDropdownCompany = (e) => {
    this.setState({ companyName: e.label });
  };

  async getOptionsModel() {
    const response = await axios.get('http://192.168.0.194:5005/api/1.0/iotModels');
    const { data } = response;
    const options = data.map((data) => ({
      label: data.iotModelName,
    }));
    this.setState({ selectOptionsModel: options });
  }

  handleChangeDropdown = (e) => {
    this.setState({ modelName: e.label });
  };

  async getEquipments() {
    const url = await axios.get('http://192.168.0.194:5005/api/1.0/mheEquipment/');
    const { data } = url;
    const equipment = data.map((equipment) => ({
      label: equipment.mheEquipmentName,
    }));
    this.setState({ selectOptionsmheequipment: equipment });
  }

  handleChangeDropdownEquipment = (e) => {
    this.setState({ mheEquipmentName: e.label });
  };

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
    // console.log('first');
    if (this.validate()) {
      const UserTobeStored = true;
      if (UserTobeStored) {
        const data = {
          companyName: this.state.companyName,
          deviceName: this.state.deviceName,
          serialNumber: this.state.serialNumber,
          manufacturingDate: this.state.manufacturingDate,
          modelName: this.state.modelName,
          status: this.state.status,
          serverFirmwareVersion: this.state.serverFirmwareVersion,
          deviceFirmwareVersion: this.state.deviceFirmwareVersion,
          mheEquipmentName: this.state.mheEquipmentName,
        };

        axios
          .post('http://192.168.0.194:5005/api/1.0/devices', data)
          .then(
            (res) => {
              if (res.status === 201) {
                alert('Device Added Successfully..');
                this.props.history.push('/iot_device/iotDevices.js');
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
        this.state.deviceList.map((device) => {
          if (
            device.companyName === this.state.companyName
            && device.deviceName === this.state.deviceName
            && device.serialNumber === this.state.serialNumber
          ) {
            this.setState({
              companyName: '',
              deviceName: '',
              serialNumber: '',
            });
            alert(
              'These Device details already exists, please try with different details',
            );
          } else if (device.companyName === this.state.companyName) {
            this.setState({
              companyName: '',
            });
            alert('Company Name already exists, please try with different Name');
          } else if (device.deviceName === this.state.deviceName) {
            this.setState({
              deviceName: '',
            });
            alert('Device Name already exists, please try with different URL');
          } else if (device.serialNumber === this.state.serialNumber) {
            this.setState({
              serialNumber: '',
            });
            alert(
              'This Serial Number already exists, please try with different number',
            );
          }
        });
      }
    }
  };

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.companyName) {
      isValid = false;
      errors.companyName = 'Please enter Company name';
    } else if (!/^[a-z A-Z ]+$/i.test(this.state.companyName)) {
      isValid = false;
      errors.companyName = 'Company name should be character only';
    }

    if (!this.state.deviceName) {
      isValid = false;
      errors.deviceName = 'Device Name should be character only';
    }

    if (!this.state.manufacturingDate) {
      isValid = false;
      errors.manufacturingDate = 'Please select Manufacturing date';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const options = [
      { value: ' ', label: ' ' },
      { value: 'FFFF', label: 'FFFF' },
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
            <h3>Add Device</h3>
          </div>

          <form style={{ width: '75%' }} onSubmit={this.handleSubmit}>
            <div className="row" style={{ marginRight: '-18%' }}>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className=" "> </div>
              <div className="mt-2 ">
                <label>Device Name</label>
                <input
                  // style={{ width: '70%' }}
                  name="deviceName"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.deviceName}</div>
              </div>
              <div className="mt-2">
                <label>Company Name</label>
                <Select
                  options={this.state.selectOptions}
                  onChange={this.handleChangeDropdownCompany}
                />
                <div className="text-danger">
                  {this.state.errors.companyName}
                </div>
              </div>

              <div className="mt-2 ">
                <label>Serial Number</label>
                <input
                  // style={{ width: '70%' }}
                  name="serialNumber"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.serialNumber}</div>
              </div>

              <div className="mt-2">
                <label> Device Added Date</label>
                <input
                  // style={{ width: '70%' }}
                  name="manufacturingDate"
                  type="date"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.manufacturingDate}
                </div>
              </div>

              <div className="mt-2">
                <label>Model Name</label>
                <Select
                  options={this.state.selectOptionsModel}
                  onChange={this.handleChangeDropdown}
                />
                <div className="text-danger">
                  {this.state.errors.modelName}
                </div>
              </div>

              <div className="mt-2">
                <label>Status</label>
                <select
                  name="status"
                  onChange={this.handleChange}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 10px',
                    borderRadius: '4px',
                  }}
                >
                  {status.map((status) => (
                    <option value={status.value}>{status.value}</option>
                  ))}
                </select>
              </div>

              <div className="mt-2 ">
                <label>Server Firmware Version</label>
                <input
                  name="serverFirmwareVersion"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">
                  {this.state.errors.serverFirmwareVersion}
                </div>
              </div>

              <div className="mt-2">
                <label>Device Firmware Version</label>
                <select
                  name="deviceFirmwareVersion"
                  onChange={this.handleChange}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 10px',
                    borderRadius: '4px',
                  }}
                >
                  {options.map((status) => (
                    <option value={status.value}>{status.value}</option>
                  ))}
                </select>
              </div>

              <div className="mt-2">
                <label>MHE Equipment Name</label>
                <Select
                  options={this.state.selectOptionsmheequipment}
                  onChange={this.handleChangeDropdownEquipment}
                />
                <div className="text-danger">{this.state.errors.mheEquipmentName}</div>
              </div>
            </div>

            <div className="mt-3 ">
              <input type="submit" value="Submit" className="btn btn-primary" />
              <Link to="/iot_device/iotDevices.js" style={{ textDecoration: 'none' }}>
                <input
                  type="reset"
                  value="Cancel"
                  className="btn btn-secondary"
                  style={{ marginLeft: '2%' }}
                />
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

export default deviceAddnew;
