/* eslint-disable react/prop-types */
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
import Typography from '@material-ui/core/Typography';

class IotModelDataGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      iotModelName: '',
      updatedIotModelName: '',
      model_name: this.props.name, // selected model
      id: this.props.id,
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
    // const ress = (res.data.map((u) => this.setState({ Model: u.modelName })));

    this.state.Model = res.data.map((u) => (
      u.iotModel.iotModelName
    ));

    // const ress = await axios.all(response.data.map((u) => axios.get(`//vtiot-cloudapp.nelkinda.com/api/1.0/dashboard/devices/${u.id}/sensors/latest`)));
    // console.log(res.data.modelName);
    // console.log(response.data[0].name.id);
    // console.log(res.data.map((u) => u.modelName)); // To check what data is storing after mapping..
    // var arr = this.state.Model;
    // console.log(this.state.Model.indexOf('Forklift Model') > -1);
    // console.log(this.state.Model.includes('Forklift Model'));
    // console.log(res.data.map((u) => u.modelName).includes('JSW Hoist')); // This will work!!

    this.setState({ deviceInfo: res.data, loading: false });
  }

  // currentlySelected=(selections) => {
  //   this.setState({ iotModelName: selections });
  //

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
            // console.log(res);
            // console.log(res.data);
            if (res.status === 200) {
              alert('Model name update successfully..');
            }
            // console.log('Old model name: ', res.data.model_name);
            // console.log('Updated Model: ', res.data.updatedIotModelName);
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
    return (
      <div>

        {/* {(() => {
          if (this.state.model_name === '') {
            return <h1> </h1>;
          } */}

        <div style={{ marginTop: '2%' }}>

          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <Typography>
                <h3>Edit Model</h3>
              </Typography>
              <div className="form-group col-10" />

              <div className="form-group" style={{ width: '83%' }}>
                <label>Update Model Name</label>
                <input
                  placeholder={this.state.model_name}
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

      </div>

    );
  }
}

export default IotModelDataGrid;
