/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-alert */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
// import ResponsiveDrawer from './components/drawer.js';
import * as React from 'react';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',

  },

}));

class Firmware extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      firmwareInfo: [],
      id: '',
      version: '',
      firmwareName: '',
      firmware: '',
      addedDate: '',

      selected_version: '',
      selected_firmware: '',
      selected_addedDate: '',
      selected_firmwareName: '',

      updated_firmware: '',
      updated_addedDate: '',
      updated_version: '',
    };
  }

  async componentDidMount() {
    const url = 'http://192.168.0.194:5005/api/v1/firmwares/getFirmwareDetails';
    const response = await axios.get(url);
    this.setState({ firmwareInfo: response.data, loading: false });
  }

  onClick = () => { }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmitUpdated = (e) => {
    e.preventDefault();
    this.EditUpdate();
    const alertData = {
      firmware: this.state.updated_firmware,
      addedDate: this.state.updated_addedDate,
      version: this.state.updated_version,
      firmwareName: this.state.selected_firmwareName,
    };
    axios
      .put(`http://192.168.0.194:5005/1.0/firmware/${this.state.selected_firmwareName}`, alertData)
      .then(
        (res) => {
          if (res.status === 200) {
            alert('Alert data updated Successfully..');
          }
          (error) => {
            this.handleError(error);
            return error;
          };
          this.state.selected_addedDate = '';
          this.state.selected_version = '';
          this.state.selected_firmwareName = '';
          this.state.selected_firmware = '';
          this.state.updated_addedDate = '';
          this.state.updated_firmware = '';
          this.state.updated_version = '';
          this.setState({ ...this.state });
          this.componentDidMount();
        },
      )
      .catch((apiError) => {
        console.log(apiError);
      });
    // }
  };

  handleDelete = (event) => {
    const firmwareToDelete = this.state.selected_firmwareName;
    event.preventDefault();
    axios.delete(`http://192.168.0.194:5005/1.0/firmware/${firmwareToDelete}`)
      .then((res) => {
        this.componentDidMount();
        this.state.selected_addedDate = '';
        this.state.selected_version = '';
        this.state.selected_firmwareName = '';
        this.state.selected_firmware = '';
        this.state.updated_addedDate = '';
        this.state.updated_firmware = '';
        this.state.updated_version = '';
        this.setState({ ...this.state });
      });
  }

  EditUpdate() {
    if (this.state.updated_firmware == '') {
      this.state.updated_firmware = this.state.selected_firmware;
    }
    if (this.state.updated_version == '') {
      this.state.updated_version = this.state.selected_version;
    }
    if (this.state.updated_addedDate == '') {
      this.state.updated_addedDate = this.state.selected_addedDate;
    }
  }

  render() {
    const columns = [
      { field: 'version', headerName: 'Version', width: 180 },
      { field: 'firmwareName', headerName: 'Firmware Name', width: 200 },
      { field: 'addedDate', headerName: 'Added Date', width: 200 },
    ];

    const row = [];
    this.state.firmwareInfo.map((it) => {
      row.push(
        {
          id: it.id,
          firmwareName: it.firmwareName,
          deviceId: it.deviceId,
          deviceName: it.deviceName,
          version: it.firmwareVersion,
          addedDate: it.firmwareAddedDate,
        },
      );
    });
    console.log(row);
    return (

      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        {/* <Dashboard /> */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>
            <h3>Firmware</h3>
          </Typography>

          <div>
            <Link to="/iot_firmware/FirmwareAdd.js" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary">
                Add New
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <form>
            <div key={row.id}>
              <div style={{
                display: 'flex', height: 400, marginTop: '2%',
              }}
              >
                <DataGrid
                  rows={row}
                  onRowSelected={(newSelection) => {
                    this.setState({
                      selected_firmwareName: newSelection.data.firmwareName,
                      selected_addedDate: newSelection.data.addedDate,
                      selected_version: newSelection.data.version,
                    });
                    console.log('selected FirmwareName: ', newSelection.data.firmwareName);
                    console.log('selected Added Date: ', newSelection.data.addedDate);
                    console.log('selected Version: ', newSelection.data.version);
                  }}
                  SelectionModelCheckbox={this.state.SelectionModelCheckbox}
                  columns={columns}
                  pageSize={5}
                />
              </div>
            </div>
          </form>
        </div>

        {(() => {
          if (this.state.selected_firmwareName === '') {
            return <h1> </h1>;
          }

          return (

            <div>
              <form className="post" onSubmit={this.handleSubmitUpdated}>
                <div className="form-row">
                  <Typography variant="h5" noWrap component="div" style={{ paddingBottom: '2%' }}>
                    Edit firmware
                  </Typography>
                  <div className="form-group col-10" />

                  <div className="form-group col-3">
                    <label>Old firmware Name</label>
                    <input
                      name="selected_firmwareName"
                      type="text"
                      value={this.state.selected_firmwareName}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-3">
                    <label>New firmware Name</label>
                    <input
                      name="updated_firmware"
                      type="text"
                      value={this.state.updated_firmwareName}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group col-3">
                    <label>Old version</label>
                    <input
                      name="selected_version"
                      type="text"
                      value={this.state.selected_version}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-3">
                    <label>Updated version</label>
                    <input
                      name="updated_version"
                      type="text"
                      value={this.state.updated_version}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group col-3">
                    <label>Old addedDate</label>
                    <input
                      name="selected_addedDate"
                      type="text"
                      value={this.state.selected_addedDate}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-3">
                    <label>Updated addedDate</label>
                    <input
                      name="updated_addedDate"
                      type="int"
                      value={this.state.updated_addedDate}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                  </div>

                </div>
                <input type="submit" value="Edit Alert" className="btn btn-success" />
              </form>

            </div>
          );
        })()}

      </div>
    );
  }
}

export default Firmware;
