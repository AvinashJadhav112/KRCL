/* eslint-disable react/jsx-pascal-case */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-cycle */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable react/sort-comp */
/* eslint-disable global-require */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { DataGrid } from '@material-ui/data-grid';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/loadingSpinner';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(1),
    paddingLeft: '20%',
    paddingTop: '0%',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '1%',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    paddingTop: '2%',
  },
  table: {
    Width: 500,
  },
}));
class EquipmentWiseAlertKRCL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      selectOptions: [],
      deviceName: '',
      id: '',

      startDate: '',

      someDate: '',
      startTime: '',
      endTime: '',

      loading: false,
      sensorId: '',
      rawValue: '',

      showAlerts: [],
      data: [],

      selectValue: [],
      errors: {},
      Deviceid: [],

      Featurename: '',

      EditAlertDescription: '',
      EditEmpId: '',

      name: '',
      username: '',

      selected_sensorId: '',
      selected_deviceId: '',
      selected_timestamp: '',
      selected_processedValue: '',
      selected_alertCriticality: '',
      selected_employeeName: '',
      selected_alertStatus: '',
      selected_alertDescription: '',
      selected_id: '',

      updated_employeeName: '',
      updated_alertStatus: '',
      updated_alertDescription: '',

    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async getOptions() {
    const url = 'http://192.168.0.194:5005/api/1.0/devices';
    const response = await axios.get(url);
    console.log(response.data);

    const ress = await axios.all(response.data.filter((r) => r.companyName === 'KRCL'));

    const options = ress.map((d) => ({
      value: d.id,
      label: d.deviceName,
    }));

    this.setState({ selectOptions: options });
  }

  handleChangeDropdown = (e) => {
    this.setState({ deviceName: e.label, id: e.value });
  };

  componentDidMount() {
    this.getOptions();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleErrors(error) {
    if (error.response && error.response.status === 404) {
      alert('Not found');
    } else if (error.response && error.response.status === 409) {
      alert('request conflicts');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 400) {
      alert('Bad Request');
    } else if (error.response && error.response.status === 403) {
      alert('Forbidden');
    } else if (error.response && error.response.status === 401) {
      alert('Unauthorized');
    }
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('request conflicts');
    } else if (error.response && error.response.status === 404) {
      alert('Not found');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 400) {
      alert('Bad Request');
    } else if (error.response && error.response.status === 403) {
      alert('Forbidden');
    } else if (error.response && error.response.status === 401) {
      alert('Unauthorized');
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    if (this.validate()) {
      const url = `http://192.168.0.194:5005/api/1.0/alerts/device/${this.state.id}?start=${this.state.startDate}T${this.state.startTime}:00Z&end=${this.state.startDate}T${this.state.endTime}:00Z`;
      this.setState({ loading: true }, () => {
        axios.get(url)
          .then((response) => {
            this.setState({ loading: false, data: [...response.data] });
            if (response.data == '') {
              alert('No Alerts found for selected device in opted time bound');
            }

            this.setState({ showAlerts: response.data, loading: false });
          },
          (error) => {
            this.handleErrors(error);
            return error;
          });
      });
    }
  }

  onClick = () => { }

  handleSubmitUpdated = (e) => {
    e.preventDefault();
    this.EditUpdate();
    const alertData = {
      sensorId: this.state.selected_sensorId,
      deviceId: this.state.selected_deviceId,
      timestamp: this.state.selected_timestamp,
      processedValue: this.state.selected_processedValue,
      alertCriticality: this.state.selected_alertCriticality,
      alertDescription: this.state.updated_alertDescription,
      employeeName: this.state.updated_employeeName,
      alertStatus: this.state.updated_alertStatus,
    };
    axios
      .put(`http://192.168.0.194:5005/api/1.0/alerts/${this.state.selected_id}`, alertData)
      .then(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            alert('Alert data Updated Successfully..');
          }

          this.state.selected_sensorId = '';
          this.state.selected_deviceId = '';
          this.state.selected_timestamp = '';
          this.state.selected_processedValue = '';
          this.state.selected_alertCriticality = '';
          this.state.selected_employeeName = '';
          this.state.selected_alertStatus = '';
          this.state.selected_alertDescription = '';
          this.state.selected_id = '';
          this.state.updated_employeeName = '';
          this.state.updated_alertStatus = '';
          this.state.updated_alertDescription = '';
          this.setState({ ...this.state });
          this.componentDidMount();
        },

        (error) => {
          this.handleError(error);
          return error;
        },
      )
      .catch((apiError) => {
        // console.log(apiError);
      });
  };

  EditUpdate() {
    if (this.state.updated_alertDescription == '') {
      this.state.updated_alertDescription = this.state.selected_alertDescription;
    }
    if (this.state.updated_alertStatus == '') {
      this.state.updated_alertStatus = this.state.selected_alertStatus;
    }
    if (this.state.updated_employeeName == '') {
      this.state.updated_employeeName = this.state.selected_employeeName;
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.deviceName) {
      isValid = false;
      errors.deviceName = 'Please select device';
    }
    if (!this.state.startDate) {
      isValid = false;
      errors.startDate = 'Please select start date';
    }
    if (!this.state.startTime) {
      isValid = false;
      errors.startTime = 'Please select start date';
    }
    if (!this.state.endTime) {
      isValid = false;
      errors.endTime = 'Please select start date';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const { selectValue } = this.state;

    const { startDate, startTime, endTime } = this.state;

    const { data, loading } = this.state;

    const alertStatus = [
      'Resolved',
      'Unresolved',
    ];

    const columns = [
      { field: 'sensorName', headerName: 'Sensor Name', width: 200 },
      { field: 'timestamp', headerName: 'Time Stamp', width: 250 },
      { field: 'value', headerName: 'Value', width: 200 },
      { field: 'employeeName', headerName: 'Emp Name', width: 150 },
      { field: 'alertStatus', headerName: 'Status', width: 130 },
      { field: 'alertCriticality', headerName: 'Criticality', width: 120 },
      { field: 'alertDescription', headerName: 'Alert Description', width: 300 },
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
                <Tooltip title="Currently edit feature is disabled">
                  <EditIcon />
                </Tooltip>
              </Link>
            </Button>
          );
        },
      },

    ];

    const row = [];
    this.state.showAlerts.map((it) => {
      row.push(
        {
          id: it.id,
          sensorId: it.sensorId,
          sensorName: it.sensorName,
          deviceId: it.deviceId,
          timestamp: it.timestamp,
          value: it.processedValue,
          alertDescription: it.alertDescription,
          alertCriticality: it.alertCriticality,
          alertStatus: it.alertStatus,
          employeeName: it.employeeName,

        },
      );
    });

    const values = {
      startDate: '',
      startTime: '',
      endTime: '',
    };
    return (
      <>
        <div style={{ marginTop: '8%', marginLeft: '5%' }}>

          <Typography variant="h5" noWrap component="div" style={{ paddingBottom: '2%' }}>
            Equipment Wise Alerts
          </Typography>

          <div style={{ paddingTop: '' }}>
            <form style={{ marginLeft: '2%' }} onSubmit={this.onSubmit}>
              <div className="form-row">

                <div className="form-group col">
                  <TextField name="startDate" label="Date" id="time" InputLabelProps={{ shrink: true, required: true }} type="date" onChange={this.handleChange} value={startDate} defaultValue={values.startDate} />
                  <div className="text-danger">
                    {this.state.errors.startDate}
                  </div>
                </div>

                <div className="form-group col">
                  <TextField name="startTime" id="time" label="Start Time" type="time" onChange={this.handleChange} value={startTime} defaultValue="12:30" InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} style={{ paddingLeft: '5%' }} />
                  <div className="text-danger">
                    {this.state.errors.startTime}
                  </div>
                </div>

                <div className="form-group col">
                  <TextField name="endTime" id="time" label="End Time " type="time" onChange={this.handleChange} value={endTime} defaultValue="15:30" InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} style={{ paddingLeft: '5%', paddingRight: '5%' }} />
                  <div className="text-danger">
                    {this.state.errors.endTime}
                  </div>
                </div>

                <div className="form-group col-4">
                  <div>
                    <Select
                      options={this.state.selectOptions}
                      onChange={this.handleChangeDropdown}
                    />
                    <div className="text-danger">
                      {this.state.errors.deviceName}
                    </div>
                  </div>
                </div>

                <div className="form-group col">
                  <button onClick={this.onClick} value="Submit" className="btn btn-success" style={{ marginLeft: '40%' }}>
                    Load Data
                    {loading ? <LoadingSpinner /> : <h5 />}
                  </button>

                </div>

                <div className="form-group col" />

              </div>

            </form>

          </div>
          {(() => {
            if (this.state.deviceName === '') {
              return <h1> </h1>;
            }

            return (

              <div key={row.id}>
                <div style={{
                  height: 400, width: '100%',
                }}
                >
                  <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={10}
                    icon
                    SettingsApplicationsOutlinedIcon
                    checkboxSelection
                    onRowSelected={(newSelection) => {
                      this.setState({
                        selected_sensorId: newSelection.data.sensorId,
                        selected_deviceId: newSelection.data.deviceId,
                        selected_timestamp: newSelection.data.timestamp,
                        selected_processedValue: newSelection.data.value,
                        selected_alertCriticality: newSelection.data.alertCriticality,
                        selected_alertDescription: newSelection.data.alertDescription,
                        selected_employeeName: newSelection.data.employeeName,
                        selected_alertStatus: newSelection.data.alertStatus,
                        selected_id: newSelection.data.id,
                      });
                    }}
                    SelectionModelCheckbox={this.state.SelectionModelCheckbox}
                  />
                  <br />
                </div>
              </div>

            );
          })()}

          {(() => {
            if (this.state.selected_sensorId === '') {
              return <h1> </h1>;
            }

            return (

              <div>
                <form className="post" onSubmit={this.handleSubmitUpdated}>
                  <div className="form-row">
                    <Typography variant="h5" noWrap component="div" style={{ paddingBottom: '2%' }}>
                      Edit Alert
                    </Typography>
                    <div className="form-group col-6" />

                    <div className="form-group col-6">
                      <label>Old Alert Description</label>
                      <input
                        name="selected_alertDescription"
                        type="text"
                        value={this.state.selected_alertDescription}
                        onChange={this.handleChange}
                        className="form-control"
                        disabled
                      />
                    </div>

                    <div className="form-group col-6">
                      <label>New Alert Description</label>
                      <input
                        name="updated_alertDescription"
                        type="text"
                        value={this.state.updated_alertDescription}
                        onChange={this.handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-6">
                      <label>Old Alert Status</label>
                      <input
                        name="selected_alertStatus"
                        type="text"
                        value={this.state.selected_alertStatus}
                        onChange={this.handleChange}
                        className="form-control"
                        disabled
                      />
                    </div>

                    <div className="form-group col-6">
                      <label>Updated Alert Status</label>
                      <select
                        name="updated_alertStatus"
                        onChange={this.handleChange}
                        className="form-control"
                      >
                        <option value={this.state.updated_alertStatus} />
                        {alertStatus.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-6">
                      <label>Old Employee Name</label>
                      <input
                        name="selected_employeeName"
                        type="text"
                        value={this.state.selected_employeeName}
                        onChange={this.handleChange}
                        className="form-control"
                        disabled
                      />

                    </div>

                    <div className="form-group col-6">
                      <label>Updated Employee Name</label>
                      <input
                        name="updated_employeeName"
                        type="int"
                        value={this.state.updated_employeeName}
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
      </>
    );
  }
}

export default EquipmentWiseAlertKRCL;
