/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-dupe-class-members */
/* eslint-disable spaced-comment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

class IotSensorInput extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
      selected_auto_sensorId: '', //auto generated sensor id's
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
    };
  }

  async componentDidMount() {
    this.getOptions();
    const url = 'http://192.168.0.194:5005/api/1.0/iotModels';
    const response = await axios.get(url);

    this.setState({ sensorReading: response.data, loading: false });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a sensor with same name');
    }
  }

  handleSubmit(e) {
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
        .post(`http://192.168.0.194:5005/api/1.0/iotModel/${this.state.id}/sensors`, sensorData)
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
          this.state.dashboardOrder = '';
          this.state.sensorId = '';
          this.state.sensoruuId = '';
          this.state.selected_auto_sensorId = '';
          this.setState({ ...this.state });
          this.componentDidMount();
          if (res.status === 201) {
            alert('Data Added Successfully..');
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

  handleSubmitUpdated = (e) => {
    e.preventDefault();
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
        .put(`http://192.168.0.194:5005/api/1.0/iotModel/${this.state.id}/sensor/${this.state.selected_auto_sensorId}`, sensordata)
        .then(
          (res) => {
            console.log(res);
            console.log(res.data);
            if (res.status === 200) {
              alert('Sensor Updated successfully..');
            }

            console.log('Old sensor name: ', res.data.selected_name);
            console.log('Updated sensor name: ', res.data.updated_name);
            const updatedSensors = [...this.state.sensorReading];
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

  handleDelete = (event) => {
    const iotModelToDelete = this.state.iotModelName;
    event.preventDefault();
    axios.delete(`http://192.168.0.194:5005/api/1.0/iotModels/${iotModelToDelete}`)
      .then((res) => {
        console.log(res);
        console.log(res.data);
      });
  }

  handleDeleteSensor = (event) => {
    const ModelIdToDelete = this.state.id;
    const SensorToDelete = this.state.selected_auto_sensorId;
    event.preventDefault();
    axios.delete(`http://192.168.0.194:5005/api/1.0/iotModel/${ModelIdToDelete}/sensor/${SensorToDelete}`)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        this.componentDidMount();
        this.getOptions();
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
        this.setState({ ...this.state });
      });
  }

  // here we're changing state value for templateName and id
  handleChangeDropdown = (e) => {
    this.setState({ iotModelName: e.label, id: e.value, sensorsOfSelectedModel: e.sensors });
  }

  async getOptions() {
    const res = await axios.get('http://192.168.0.194:5005/api/1.0/iotModels');
    const { data } = res;
    const options = data.map((d) => ({
      value: d.id,
      label: d.iotModelName,
      sensors: d.sensors,
    }));
    this.setState({ selectOptions: options });
  }

  refresh=() => {
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
    console.warn(this.props);

    const columns = [
      { field: 'sensorId', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Sensor Name', width: 130 },
      { field: 'min', headerName: 'Min', width: 130 },
      { field: 'max', headerName: 'Max', width: 130 },
      { field: 'processedDataType', headerName: 'Processed Data', width: 130 },
      { field: 'rawDataType', headerName: 'Raw Data', width: 130 },
      { field: 'unit', headerName: 'Unit', width: 130 },
      { field: 'formula', headerName: 'Formula', width: 200 },
      { field: 'dashboardOrder', headerName: 'Dash Sequence number', width: 200 },
      { field: 'alertTime', headerName: 'alertTime', width: 200 },
      { field: 'alertCriticality', headerName: 'alertCriticality', width: 200 },
      // here in this edit button should map with sensor name which is present in that same column
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
      // this should delete selected sensor
      {
        field: 'deleteButton',
        headerName: 'Delete',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {
          };

          return <Button type="submit" onClick={this.handleDeleteSensor}><DeleteIcon /></Button>;
        },
      },
    ];

    const row = [];
    this.state.sensorsOfSelectedModel.map((it) => {
      row.push(
        {
          id: it.id,
          name: it.name,
          min: it.min,
          max: it.max,
          processedDataType: it.processedDataType,
          rawDataType: it.rawDataType,
          unit: it.unit,
          formula: it.formula,
          sensorId: it.sensorId,
          sensoruuId: it.id,
          dashboardOrder: it.dashboardOrder,
          alertTime: it.alertTime,
          alertCriticality: it.alertCriticality,
        },
      );
    });

    const Alert_Criticality = ['High', 'Medium', 'Low', 'None'];

    return (
      <div>
        <div>
          <h4>
            {this.props.name}
          </h4>
          <h4>{this.props.id}</h4>

        </div>

        <div key={row.id} style={{ marginBottom: '2%' }}>
          {console.log(row)}
          <form onSubmit={this.handleDelete}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <h4> Add Sensor Mapping </h4>
              <button type="submit" onClick={this.refresh} className="btn btn-primary mr-1">
                Delete Model
                <DeleteIcon />
              </button>
            </div>
          </form>

        </div>

        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <div className="form-group col-4">
                <Select options={this.state.selectOptions} onChange={this.handleChangeDropdown} />
              </div>

              <div className="form-group col-4" />
              <div className="form-group col-4" />

              <div className="form-group col-4">
                <label>Sensor id</label>
                <input
                  name="sensorId"
                  type="text"
                  value={this.state.sensorId}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.sensorId}</div>
              </div>

              <div className="form-group col-4">
                <label>Dashboard sequence number</label>
                <input
                  name="dashboardOrder"
                  type="text"
                  value={this.state.dashboardOrder}
                  onChange={this.handleChange}
                  className="form-control"
                />
                <div className="text-danger">{this.state.errors.dashboardOrder}</div>

              </div>

              <div className="form-group col-4">
                <label>name</label>
                <input
                  name="name"
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.name}</div>
              </div>

              <div className="form-group col-4">
                <label>min</label>
                <input
                  name="min"
                  type="int"
                  value={this.state.min}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.min}</div>
              </div>

              <div className="form-group col-4">
                <label>max</label>
                <input
                  name="max"
                  type="int"
                  value={this.state.max}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.max}</div>
              </div>

              <div className="form-group col-4">
                <label>alertTime</label>
                <input
                  name="alertTime"
                  type="int"
                  value={this.state.alertTime}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.alertTime}</div>
              </div>

              <div className="form-group col-4">
                <label>formula</label>
                <input
                  name="formula"
                  type="varchar"
                  value={this.state.formula}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.formula}</div>
              </div>

              <div className="form-group col-4">
                <label>rawDataType</label>
                <input
                  name="rawDataType"
                  type="varchar"
                  value={this.state.rawDataType}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.rawDataType}</div>
              </div>

              <div className="form-group col-4">
                <label>processedDataType</label>
                <input
                  name="processedDataType"
                  type="varchar"
                  value={this.state.processedDataType}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.processedDataType}</div>
              </div>

              <div className="form-group col-4">
                <label>unit</label>
                <input
                  name="unit"
                  type="varchar"
                  value={this.state.unit}
                  onChange={this.handleChange}
                  className="form-control"
                />

                <div className="text-danger">{this.state.errors.unit}</div>
              </div>

              {/* TODO INTEGRATE WITH API */}
              <div className="form-group col-4">
                <label>Alert Criticality</label>
                <select
                  name="alertCriticality"
                  onChange={this.handleChange}
                  className={`form-control
                    ${this.state.errors.alertCriticality ? 'is-invalid' : ''}`}
                >
                  <option value="" />
                  {Alert_Criticality.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className="text-danger">{this.state.errors.alertCriticality}</div>

              </div>

            </div>
            <input type="submit" value="Add Sensor" className="btn btn-primary" />

          </form>
        </div>

        {(() => {
          if (this.state.iotModelName === '') {
            return <h1> </h1>;
          }

          return (

            <div>
              <div key={row.id}>
                <div style={{ height: 400, width: '100%', marginTop: '5%' }}>
                  <DataGrid
                    checkboxSelection
                    rows={row}
                    columns={columns}
                    pageSize={6}
                    icon
                    SettingsApplicationsOutlinedIcon
                    onRowSelected={(newSelection) => {
                      this.setState({
                        selected_auto_sensorId: newSelection.data.sensoruuId,
                        selected_name: newSelection.data.name,
                        selected_min: newSelection.data.min,
                        selected_max: newSelection.data.max,
                        selected_alertTime: newSelection.data.alertTime,
                        selected_formula: newSelection.data.formula,
                        selected_rawDataType: newSelection.data.rawDataType,
                        selected_processedDataType: newSelection.data.processedDataType,
                        selected_unit: newSelection.data.unit,
                        selected_alertCriticality: newSelection.data.alertCriticality,
                        selected_dashboardOrder: newSelection.data.dashboardOrder,
                        selected_sensorId: newSelection.data.sensorId,
                      });
                    }}
                  />
                  <br />
                </div>
              </div>
            </div>
          );
        })()}

        {(() => {
          if (this.state.selected_auto_sensorId === '') {
            return <h1> </h1>;
          }

          return (

            <div>
              <form onSubmit={this.handleSubmitUpdated}>
                <h3> editing sensors </h3>
                <div className="form-row">

                  <div className="form-group col-6">
                    <label>Old Sensor id</label>
                    <input
                      name="selected_sensorId"
                      type="text"
                      value={this.state.selected_sensorId}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated Sensor id</label>
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
                    <label>Old Dashboard sequence number</label>
                    <input
                      name="selected_dashboardOrder"
                      type="text"
                      value={this.state.selected_dashboardOrder}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-6">
                    <label>Updated Dashboard sequence number</label>
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
                    <label>Old name</label>
                    <input
                      name="selected_name"
                      type="text"
                      value={this.state.selected_name}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-6">
                    <label>Updated name</label>
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
                    <label>old min</label>
                    <input
                      name="selected_min"
                      type="int"
                      value={this.state.selected_min}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>updated min</label>
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
                    <label>old max</label>
                    <input
                      name="selected_max"
                      type="int"
                      value={this.state.selected_max}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>updated max</label>
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
                    <label>old alertTime</label>
                    <input
                      name="alertTime"
                      type="int"
                      value={this.state.selected_alertTime}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>updated alertTime</label>
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
                    <label>Old formula</label>
                    <input
                      name="selected_formula"
                      type="varchar"
                      value={this.state.selected_formula}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated formula</label>
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
                    <label>old rawDataType</label>
                    <input
                      name="selected_rawDataType"
                      type="varchar"
                      value={this.state.selected_rawDataType}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>updated rawDataType</label>
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
                    <label>Old processedDataType</label>
                    <input
                      name="selected_processedDataType"
                      type="varchar"
                      value={this.state.selected_processedDataType}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated processedDataType</label>
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
                    <label>Old unit</label>
                    <input
                      name="selected_unit"
                      type="varchar"
                      value={this.state.selected_unit}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group col-6">
                    <label>Updated unit</label>
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
                    <label>Old alertCriticality</label>
                    <input
                      name="selected_alertCriticality"
                      type="varchar"
                      value={this.state.selected_alertCriticality}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-6">
                    <label>Updated alertCriticality</label>
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

              </form>
            </div>
          );
        })()}

      </div>
    );
  }
}
export default IotSensorInput;
