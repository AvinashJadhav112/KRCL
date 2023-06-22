/* eslint-disable no-unused-vars */
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

      updateddDevicename: '',
      updatedSerialnumber: '',
      updatedManufacturingdate: '',
      updatedModelname: '',
      updatedStatus: '',
      updatedDevicefirmwareversion: '',

      selected_devicename: '',
      selected_serialnumber: '',
      selected_manufacturingdate: '',
      selected_modelname: '',
      selected_status: '',
      selected_devicefirmwareversion: '',

      errors: {},
    };
  }

  async componentDidMount() {
    const id = window.location.href.split('/')[6];
    await axios.get(`http://192.168.0.194:5005/api/1.0/device/${id}`)
      .then((response) => {
        this.setState({ response: response.data });
        this.setState({ selected_devicename: response.data.deviceName });
        this.setState({ selected_serialnumber: response.data.serialNumber });
        this.setState({ selected_manufacturingdate: response.data.manufacturingDate });
        this.setState({ selected_modelname: response.data.modelName });
        this.setState({ selected_status: response.data.status });
        this.setState({ selected_devicefirmwareversion: response.data.deviceFirmwareVersion });
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = (e) => {
    const deviceId = window.location.href.split('/')[6];

    e.preventDefault();
    this.EditUpdate();
    if (this.validate()) {
      this.state.response.deviceName = this.state.updateddDevicename;
      this.state.response.serialNumber = this.state.updatedSerialnumber;
      this.state.response.manufacturingDate = this.state.updatedManufacturingdate;
      this.state.response.modelName = this.state.updatedModelname;
      this.state.response.status = this.state.updatedStatus;
      this.state.response.deviceFirmwareVersion = this.state.updatedDevicefirmwareversion;
      axios
        .put(`http://192.168.0.194:5005/api/1.0/devices/updateByID/${deviceId}`, this.state.response)
        .then(
          (res) => {
            if (res.status === 200) {
              alert('Device data updated successfully..');
              this.props.history.push('/iot_device/iotDevices.js');
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
    if (this.state.updateddDevicename === '') {
      this.state.updateddDevicename = this.state.selected_devicename;
    }
    if (this.state.updatedSerialnumber === '') {
      this.state.updatedSerialnumber = this.state.selected_serialnumber;
    }

    if (this.state.updatedManufacturingdate === '') {
      this.state.updatedManufacturingdate = this.state.selected_manufacturingdate;
    }

    if (this.state.updatedModelname === '') {
      this.state.updatedModelname = this.state.selected_modelname;
    }

    if (this.state.updatedStatus === '') {
      this.state.updatedStatus = this.state.selected_status;
    }

    if (this.state.updatedDevicefirmwareversion === '') {
      this.state.updatedDevicefirmwareversion = this.state.selected_devicefirmwareversion;
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.updateddDevicename) {
      isValid = false;
      errors.updateddDevicename = 'Please enter Device name.';
    } else
    if (!/^[ a-z A-Z 0-9 ]+$/i.test(this.state.updateddDevicename)) {
      isValid = false;
      errors.updateddDevicename = 'Device name should be character only';
    }

    if (!this.state.updatedModelname) {
      isValid = false;
      errors.updatedModelname = 'Please enter Model Name.';
    } else
    // eslint-disable-next-line no-constant-condition
    if (!/^[ a-z A-Z 0-9 ]+$/) {
      isValid = false;
      errors.updatedModelname = 'Model name should be character only';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    return (
      <div>
        <div style={{
          border: '1px solid grey', width: '40%', padding: '2% 0 2% 5%', borderRadius: '15px', margin: '8% 0 0 20%',
        }}
        >
          <form onSubmit={this.handleSubmit} style={{ margin: '2% -9% 0 0', width: '198%' }}>
            <div className="form-row" />
            <Typography>
              <h3>Edit Device</h3>
            </Typography>

            <div className="form-row">

              <div className="form-group col-5">
                <label>Update Device Name</label>
                <input
                  name="updateddDevicename"
                  type="text"
                  placeholder={this.state.selected_devicename}
                  value={this.state.updateddDevicename}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.updateddDevicename}</div>
              </div>

            </div>

            <div className="form-row">

              <div className="form-group col-5">
                <label>Update Serial Number</label>
                <input
                  name="updatedSerialnumber"
                  type="text"
                  placeholder={this.state.selected_serialnumber}
                  value={this.state.updatedSerialnumber}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.updatedSerialnumber}</div>
              </div>

            </div>

            <div className="form-row">

              <div className="form-group col-5">
                <label>Update Manufacturing Date</label>
                <input
                  name="updatedManufacturingdate"
                  type="date"
                  placeholder={this.state.selected_manufacturingdate}
                  value={this.state.updatedManufacturingdate}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.updatedManufacturingdate}</div>
              </div>

            </div>

            <div className="form-row">

              <div className="form-group col-5">
                <label>Update Model Name</label>
                <input
                  name="updatedModelname"
                  type="text"
                  placeholder={this.state.selected_modelname}
                  value={this.state.updatedModelname}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.updatedModelname}</div>
              </div>

            </div>

            <div className="form-row">

              <div className="form-group col-5">
                <label>Status</label>
                <input
                  name="updatedStatus"
                  type="text"
                  placeholder={this.state.selected_status}
                  value={this.state.updatedStatus}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.updatedStatus}</div>
              </div>
            </div>

            <div className="form-row">

              <div className="form-group col-5">
                <label>Update Device Firmware</label>
                <input
                  name="updatedDevicefirmwareversion"
                  type="text"
                  placeholder={this.state.selected_devicefirmwareversion}
                  value={this.state.updatedDevicefirmwareversion}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.updatedDevicefirmwareversion}</div>
              </div>

            </div>

            <div style={{ display: 'flex' }}>
              <input type="submit" value="Edit Device Details" className="btn btn-success" />
              <Link to="/iot_device/iotDevices.js" style={{ textDecoration: 'none' }}>
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
