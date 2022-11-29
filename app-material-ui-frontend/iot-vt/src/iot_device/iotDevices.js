/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-access-state-in-setstate */
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
import Select from 'react-select';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import Typography from '@material-ui/core/Typography';

class IotDevices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      deviceInfo: [],
      id: [],
      openDeleteDialog: false,
      //
      deviceName: '',
      companyName: '',
      companyId: '',
      serialNumber: '',
      manufacturingDate: '',
      status: 'active',
      modelName: '',
      latestFirmwareVersion: '',
      deviceFirmwareVersion: '',
      // selected device
      selected_companyName: '',
      selected_companyId: '',
      selected_device_name: '',
      selected_device_serial_number: '',
      selected_manufacturing_date: '',
      selected_status: '',
      selected_modelName: '',
      selected_latestFirmwareVersion: '',
      selected_deviceFirmwareVersion: '',
      // updated device
      updated_device_name: '',
      updated_device_serial_number: '',
      updated_manufacturing_date: '',
      updated_status: '',
      updated_modelName: '',
      updated_latestFirmwareVersion: '',
      updated_deviceFirmwareVersion: '',
      selectOptions: [],
      errors: {},
    };
  }

  async componentDidMount() {
    this.getOptions();
    const url = ' http://192.168.0.194:5005/api/1.0/devices';
    const response = await axios.get(url);
    console.log(response.data);
    this.setState({ deviceInfo: response.data, loading: false });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleDelete = (event) => {
    const iotDeviceToDelete = this.state.selected_device_name;
    event.preventDefault();
    axios.delete(`http://192.168.0.194:5005/api/1.0/devices/${iotDeviceToDelete}`)
      .then((res) => {
        this.componentDidMount();
        this.state.selected_device_name = '';
        this.state.selected_device_serial_number = '';
        this.state.selected_manufacturing_date = '';
        this.state.selected_status = '';
        this.state.selected_modelName = '';
        this.state.selected_latestFirmwareVersion = '';
        this.state.selected_deviceFirmwareVersion = '';
        this.state.updated_device_name = '';
        this.state.updated_device_serial_number = '';
        this.state.updated_manufacturing_date = '';
        this.state.updated_status = '';
        this.state.updated_modelName = '';
        this.state.updated_latestFirmwareVersion = '';
        this.state.updated_deviceFirmwareVersion = '';
      });
  }

  handleError(error) {
    if (error.response && error.response.status === 404) {
      alert('Device not found');
    }
  }

  handleSubmitUpdated = (e) => {
    e.preventDefault();
    this.EditUpdate();
    if (this.validate()) {
      const devicedata = {
        deviceName: this.state.updated_device_name,
        serialNumber: this.state.updated_device_serial_number,
        manufacturingDate: this.state.updated_manufacturing_date,
        status: this.state.updated_status,
        modelName: this.state.updated_modelName,
        companyName: this.state.selected_companyName,
        deviceFirmwareVersion: this.state.updated_deviceFirmwareVersion,
        companyId: this.state.selected_companyId,
      };

      axios
        .put(`http://192.168.0.194:5005/api/1.0/devices/${this.state.selected_device_name}`, devicedata)
        .then(
          (res) => {
            if (res.status === 200) {
              alert('Device data updated Successfully..');
            }
            (error) => {
              this.handleError(error);
              return error;
            };
            this.state.selected_device_name = '';
            this.state.selected_device_serial_number = '';
            this.state.selected_manufacturing_date = '';
            this.state.selected_status = '';
            this.state.selected_modelName = '';
            this.state.selected_companyId = '';
            this.state.selected_latestFirmwareVersion = '';
            this.state.selected_deviceFirmwareVersion = '';
            this.state.updated_device_name = '';
            this.state.updated_device_serial_number = '';
            this.state.updated_manufacturing_date = '';
            this.state.updated_status = '';
            this.state.updated_modelName = '';
            this.state.updated_latestFirmwareVersion = '';
            this.state.updated_deviceFirmwareVersion = '';
            this.setState({ ...this.state });
            this.componentDidMount();
          },
        )
        .catch((apiError) => {
          // console.log(apiError);
        });
    }
  };

  handleChangeDropdown = (e) => {
    this.setState({ updated_modelName: e.label });
  }

  async getOptions() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/iotModels');
    const { data } = res;
    const options = data.map((d) => ({
      value: d.id,
      label: d.iotModelName,
    }));
    this.setState({ selectOptions: options });
  }

  EditUpdate() {
    if (this.state.updated_status == '') {
      this.state.updated_status = this.state.selected_status;
    }
    if (this.state.updated_device_name == '') {
      this.state.updated_device_name = this.state.selected_device_name;
    }

    if (this.state.updated_device_serial_number == '') {
      this.state.updated_device_serial_number = this.state.selected_device_serial_number;
    }

    if (this.state.updated_manufacturing_date == '') {
      this.state.updated_manufacturing_date = this.state.selected_manufacturing_date;
    }

    if (this.state.updated_modelName == '') {
      this.state.updated_modelName = this.state.selected_modelName;
    }

    if (this.state.updated_deviceFirmwareVersion == '') {
      this.state.updated_deviceFirmwareVersion = this.state.selected_deviceFirmwareVersion;
    }

    if (this.state.updated_deviceFirmwareVersion == '') {
      this.state.updated_deviceFirmwareVersion = this.state.selected_deviceFirmwareVersion;
    }

    if (this.state.companyId == '') {
      this.state.companyId = this.state.selected_companyId;
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.updated_device_name) {
      isValid = false;
      errors.updated_device_name = 'Please enter device name';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(this.state.updated_device_name)) {
      isValid = false;
      errors.updated_device_name = 'Device name should not contain any special character';
    }

    if (!this.state.updated_device_serial_number) {
      isValid = false;
      errors.updated_device_serial_number = 'Please enter device serial number.';
    } else if (!/^[a-z A-Z 0-9]+$/i.test(this.state.updated_device_serial_number)) {
      isValid = false;
      errors.updated_device_serial_number = 'This field should not contain special characters';
    }

    if (!this.state.updated_manufacturing_date) {
      isValid = false;
      errors.updated_manufacturing_date = 'Please select manufacturing date.';
    }

    if (!this.state.updated_modelName) {
      isValid = false;
      errors.updated_modelName = 'Please select model name';
    }

    if (!this.state.updated_status) {
      isValid = false;
      errors.updated_status = 'Please fill the status field';
    }

    if (!this.state.updated_deviceFirmwareVersion) {
      isValid = false;
      errors.updated_deviceFirmwareVersion = 'Please fill the version field';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const columns = [
      { field: 'modelName', headerName: 'Model Name', width: 150 },
      { field: 'deviceName', headerName: 'Device Name', width: 150 },
      { field: 'companyName', headerName: 'Company Name', width: 220 },
      { field: 'serialNumber', headerName: 'Device Serial Number', width: 400 },
      { field: 'manufacturingDate', headerName: 'Manufacturing Date', width: 200 },
      { field: 'status', headerName: 'Status', width: 150 },
      { field: 'latestFirmwareVersion', headerName: 'Server Firmware Version', width: 220 },
      { field: 'deviceFirmwareVersion', headerName: 'Device Firmware Version', width: 220 },
      {
        field: 'editButton',
        headerName: 'Edit',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {

          };

          return (
            <Button onClick={onClick}>
              <Link to="#">
                <EditIcon />
              </Link>
            </Button>
          );
        },
      },

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
    console.log(this.state.deviceInfo);
    this.state.deviceInfo.map((it) => {
      row.push(
        {
          id: it.id,
          modelName: it.iotModel.iotModelName,
          deviceName: it.deviceName,
          device_serial_number: it.device_serial_number,
          serialNumber: it.serialNumber,
          manufacturingDate: it.manufacturingDate,
          status: it.status,
          latestFirmwareVersion: it.latestFirmwareVersion,
          deviceFirmwareVersion: it.deviceFirmwareVersion,
          companyName: it.companyName,
          companyId: it.companyId,
        },
      );
    });

    console.log(row);

    return (
      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>
            <h3>IOT Devices</h3>
          </Typography>

          <div>
            <Link to="/iot_device/iotAddNewDevices.js" style={{ textDecoration: 'none' }}>
              <Button id="add-device-button" variant="contained" color="primary">
                Add New
              </Button>
            </Link>
          </div>
        </div>
        <div key={row.id}>
          <div style={{
            display: 'flex', height: 400, marginTop: '2%',
          }}
          >
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={10}
              icon
              SettingsApplicationsOutlinedIcon
              onRowSelected={(newSelection) => {
                this.setState({
                  selected_device_id: newSelection.data.id,
                  selected_device_name: newSelection.data.deviceName,
                  selected_device_serial_number: newSelection.data.serialNumber,
                  selected_manufacturing_date: newSelection.data.manufacturingDate,
                  selected_status: newSelection.data.status,
                  selected_modelName: newSelection.data.modelName,
                  selected_deviceFirmwareVersion: newSelection.data.deviceFirmwareVersion,
                  selected_companyId: newSelection.data.companyId,
                  selected_companyName: newSelection.data.companyName,
                });
              }}
              SelectionModelCheckbox={this.state.SelectionModelCheckbox}
              checkboxSelection
            />
            <br />
          </div>
        </div>

        {(() => {
          if (this.state.selected_device_serial_number === '') {
            return <h1> </h1>;
          }

          return (

            <div style={{ marginTop: '2%' }}>
              <form className="post" onSubmit={this.handleSubmitUpdated} style={{ paddingRight: '2%', paddingLeft: '20px' }}>
                <div className="form-row">

                  <div className="form-group col-6">
                    <label>Old Status</label>
                    <input
                      name="selected_status"
                      type="text"
                      value={this.state.selected_status}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>new Status</label>
                    <input
                      name="updated_status"
                      type="text"
                      value={this.state.updated_status}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updated_status}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Old Device Name</label>
                    <input
                      name="selected_device_name"
                      type="text"
                      value={this.state.selected_device_name}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated Device Name</label>
                    <input
                      name="updated_device_name"
                      type="text"
                      value={this.state.updated_device_name}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updated_device_name}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Old Device Serial Number</label>
                    <input
                      name="selected_device_serial_number"
                      type="int"
                      value={this.state.selected_device_serial_number}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated Device Serial Number</label>
                    <input
                      name="updated_device_serial_number"
                      type="int"
                      value={this.state.updated_device_serial_number}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">
                      {this.state.errors.updated_device_serial_number}
                    </div>
                  </div>

                  <div className="form-group col-6">
                    <label> Old Manufacturing Date</label>
                    <input
                      name="selected_manufacturing_date"
                      type="date"
                      value={this.state.selected_manufacturing_date}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated Manufacturing Date</label>
                    <input
                      name="updated_manufacturing_date"
                      type="date"
                      value={this.state.updated_manufacturing_date}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">
                      {this.state.errors.updated_manufacturing_date}
                    </div>
                  </div>

                  <div className="form-group col-6">
                    <label>Old model name</label>
                    <input
                      name="selected_modelName"
                      type="text"
                      value={this.state.selected_modelName}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated Model Name</label>
                    <Select
                      options={this.state.selectOptions}
                      onChange={this.handleChangeDropdown}
                    />
                    <div className="text-danger">
                      {this.state.errors.updated_modelName}
                    </div>
                  </div>

                  <div className="form-group col-6">
                    <label>Old firmware Version</label>
                    <input
                      name="selected_deviceFirmwareVersion"
                      type="text"
                      value={this.state.selected_deviceFirmwareVersion}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated firmware version</label>
                    <input
                      name="updated_deviceFirmwareVersion"
                      type="text"
                      value={this.state.updated_deviceFirmwareVersion}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">
                      {this.state.errors.updated_deviceFirmwareVersion}
                    </div>
                  </div>
                </div>
                <input type="submit" value="Edit Device" className="btn btn-success" />
              </form>

            </div>

          );
        })()}

      </div>

    );
  }
}

export default IotDevices;
