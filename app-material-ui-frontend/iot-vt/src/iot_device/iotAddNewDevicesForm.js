/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
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
import Select from 'react-select';

class IotAddNewDevicesForm extends Component {
  constructor() {
    super();
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      iotModelName: '',
      status: 'active',
      device_name: '',
      device_serial_number: '',
      manufacturing_date: '',
      select_firmware: '',
      selectOptions: [],
      companyName: '',
      companyId: '',
      selectOptionsModel: [],
      errors: [],
      companyDataFromUser: '',
      companyData: {},
    };
  }

  async componentDidMount() {
    this.getOptions();
    this.getOptionsModel();
  }

  handleRadioChange(event) {
    // set the new value of checked radion button to state using setState function which is async funtion
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
      alert('There is already a device present with same name');
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const data = {
        status: this.state.status,
        deviceName: this.state.device_name,
        serialNumber: this.state.device_serial_number,
        manufacturingDate: this.state.manufacturing_date,
        modelName: this.state.iotModelName,
        deviceFirmwareVersion: this.state.select_firmware,
        companyId: this.state.companyId,
        companyName: this.state.companyName,
      };

      axios
        .post('http://192.168.0.194:5005/api/1.0/devices', data)
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

  async getOptionsModel() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/iotModels');
    const { data } = res;
    const options = data.map((d) => ({
      value: d.id,
      label: d.iotModelName,
    }));
    this.setState({ selectOptionsModel: options });
  }

  handleChangeDropdownCompany = (e) => {
    this.setState({ companyName: e.label, companyId: e.value });
  }

  async getOptions() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/company/');
    const { data } = res;
    const options = data.map((d) => ({
      value: d.id,
      label: d.companyName,
    }));
    this.setState({ selectOptions: options });
    console.log(this.state.selectOptions);
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.device_name) {
      isValid = false;
      errors.device_name = 'Please enter device name';
    } else if (!/^[a-z A-Z 0-9]+$/i.test(this.state.device_name)) {
      isValid = false;
      errors.device_name = 'This field should not contain special characters';
    }

    if (!this.state.device_serial_number) {
      isValid = false;
      errors.device_serial_number = 'Please enter device serial number.';
    } else if (!/^[a-z A-Z 0-9]+$/i.test(this.state.device_serial_number)) {
      isValid = false;
      errors.device_serial_number = 'This field should not contain special characters';
    }

    if (!this.state.manufacturing_date) {
      isValid = false;
      errors.manufacturing_date = 'Please select manufacturing date.';
    }

    if (!this.state.iotModelName) {
      isValid = false;
      errors.iotModelName = 'Please select model name';
    }

    if (!this.state.select_firmware) {
      isValid = false;
      errors.select_firmware = 'Please select firmware';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const select_firmware = ['FFFF'];

    return (
      <div
        className="post"

      >

        <form className="post" onSubmit={this.handleSubmit}>
          <div className="form-row">
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

            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>

            <div className="form-group col-4">
              <label>Device Name</label>
              <input
                name="device_name"
                type="text"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">{this.state.errors.device_name}</div>
            </div>

            <div className="form-group col-4">
              <label>Device Serial Number</label>
              <input
                name="device_serial_number"
                type="int"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">
                {this.state.errors.device_serial_number}
              </div>
            </div>

            <div className="form-group col-4">
              <label>Manufacturing Date</label>
              <input
                name="manufacturing_date"
                type="date"
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">
                {this.state.errors.manufacturing_date}
              </div>
            </div>

            <div className="form-group col-4">
              <label>Model Name</label>
              <Select
                options={this.state.selectOptionsModel}
                onChange={this.handleChangeDropdown}
              />
              <div className="text-danger">
                {this.state.errors.iotModelName}
              </div>
            </div>

            <div className="form-group col-4">
              <label>Select Firmware</label>
              <select
                name="select_firmware"
                onChange={this.handleChange}
                className={`form-control
                 ${this.state.errors.select_firmware ? 'is-invalid' : ''}`}
              >
                <option value="" />
                {select_firmware.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="text-danger">
                {this.state.errors.select_firmware}
              </div>
            </div>

            <div className="form-group col-4">
              <label>Company Name</label>
              <Select
                options={this.state.selectOptions}
                onChange={this.handleChangeDropdownCompany}
              />
              <div className="text-danger">
                {this.state.errors.companyName}
              </div>
            </div>

          </div>
          <div className="form-group col-4">
            <input id="add-device" type="submit" value="Submit" className="btn btn-primary" />
            <Link to="/iot_device/iotDevices.js" style={{ textDecoration: 'none' }}>
              <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '2%' }} />
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default IotAddNewDevicesForm;
