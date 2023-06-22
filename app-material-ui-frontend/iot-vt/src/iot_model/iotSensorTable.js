/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */

/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';

// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import Dashboard from '../components/dashboard';

class IotSensorTable extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      sensorReading: [],
      iotModelName: '',
      // isDialogOpen: false,
      openDeleteDialog: false,
      reload: false,
      model_id: '',
    };
  }

  async componentDidMount() {
    // const modelName = window.location.href.split('/')[6];
    const modelId = window.location.href.split('/')[6];

    const url1 = `http://192.168.0.194:5005/api/1.0/iotModel/${modelId}`;
    const response1 = await axios.get(url1);
    console.log(response1.data);

    this.setState({ sensorReading: response1.data.sensors, loading: false });
    console.log(this.state.sensorReading);
    this.setState({ model_id: modelId });
  }

  refresh=() => {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  handleDeleteSensor = (id) => {
    console.log(id);
    const modelId = window.location.href.split('/')[6];
    // const ModelIdToDelete = this.state.id;
    const SensorToDelete = id;
    const confirmAction = confirm('Are you sure to Delete this sensor?');
    if (confirmAction) {
      axios.delete(`http://192.168.0.194:5005/api/1.0/iotModel/${modelId}/sensor/${SensorToDelete}`)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.componentDidMount();
          // this.getOptions();
        });
    }
  }

  render() {
    <div>
      this.state.isDialogOpen &&
      <Dialog
          // open={this.state.openDeleteDialog}
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
        <>

          <Button onClick={() => { this.props.history.push(`/iot_model/AddSensorForm/${this.state.model_id}`); }} style={{ margin: '7% 0 0 86%' }} id="add-model-button" variant="contained" color="primary">
            Add New Sensor
          </Button>

        </>
        <div style={{
          margin: '1%  0 0 2%', maxHeight: '520px', overflowY: 'auto', border: '1px solid #ccc',
        }}
        >
          <table
            style={{
              border: '1px solid transperent', boxShadow: '2px 7px 15px 5px #80808033', borderRadius: '10px', outline: 'none',
            }}
            className="table table-hover "
          >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Sensor Name</th>
                <th scope="col">Min</th>
                <th scope="col">Max</th>
                <th scope="col">Processed Data</th>
                <th scope="col">Raw Data</th>
                <th scope="col">Unit</th>
                <th scope="col">Formula</th>
                <th scope="col">Dash Seq No</th>
                <th scope="col">Alert Time</th>
                <th scope="col">Alert Criticality</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">

              {this.state.sensorReading.map((data) => (
                <tr>
                  <td>{data.sensorId}</td>
                  <td>{data.name}</td>
                  <td>{data.min}</td>
                  <td>{data.max}</td>
                  <td>{data.processedDataType}</td>
                  <td>{data.rawDataType}</td>
                  <td>{data.unit}</td>
                  <td>{data.formula}</td>
                  <td>{data.dashboardOrder}</td>
                  <td>{data.alertTime}</td>
                  <td>{data.alertCriticality}</td>
                  <td onClick={() => this.props.history.push(`/iot_model/EditSensorForm/${data.id}/${this.state.model_id}`)}><EditIcon /></td>
                  <td onClick={() => { this.handleDeleteSensor(data.id); }}><DeleteIcon /></td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

    );
  }
}

export default withRouter(IotSensorTable);
