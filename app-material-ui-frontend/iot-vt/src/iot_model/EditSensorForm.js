/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
import axios from 'axios';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export class EditSensorForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      iotModelName: '',
      id: '',
      name: '',
      min: '',
      max: '',
      alertTime: '',
      formula: '',
      rawDataType: '',
      processedDataType: '',
      unit: '',
      alertCriticality: '',
      dashboardOrder: '',
      sensorId: '',
      sensoruuId: '',
      errors: {},
      errorsedit: {},
      selectOptions: [],
      sensorReading: [],
      sensorsOfSelectedModel: [],
      // statecalls for checkbox selection from datagrid
      selected_auto_sensorId: '', // auto generated sensor id's
      selected_name: '',
      selected_min: '',
      selected_max: '',
      selected_alertTime: '',
      selected_formula: '',
      selected_rawDataType: '',
      selected_processedDataType: '',
      selected_unit: '',
      selected_alertCriticality: '',
      selected_dashboardOrder: '',
      selected_sensorId: '',
      selected_sensor_id: '',
      // updated states using edit
      updated_name: '',
      updated_min: '',
      updated_max: '',
      updated_alertTime: '',
      updated_formula: '',
      updated_rawDataType: '',
      updated_processedDataType: '',
      updated_unit: '',
      updated_alertCriticality: '',
      updated_dashboardOrder: '',
      updated_sensorId: '',
    };
  }

  async componentDidMount() {
    const modelId = window.location.href.split('/')[7];
    const sensorId = window.location.href.split('/')[6];
    const result = await axios.get(`http://192.168.0.194:5005/api/1.0/iotModel/${modelId}/sensor/${sensorId}`);
    const sensorData = result.data;
    this.setState({
      selected_sensor_id: sensorData.id,
      updated_name: sensorData.name,
      updated_min: sensorData.min,
      updated_max: sensorData.max,
      updated_alertTime: sensorData.alertTime,
      updated_formula: sensorData.formula,
      updated_rawDataType: sensorData.rawDataType,
      updated_processedDataType: sensorData.processedDataType,
      updated_unit: sensorData.unit,
      updated_alertCriticality: sensorData.alertCriticality,
      updated_dashboardOrder: sensorData.dashboardOrder,
      updated_sensorId: sensorData.sensorId,

    });
  }

    handleSubmitUpdated = (e) => {
      e.preventDefault();
      const modelId = window.location.href.split('/')[7];
      this.EditUpdate();
      if (this.validateEdit()) {
        const sensordata = {
          name: this.state.updated_name,
          min: this.state.updated_min,
          max: this.state.updated_max,
          alertTime: this.state.updated_alertTime,
          formula: this.state.updated_formula,
          rawDataType: this.state.updated_rawDataType,
          processedDataType: this.state.updated_processedDataType,
          unit: this.state.updated_unit,
          alertCriticality: this.state.updated_alertCriticality,
          dashboardOrder: this.state.updated_dashboardOrder,
          sensorId: this.state.updated_sensorId,

        };
        axios
          .put(`http://192.168.0.194:5005/api/1.0/iotModel/${modelId}/sensor/${this.state.selected_sensor_id}`, sensordata)
          .then(
            (res) => {
              console.log(res);
              console.log(res.data);
              if (res.status === 200) {
                alert('Sensor Updated successfully..');
                window.history.go(-1);
              }

              console.log('Old sensor name: ', res.data.selected_name);
              console.log('Updated sensor name: ', res.data.updated_name);
              const updatedSensors = [...this.state.sensorReading];
              // updatedSensors[sensorIndex] = sensor;
              // this.state.model_name = '';
              // this.state.updatedIotModelName = '';
              this.state.sensorReading = updatedSensors;
              this.state.selected_auto_sensorId = '';
              this.state.selected_name = '';
              this.state.selected_min = '';
              this.state.selected_max = '';
              this.state.selected_alertTime = '';
              this.state.selected_formula = '';
              this.state.selected_rawDataType = '';
              this.state.selected_processedDataType = '';
              this.state.selected_unit = '';
              this.state.selected_alertCriticality = '';
              this.state.selected_dashboardOrder = '';
              this.state.selected_sensorId = '';
              this.state.updated_name = '';
              this.state.updated_min = '';
              this.state.updated_max = '';
              this.state.updated_alertTime = '';
              this.state.updated_formula = '';
              this.state.updated_rawDataType = '';
              this.state.updated_processedDataType = '';
              this.state.updated_unit = '';
              this.state.updated_alertCriticality = '';
              this.state.updated_dashboardOrder = '';
              this.state.updated_sensorId = '';
              this.setState({ ...this.state });
              this.componentDidMount();
            },
            (error) => {
              this.handleErrors(error);
              return error;
            },
          )
          .catch((apiError) => {
            console.log(apiError);
          });
      }
    };

      handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }

      handleErrors(error) {
        if (error.response && error.response.status === 409) {
          alert('Unique validation constraint violated.');
        }
        if (error.response && error.response.status === 422) {
          alert('Compilation of the formula failed. Check formula and types.');
        }
        if (error.response && error.response.status === 400) {
          alert('Invalid Sensor request.');
        }
      }

      EditUpdate() {
        if (this.state.updated_sensorId == '') {
          this.state.updated_sensorId = this.state.selected_sensorId;
        }

        if (this.state.updated_dashboardOrder == '') {
          this.state.updated_dashboardOrder = this.state.selected_dashboardOrder;
        }

        if (this.state.updated_name == '') {
          this.state.updated_name = this.state.selected_name;
        }

        if (this.state.updated_min == '') {
          this.state.updated_min = this.state.selected_min;
        }

        if (this.state.updated_max == '') {
          this.state.updated_max = this.state.selected_max;
        }

        if (this.state.updated_alertTime == '') {
          this.state.updated_alertTime = this.state.selected_alertTime;
        }

        if (this.state.updated_formula == '') {
          this.state.updated_formula = this.state.selected_formula;
        }

        if (this.state.updated_rawDataType == '') {
          this.state.updated_rawDataType = this.state.selected_rawDataType;
        }

        if (this.state.updated_processedDataType == '') {
          this.state.updated_processedDataType = this.state.selected_processedDataType;
        }

        if (this.state.updated_unit == '') {
          this.state.updated_unit = this.state.selected_unit;
        }

        if (this.state.updated_alertCriticality == '') {
          this.state.updated_alertCriticality = this.state.selected_alertCriticality;
        }
      }

      validateEdit() {
        const errorsedit = {};
        let isValid = true;

        if (!this.state.updated_sensorId) {
          isValid = false;
          errorsedit.updated_sensorId = 'Please enter Sensorid.';
        } else if (!/^[0-9 A-Z  a-z]+$/i.test(this.state.updated_sensorId)) {
          isValid = false;
          errorsedit.updated_sensorId = 'No special character allowed in this field.';
        }

        if (!this.state.updated_dashboardOrder) {
          isValid = false;
          errorsedit.updated_dashboardOrder = 'Please enter dashboard sequence number';
        } else if (!/^[0-9 .]+$/i.test(this.state.updated_dashboardOrder)) {
          isValid = false;
          errorsedit.updated_dashboardOrder = 'field should contain digit only ';
        }

        if (!this.state.updated_name) {
          isValid = false;
          errorsedit.updated_name = 'Please enter name.';
        }
        // else if (!/^[a-z A-Z ]+$/i.test(this.state.updated_name)) {
        //   isValid = false;
        //   errorsedit.updated_name = 'sensor name should be character only';
        // }

        if (!this.state.updated_min) {
          isValid = false;
          errorsedit.updated_min = 'Please enter min.';
        } else if (!/^-?[0-9 .]+$/i.test(this.state.updated_min)) {
          isValid = false;
          errorsedit.updated_min = 'field should contain digit only ';
        }

        if (!this.state.updated_max) {
          isValid = false;
          errorsedit.updated_max = 'Please enter max value.';
        } else if (!/^-?[0-9 .]+$/i.test(this.state.updated_max)) {
          isValid = false;
          errorsedit.updated_max = 'field should contain digit only ';
        }

        if (!this.state.updated_alertTime) {
          isValid = false;
          errorsedit.updated_alertTime = 'Please enter alertTime.';
        }

        if (!this.state.updated_formula) {
          isValid = false;
          errorsedit.updated_formula = 'Please enter formula';
        }

        if (!this.state.updated_rawDataType) {
          isValid = false;
          errorsedit.updated_rawDataType = 'Please enter rawDataType.';
        }

        if (!this.state.updated_processedDataType) {
          isValid = false;
          errorsedit.updated_processedDataType = 'Please enter processedDataType.';
        }

        if (!this.state.updated_unit) {
          isValid = false;
          errorsedit.updated_unit = 'Please enter unit.';
        }
        if (!this.state.updated_sensorId) {
          isValid = false;
          errorsedit.updated_sensorId = 'Please enter sensor Id.';
        }

        if (!this.state.updated_alertCriticality) {
          isValid = false;
          errorsedit.updated_alertCriticality = 'Please enter Alert criticality';
        }

        if (!this.state.updated_dashboardOrder) {
          isValid = false;
          errorsedit.updated_dashboardOrder = 'Please enter dashboard order number';
        }

        this.setState({
          errorsedit,
        });

        return isValid;
      }

      render() {
        return (
          <div>
            <div style={{
              border: '1px solid #ccc', margin: '7% 0 0 17%', padding: '1.5%', borderRadius: '10px', width: '70%',
            }}
            >
              <form onSubmit={this.handleSubmitUpdated}>
                <h3> Edit Sensor </h3>
                <div className="form-row">

                  <div className="form-group col-6">
                    <label>Sensor id</label>
                    <input
                      name="updated_sensorId"
                      type="text"
                      value={this.state.updated_sensorId}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_sensorId}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Dashboard sequence number</label>
                    <input
                      name="updated_dashboardOrder"
                      type="text"
                      value={this.state.updated_dashboardOrder}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errorsedit.updated_dashboardOrder}</div>

                  </div>

                  <div className="form-group col-6">
                    <label>Name</label>
                    <input
                      name="updated_name"
                      type="text"
                      value={this.state.updated_name}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_name}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Min</label>
                    <input
                      name="updated_min"
                      type="int"
                      value={this.state.updated_min}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_min}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Max</label>
                    <input
                      name="updated_max"
                      type="int"
                      value={this.state.updated_max}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_max}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>AlertTime</label>
                    <input
                      name="updated_alertTime"
                      type="int"
                      value={this.state.updated_alertTime}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_alertTime}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Formula</label>
                    <input
                      name="updated_formula"
                      type="varchar"
                      value={this.state.updated_formula}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_formula}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Raw Data Type</label>
                    <input
                      name="updated_rawDataType"
                      type="varchar"
                      value={this.state.updated_rawDataType}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_rawDataType}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Processed Data Type</label>
                    <input
                      name="updated_processedDataType"
                      type="varchar"
                      value={this.state.updated_processedDataType}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_processedDataType}</div>
                  </div>

                  <div className="form-group col-6">
                    <label>Unit</label>
                    <input
                      name="updated_unit"
                      type="varchar"
                      value={this.state.updated_unit}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errorsedit.updated_unit}</div>
                  </div>

                  {/* TODO INTEGRATE WITH API */}

                  <div className="form-group col-6">
                    <label>Alert Criticality</label>
                    <input
                      name="updated_alertCriticality"
                      type="varchar"
                      value={this.state.updated_alertCriticality}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errorsedit.updated_alertCriticality}</div>

                  </div>

                </div>
                <input type="submit" value="Edit Sensor" className="btn btn-success" />
                <Button className="btn btn-secondary ml-3" onClick={() => window.history.go(-1)}>Cancel</Button>

              </form>
            </div>
          </div>
        );
      }
}

export default EditSensorForm;
