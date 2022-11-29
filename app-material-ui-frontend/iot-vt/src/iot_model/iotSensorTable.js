/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class IotSensorTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      sensorReading: [],
      iotModelName: '',
      openDeleteDialog: false,
      reload: false,
    };
  }

  async componentDidMount() {
    const url = 'http://192.168.0.194:5005/api/1.0/iotModels';
    const response = await axios.get(url);
    console.log(response.data);

    this.setState({ sensorReading: response.data, loading: false });
  }

  handleChange = (event) => {
    this.setState({ iotModelName: event.target.value });
  }

  handleSubmit = (event) => {
    const iotModelToDelete = event.target.getAttribute('data-arg1');
    event.preventDefault();
    axios.delete(`http://192.168.0.194:5005/api/1.0/iotModels/${iotModelToDelete}`)
      .then((res) => {
        console.log(res);
        console.log(res.data);
      });
  }

  handleClickOpenDeleteDialog = () => this.setState({ openDeleteDialog: true })

  handleCloseDeleteDialog = () => this.setState({ openDeleteDialog: false })

  refresh=() => {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  render() {
    const columns = [
      { field: 'name', headerName: 'Sensor Name', width: 130 },
      { field: 'min', headerName: 'Min', width: 130 },
      { field: 'max', headerName: 'Max', width: 130 },
      { field: 'processedDataType', headerName: 'Processed Data', width: 130 },
      { field: 'rawDataType', headerName: 'Raw Data', width: 130 },
      { field: 'unit', headerName: 'Unit', width: 130 },
      { field: 'formula', headerName: 'Formula', width: 200 },
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
              <Link to="/iot_model/iotEditSensorMapping.js">
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
          // eslint-disable-next-line no-unused-vars
          const onClick = () => {

          };

          return <Button onClick={this.handleClickOpenDeleteDialog}><DeleteIcon /></Button>;
        },
      },
    ];

    const row = [];
    this.state.sensorReading.map((it) => {
      console.log(it);
      it.sensors.map((itt) => {
        row.push(
          {
            id: itt.id,
            name: itt.name,
            min: itt.min,
            max: itt.max,
            processedDataType: itt.processedDataType,
            rawDataType: itt.rawDataType,
            unit: itt.unit,
            formula: itt.formula,
          },
        );
      });
    });

    console.log(row);
      <div>
        this.state.isDialogOpen &&
        <Dialog
          keepMounted
          onClose={this.handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete ??
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>;

      return (
        <div>
          {/* <Dashboard /> */}
          {this.state.sensorReading.map((reading) => (
          // TODO find a good alternative to the key property
            <div key={row.id}>
              <form onSubmit={this.handleSubmit} data-arg1={reading.iotModelName}>
                <div className="form-row">
                  <div className="form-group col-4" style={{ marginTop: '2%' }}>
                    <TextField
                      disabled
                      id="outlined-disabled"
                      name="name"
                      type="text"
                      variant="outlined"
                      value={reading.iotModelName}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>
                  <button type="submit" onClick={this.refresh} className="btn btn-primary mr-1" style={{ margin: '2%' }}>
                    Delete Model
                    <DeleteIcon />
                  </button>
                  <div className="form-group col-4" />
                  {/* this is added just to check props call */}
                  <h3 className="form-group col-4">{this.props.iotModelName}</h3>
                </div>
              </form>
              <div style={{ height: 400, width: '100%', marginTop: '5%' }}>
                <DataGrid
                  rows={row}
                  columns={columns}
                  pageSize={6}
                  icon
                  SettingsApplicationsOutlinedIcon
                />
                <br />
              </div>
            </div>

          ))}

        </div>

      );
  }
}

export default IotSensorTable;
