/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-unreachable */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/button-has-type */

/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable no-unused-vars */
// import ResponsiveDrawer from './components/drawer.js';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Select from 'react-select';
// import CustomerAdd from '.page/CustomerAdd.js'

import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
      paddingBottom: '2%',
    },
  },
  root2: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      paddingBottom: '2%',
      margiLeft: '20%',
    },
  },
  FormControlLabel: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '50%',
    paddingTop: '0%',
  },
}));

class FirmwareAdd extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      loading: true,
      firmwareVersion: '',
      firmwareName: '',
      status: '',
      statuschangedon: '',
      firmwareAddedDate: '',
      errors: [],
      firmwareApp1: '',
      firmwareApp2: '',
      file: null,
      file1: null,
      base64URL: '',
      uploadFile: '',
      addDate: '',
      selectOptions: [],
      deviceName: '',
      id: '',
    };
  }

  async componentDidMount() {
    this.getOptions();
    const { data } = await axios.get(
      'http://192.168.0.194:5005/api/v1/firmwares/getFirmwareDetails',
    );
    this.state.firmwareList = data;
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a firmware with the same name.');
    } else if (error.response && error.response.status === 404) {
      alert('Firmware not found');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 400) {
      alert('Bad Request');
    } else if (error.response && error.response.status === 403) {
      alert('Forbidden');
    }
  }

  handleErrors(error) {
    if (error.response && error.response.status === 400) {
      alert('Failed to upload');
    } else if (error.response && error.response.status === 404) {
      alert('Firmware not found');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 403) {
      alert('Forbidden');
    } else if (error.response && error.response.status === 409) {
      alert('Request Conflict');
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    if (this.validate()) {
      let firmwareTobeStored = true;
      this.state.firmwareList.map((firmware) => {
        if (
          firmware.firmwareName === this.state.firmwareName
          || firmware.firmwareVersion === this.state.firmwareVersion
        ) {
          firmwareTobeStored = false;
        }
      });
      console.log(firmwareTobeStored);
      if (firmwareTobeStored) {
        const data = {
          firmwareApp1: this.state.file,
          firmwareApp2: this.state.file1,
          firmwareName: this.state.firmwareName,
          firmwareVersion: this.state.firmwareVersion,
          firmwareAddedDate: this.state.firmwareAddedDate,
          // deviceName: this.state.deviceName,
        };
        formData.append('bank1 image', data.firmwareApp1);
        formData.append('bank2 image', data.firmwareApp2);
        formData.append('firmwareName', data.firmwareName);
        formData.append('firmwareVersion', data.firmwareVersion);
        formData.append('firmwareAddedDate', data.firmwareAddedDate);
        // To check if keys are rendering or not
        for (const key of formData.keys()) {
          console.log(key);
        }
        // To check if value is rendering or not
        for (const value of formData.entries()) {
          console.log(value);
        }
        console.log(formData);
        const config = {
          headers: {
            'content-type': `multipart/form-data; boundary=${formData.boundary}`,
          },
        };
        axios
          .post(
            `http://192.168.0.194:5005/api/v1/firmwares/${this.state.firmwareVersion}`,
            formData,
            config,
          )
          .then(
            (res) => {
              console.log(res.data);
              console.log(formData);
              if (res.status === 204 || res.status === 200 || res.status === 201) {
                alert('Firmware uploaded successfully.');
              }
            },
            (error) => {
              this.handleErrors(error);
              return error;
            },
          );
      } else {
        this.state.firmwareList.map((firmware) => {
          if (
            firmware.firmwareName === this.state.firmwareName
            && firmware.firmwareVersion === this.state.firmwareVersion
          ) {
            this.setState({
              firmwareName: '',
              firmwareVersion: '',
            });
            alert(
              'Firmware Name and Firmware Version already exist, please try with a different Name and Version.',
            );
          } else if (firmware.firmwareName === this.state.firmwareName) {
            this.setState({
              firmwareName: '',
            });
            alert('Firmware Name already exists, please try with a different Name.');
          } else if (firmware.firmwareVersion === this.state.firmwareVersion) {
            this.setState({
              firmwareVersion: '',
            });
            alert('Firmware Version already exists, please try with a different Version.');
          }
        });
      }
    }
  }

  async getOptions() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/devices');
    const { data } = res;

    const options = data.map((d) => ({
      value: d.id,
      label: d.deviceName,
    }));

    this.setState({ selectOptions: options });
  }

  handleChangeDropdown = (e) => {
    this.setState({ deviceName: e.label, id: e.value });
  };

  handleFileInputChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      file: e.target.files[0],
    });
  };

  handleFileInputChange1 = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      file1: e.target.files[0],
    });
  };

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.firmwareName) {
      isValid = false;
      errors.firmwareName = 'Please enter Firmware Name.';
    }

    if (!this.state.firmwareVersion) {
      isValid = false;
      errors.firmwareVersion = 'Please enter Version.';
    }
    if (!this.state.firmwareAddedDate) {
      isValid = false;
      errors.firmwareAddedDate = 'Please enter Date.';
    }
    if (!this.state.file) {
      isValid = false;
      errors.file = 'Please select a file.';
    }

    if (!this.state.file1) {
      isValid = false;
      errors.file1 = 'Please select a file.';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    return (
      <div style={{
        marginTop: '8%', marginLeft: '27%', border: '1px solid #ccc', padding: '2%', borderRadius: '10px', width: '50%',
      }}
      >
        <div>
          <h3>Firmware/Add Firmware</h3>
        </div>

        <form className="post" onSubmit={this.handleSubmit}>
          <div className="form-row" style={{ paddingLeft: '1%' }}>
            <div className="form-group col-12">
              <label>Firmware Name</label>
              <input
                name="firmwareName"
                type="text"
                value={this.state.firmwareName}
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">{this.state.errors.firmwareName}</div>
            </div>

            <div className="form-group col-12">
              <label>Version</label>
              <input
                name="firmwareVersion"
                type="text"
                value={this.state.firmwareVersion}
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">{this.state.errors.firmwareVersion}</div>
            </div>

            <div className="form-group col-12">
              <label>Add Date</label>
              <input
                name="firmwareAddedDate"
                type="date"
                value={this.state.firmwareAddedDate}
                onChange={this.handleChange}
                className="form-control"
              />
              <div className="text-danger">{this.state.errors.firmwareAddedDate}</div>
            </div>
          </div>
          <div className="form-group col-12">
            <label>Firmware Bank 1 </label>
            <input
              name="firmwareApp1"
              type="file"
              accept=".bin"
              key="bank1 image"
              onChange={this.handleFileInputChange}
              className="form-control"
            />
            <div className="text-danger">{this.state.errors.file}</div>
          </div>

          <div className="form-group col-12">
            <label>Firmware Bank 2 </label>
            <input
              name="firmwareApp2"
              type="file"
              accept=".bin"
              key="bank2 image"
              onChange={this.handleFileInputChange1}
              className="form-control"
            />
            <div className="text-danger">{this.state.errors.file1}</div>
          </div>

          <div className="form-group col-12">
            <button type="submit" className="btn btn-primary">
              Upload Firmware
            </button>
            <button onClick={() => window.history.go(-1)} className="btn btn-secondary ml-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default FirmwareAdd;
