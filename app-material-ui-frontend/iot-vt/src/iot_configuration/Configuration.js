/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
// import ResponsiveDrawer from './components/drawer.js';
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFirmwareDownloadChange = this.handleFirmwareDownloadChange.bind(this);
    this.handleFirmwareDropDownChange = this.handleFirmwareDropDownChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      loading: true,
      age: '',
      name: 'hai',
      firmwareDownload: '',
      password: '',
      errors: [],
      sensorReadingOne: [],
      selectValue: [],
      id: 1,
      firmwareList: [],
      iotDeviceData: {},
    };
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a model with same name..');
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };

  handleFirmwareDownloadChange = (e) => {
    const selectedFirmware = e.target.value;
    const firmwareData = selectedFirmware.split(' ');
    this.setState({
      firmwareDownload: firmwareData,
      firmwareId: firmwareData[0],
      serverFirmwareVersion: firmwareData[1],
    });
    this.state.iotDeviceData = {
      serialNumber: this.state.serialNumber,
      modelName: this.state.modelName,
      status: this.state.status,
      manufacturingDate: this.state.manufacturingDate,
      deviceID: this.state.id,
      deviceName: this.state.deviceName,
      deviceFirmwareVersion: this.state.deviceFirmwareVersion,
      timezone: this.state.timezone,
      downloadStatus: this.state.downloadStatus,
      firmwareId: firmwareData[0],
      serverFirmwareVersion: firmwareData[1],
    };
  }

  handleFirmwareDropDownChange = (e) => {
    try {
      axios.get('http://192.168.0.194:5005/api/v1/firmwares/getFirmwareDetails')
        .then((res) => {
          const { data } = res;
          console.log(data);
          this.setState({ firmwareList: data });
        });
    } catch (err) {
      console.log(err);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validate()) {
      console.log(this.state.firmwareList);
      axios.post(`http://192.168.0.194:5005/api/v1/firmwares/device/${this.state.deviceName}`, this.state.iotDeviceData)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            alert('Firmware Updated Successfully wait for download to finish....');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  fetchDevices = () => {
    fetch('http://192.168.0.194:5005/api/1.0/dashboard/devices')
      .then((response) => response.json())
      .then((devicelist) => {
        this.setState({ sensorReadingOne: devicelist, loading: true });
      });
  };

   handleDropdownChange = async (e) => {
     const selectValue = e.target.value;
     console.log(selectValue);
     await axios
       .get(`http://192.168.0.194:5005/api/1.0/device/${selectValue}`)
       .then((res) => {
         const { data } = res;
         console.log(data);
         this.setState({
           serialNumber: data.serialNumber,
           modelName: data.modelName,
           status: data.status,
           manufacturingDate: data.manufacturingDate,
           deviceID: data.id,
           deviceName: data.deviceName,
           deviceFirmwareVersion: data.deviceFirmwareVersion === null ? 'Default' : data.deviceFirmwareVersion,
           timezone: data.timezone,
           downloadStatus: data.downloadStatus,
           serverFirmwareVersion: data.serverFirmwareVersion,
         });
         console.log(data);
       })
       .catch((err) => {
         console.log('Error =>', err);
       });
   }

   validate() {
     const errors = {};
     let isValid = true;

     if (!this.state.firmwareDownload) {
       isValid = false;
       errors.firmwareDownload = 'Please select Firmware';
     }

     if (!this.state.password) {
       isValid = false;
       errors.password = 'Please enter password';
     }
     this.setState({
       errors,
     });

     return isValid;
   }

   render() {
     const columns = [
       { field: 'deviceID', headerName: 'Device ID', width: 300 },
       { field: 'deviceName', headerName: 'Device Name', width: 220 },
       {
         field: 'deviceFV',
         headerName: 'Device Firmware Version',
         width: 300,
       },
       {
         field: 'serverFV',
         headerName: 'Server Firmware Version',
         width: 300,
       },
       {
         field: 'communicationStatus',
         headerName: 'Configuration Status',
         width: 200,
       },
     ];

     const rows = [
       {
         id: this.state.id,
         deviceName: this.state.deviceName,
         deviceID: this.state.deviceID,
         deviceFV: this.state.deviceFirmwareVersion,
         serverFV: this.state.serverFirmwareVersion,
         communicationStatus: this.state.downloadStatus,
       },
     ];

     return (
       <div
         style={{
           marginTop: '8%',
           marginLeft: '5%',
         }}
       >
         <div>
           <Typography>
             <h3> Configure request to Assign firmware</h3>
           </Typography>
         </div>

         <div>
           <form>
             <div className="form-group col-4">
               <label>Select Device</label>

               <select
                 style={{ width: 300, height: 37, marginLeft: '1%' }}
                 onChange={this.handleDropdownChange}
                 onClick={this.fetchDevices}
               >
                 <option value="" />
                 {this.state.sensorReadingOne.map((fid, i) => (
                   <option
                     style={{ width: 300, height: 37 }}
                     key={i}
                     value={fid.id}
                   >
                     {fid.deviceName}
                   </option>
                 ))}
               </select>
             </div>
           </form>
         </div>
         <div
           style={{
             display: 'flex',
             height: 300,
           }}
         >
           <DataGrid rows={rows} columns={columns} pageSize={5} />
         </div>

         <Paper>
           <form onSubmit={this.handleSubmit} style={{ marginTop: '3%' }}>
             <div className="card-body">
               <div className="form-row" style={{ marginLeft: '3%' }}>
                 <Typography variant="h6" noWrap component="div">
                   Firmware Download
                 </Typography>
                 <select
                   style={{ marginLeft: '6%', width: 300, height: 37 }}
                   name="firmwareDownload"
                   onClick={this.handleFirmwareDropDownChange}
                   onChange={this.handleFirmwareDownloadChange}
                 >
                   <option value="" />
                   {
                    this.state.firmwareList.map((firmware) => (
                      <option
                        style={{ width: 300, height: 37 }}
                        value={`${firmware.id} ${firmware.firmwareVersion}`}
                      >
                        {firmware.firmwareVersion}
                      </option>
                    ))
                   }
                 </select>

                 <div className="text-danger">
                   {this.state.errors.firmwareDownload}
                 </div>
               </div>

               <div
                 style={{ marginLeft: '3%', paddingTop: '5%' }}
                 className="form-row"
               >
                 <Typography variant="h6" noWrap component="div">
                   Server IP/UN/Password
                 </Typography>
                 <input
                   style={{ marginLeft: '3%', width: 300, height: 37 }}
                   name="password"
                   type="password"
                   onChange={this.handleChange}
                 />
                 <div className="text-danger">{this.state.errors.password}</div>
               </div>

               <div
                 className="form-group"
                 style={{
                   marginLeft: '5%',
                   paddingBottom: '1%',
                   paddingTop: '3%',
                 }}
               >
                 <button type="submit" className="btn btn-primary mr-4">
                   Apply
                 </button>
                 <button className="btn btn-secondary" type="reset">
                   Cancel
                 </button>
               </div>
             </div>
           </form>
         </Paper>
       </div>
     );
   }
}

export default Configuration;
