/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
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
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import Tooltip from '@material-ui/core/Tooltip';
import IotSensorInput from './iotSensorInput';

class IotModelDataGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      iotModelName: '',
      updatedIotModelName: '',
      model_name: '', // selected model
      id: [],
      sensorReading: [],
      deviceInfo: [],
      modelName: '',
      Model: [], // models which are linked with device
      openDeleteDialog: false,
      errors: {},
      samedevices: [],

    };
  }

  async componentDidMount() {
    const url = 'http://192.168.0.194:5005/api/1.0/iotModels';
    const response = await axios.get(url);
    this.setState({ sensorReading: response.data, loading: false });

    const urll = 'http://192.168.0.194:5005/api/1.0/devices';
    const res = await axios.get(urll);

    this.state.Model = res.data.map((u) => (
      u.iotModel.iotModelName
    ));

    this.setState({ deviceInfo: res.data, loading: false });
  }

  handleDelete = (event) => {
    const urll = 'http://192.168.0.194:5005/api/1.0/devices';
    const response = axios.get(urll);
    const modeltodelete = this.state.model_name;
    this.state.samedevices = this.state.Model.filter(() => this.state.model_name);
    const confirmAction = confirm('Are you sure to Delete this Iotmodel?');
    if (confirmAction) {
    // eslint-disable-next-line eqeqeq
      if (this.state.samedevices.includes(this.state.model_name) == true) {
        alert('This IOT Model is linked with IOT device! Please delete respected device first');
      } else {
        const iotModelToDelete = this.state.model_name;
        event.preventDefault();
        axios.delete(`http://192.168.0.194:5005/api/1.0/iotModels/${iotModelToDelete}`)

          .then((res) => {
            this.componentDidMount();
            this.state.model_name = '';
            this.state.updatedIotModelName = '';
            alert('The Model is Deleted!');
          });
      }
    } else {
      console.log('You are click on cancel ');
    }
  };

  handleEditEvent=(val) => val

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleErrors(error) {
    if (error.response && error.response.status === 404) {
      alert('IOT model not found');
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const sensor = this.state.sensorReading.find((it) => this.state.id === it.id);
      const sensorIndex = this.state.sensorReading.indexOf(sensor);
      sensor.iotModelName = this.state.updatedIotModelName;
      axios
        .put(`http://192.168.0.194:5005/api/1.0/iotModels/${sensor.id}`, sensor)
        .then(
          (res) => {
            if (res.status === 200) {
              alert('Model name update successfully..');
            }
            const updatedSensors = [...this.state.sensorReading];
            updatedSensors[sensorIndex] = sensor;
            this.state.model_name = '';
            this.state.updatedIotModelName = '';
            this.state.sensorReading = updatedSensors;
            this.setState({ ...this.state });
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
  };

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.updatedIotModelName) {
      isValid = false;
      errors.updatedIotModelName = 'Please enter your Model Name.';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(this.state.updatedIotModelName)) {
      isValid = false;
      errors.updatedIotModelName = 'Model name should be character only';
    }
    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const columns = [
      { field: 'iotModelName', headerName: 'Model Name', width: 250 },
      // here after selecting sensor mapping button selected models name should be pre selected on iotSensorInput.js dropdown
      {
        field: 'sensor_mappingButton',
        headerName: 'Add/View Sensor Mapping',
        sortable: false,
        width: 250,
        renderCell: () => {
          const onClick = () => {

          };

          return (
            <Button id="add-view-sensorMapping-button" onClick={onClick}>
              <Link to="/iot_model/iotAddSensorMapping.js">
                <EditAttributesIcon />
              </Link>
            </Button>
          );
        },
      },
      // here in this edit button should map with model name which is present in that same column
      // for editing either it can go to another page for editing or it can be done on table to {saw one example on google}
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
      // this should delete whole model with sensors from table
      {
        field: 'deleteButton',
        headerName: 'Delete',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {
          };

          return (
            <Button type="submit" onClick={this.handleDelete}>
              <Tooltip title="Please select model before delete">
                <DeleteIcon />
              </Tooltip>
            </Button>
          );
        },
      },
    ];

    const row = [];
    this.state.sensorReading.map((it) => {
      row.push(
        {
          id: it.id,
          iotModelName: it.iotModelName,
        },
      );
    });

    return (
      <div>
        <div key={row.id}>
          <div style={{
            display: 'flex', height: 400, marginTop: '2%',
          }}
          >
            <DataGrid
              checkboxSelection
              rows={row}
              onRowSelected={(newSelection) => {
                this.setState({ model_name: newSelection.data.iotModelName, id: newSelection.data.id });
              }}
              columns={columns}
              pageSize={6}
              icon
              SettingsApplicationsOutlinedIcon
            />
            <br />
          </div>
        </div>
        {(() => {
          if (this.state.model_name === '') {
            return <h1> </h1>;
          }

          return (

            <div style={{ marginTop: '2%' }}>

              <form onSubmit={this.handleSubmit}>
                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Model Name</label>
                    <input
                      name="model_name"
                      type="text"
                      value={this.state.model_name}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Model Name</label>
                    <input
                      name="updatedIotModelName"
                      type="text"
                      value={this.state.updatedIotModelName}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedIotModelName}</div>
                  </div>
                </div>
                <input type="submit" value="Edit Model" className="btn btn-success" />
              </form>
            </div>
          );
        })()}

      </div>

    );
  }
}

export default IotModelDataGrid;
