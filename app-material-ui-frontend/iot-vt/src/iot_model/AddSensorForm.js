/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/destructuring-assignment */

import axios from 'axios';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export class AddSensorForm extends Component {
  constructor() {
    super();

    this.validate = this.validate.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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
      Alert_Criticality: ['High', 'Medium', 'Low', 'None'],
    };
  }

  handleSubmit(e) {
    const modelId = window.location.href.split('/')[6];
    // console.log(modelId);
    e.preventDefault();
    if (this.validate()) {
      const sensorData = {
        name: this.state.name,
        min: this.state.min,
        max: this.state.max,
        alertTime: this.state.alertTime,
        formula: this.state.formula,
        rawDataType: this.state.rawDataType,
        processedDataType: this.state.processedDataType,
        unit: this.state.unit,
        alertCriticality: this.state.alertCriticality,
        dashboardOrder: this.state.dashboardOrder,
        sensorId: this.state.sensorId,
      };

      axios
        .post(`http://192.168.0.194:5005/api/1.0/iotModel/${modelId}/sensors`, sensorData)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.state.name = '';
          this.state.min = '';
          this.state.max = '';
          this.state.alertTime = '';
          this.state.formula = '';
          this.state.rawDataType = '';
          this.state.processedDataType = '';
          this.state.unit = '';
          // this.state.alertCriticality = '';
          this.state.dashboardOrder = '';
          this.state.sensorId = '';
          this.state.sensoruuId = '';
          this.state.selected_auto_sensorId = '';
          this.setState({ ...this.state });
          if (res.status === 201) {
            alert('Data Added Successfully..');
            window.history.go(-1);
          }
        },
        (error) => {
          this.handleError(error);
          return error;
        })
        .catch((apiError) => {
          console.log(apiError);
        });
    }
  }

      handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }

      handleError=(error) => {
        if (error.response && error.response.status === 409) {
          alert('There is already a sensor with same name');
        }
      }

      validate() {
        const errors = {};
        let isValid = true;

        if (!this.state.sensorId) {
          isValid = false;
          errors.sensorId = 'Please enter Sensorid.';
        } else if (!/^[0-9 A-Z  a-z]+$/i.test(this.state.sensorId)) {
          isValid = false;
          errors.sensorId = 'No special character allowed in this field.';
        }

        if (!this.state.dashboardOrder) {
          isValid = false;
          errors.dashboardOrder = 'Please enter dashboard sequence number';
        } else if (!/^[0-9 .]+$/i.test(this.state.dashboardOrder)) {
          isValid = false;
          errors.dashboardOrder = 'field should contain digit only ';
        }

        if (!this.state.name) {
          isValid = false;
          errors.name = 'Please enter name.';
        }
        // else if (!/^[a-z A-Z ]+$/i.test(this.state.name)) {
        //   isValid = false;
        //   errors.name = 'sensor name should be character only';
        // }

        if (!this.state.min) {
          isValid = false;
          errors.min = 'Please enter min.';
        } else if (!/^-?[0-9 .]+$/i.test(this.state.min)) {
          isValid = false;
          errors.min = 'field should contain digit only ';
        }

        if (!this.state.max) {
          isValid = false;
          errors.max = 'Please enter max value.';
        } else if (!/^-?[0-9 .]+$/i.test(this.state.max)) {
          isValid = false;
          errors.max = 'field should contain digit only ';
        }

        if (!this.state.alertTime) {
          isValid = false;
          errors.alertTime = 'Please enter alertTime.';
        }

        if (!this.state.formula) {
          isValid = false;
          errors.formula = 'Please enter formula';
        }

        if (!this.state.rawDataType) {
          isValid = false;
          errors.rawDataType = 'Please enter rawDataType.';
        }

        if (!this.state.processedDataType) {
          isValid = false;
          errors.processedDataType = 'Please enter processedDataType.';
        }

        if (!this.state.unit) {
          isValid = false;
          errors.unit = 'Please enter unit.';
        }
        if (!this.state.sensorId) {
          isValid = false;
          errors.sensorId = 'Please enter sensor Id.';
        }

        if (!this.state.alertCriticality) {
          isValid = false;
          errors.alertCriticality = 'Please enter Alert criticality';
        }

        if (!this.state.dashboardOrder) {
          isValid = false;
          errors.dashboardOrder = 'Please enter dashboard order number';
        }

        this.setState({
          errors,
        });

        return isValid;
      }

      render() {
        return (
          <div style={{
            border: '1px solid #ccc', padding: '20px', borderRadius: '10px', margin: '7% 0 0 17%', width: '68%',
          }}
          >
            <div style={{ margin: '2% 0 1% 2%' }}>

              <h3> Add Sensor </h3>

            </div>

            <div>
              <form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>Sensor id</label>
                    <input
                      name="sensorId"
                      type="text"
                    //   value={this.state.sensorId}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.sensorId}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>Dashboard sequence number</label>
                    <input
                      name="dashboardOrder"
                      type="text"
                    //   value={this.state.dashboardOrder}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.dashboardOrder}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>Name</label>
                    <input
                      name="name"
                      type="text"
                    //   value={this.state.name}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.name}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>Min</label>
                    <input
                      name="min"
                      type="int"
                    //   value={this.state.min}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.min}</div>
                  </div>
                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>max</label>
                    <input
                      name="max"
                      type="int"
                    //   value={this.state.max}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errors.max}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>alertTime</label>
                    <input
                      name="alertTime"
                      type="int"
                    //   value={this.state.alertTime}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errors.alertTime}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>formula</label>
                    <input
                      name="formula"
                      type="varchar"
                    //   value={this.state.formula}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errors.formula}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>rawDataType</label>
                    <input
                      name="rawDataType"
                      type="varchar"
                    //   value={this.state.rawDataType}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errors.rawDataType}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>processedDataType</label>
                    <input
                      name="processedDataType"
                      type="varchar"
                    //   value={this.state.processedDataType}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errors.processedDataType}</div>
                  </div>

                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>unit</label>
                    <input
                      name="unit"
                      type="varchar"
                    //   value={this.state.unit}
                      onChange={this.handleChange}
                      className="form-control"
                    />

                    <div className="text-danger">{this.state.errors.unit}</div>
                  </div>

                  {/* TODO INTEGRATE WITH API */}
                  <div className="col-md-6 mb-2" style={{ width: '100%' }}>
                    <label>Alert Criticality</label>
                    <select
                      name="alertCriticality"
                      onChange={this.handleChange}
                      className={`form-control
                    ${this.state.errors.alertCriticality ? 'is-invalid' : ''}`}
                    >
                      <option value="" />
                      {this.state.Alert_Criticality.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className="text-danger">{this.state.errors.alertCriticality}</div>

                  </div>

                </div>
                <input type="submit" value="Add Sensor" className="btn btn-primary" style={{ marginLeft: '12px' }} />

                <Button onClick={() => { window.history.go(-1); }} type="reset" className="btn btn-secondary" style={{ marginLeft: '2%' }}>
                  Cancel
                </Button>

              </form>
            </div>
          </div>
        );
      }
}

export default AddSensorForm;
