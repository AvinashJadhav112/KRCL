/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */

/* eslint-disable no-unused-vars */

import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { DataGrid } from '@material-ui/data-grid';
// import Dashboard from '../components/dashboard';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',

  },

  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '35ch',
    },
  },

  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 275,
  },

}));

const alertcriticality = [
  'high',
  'low',
  'medium',
  'none',

];

const calculationMethod = [
  'Formula',
  'none',

];

const equipmentName = [
  'abc',
  'xyz',
  'www',
  'lpq',
  'ssr',

];

const columns = [

  { field: 'id', headerName: 'Sensor ID', width: 130 },
  { field: 'equipmentName', headerName: 'Equipment Name', width: 130 },
  { field: 'sensorName', headerName: 'Sensor Name', width: 130 },
  {
    field: 'sequenceNumber', headerName: 'Sequence Number', type: 'number', width: 130,
  },
  { field: 'alertCriticality', headerName: 'Alert Criticality', width: 130 },
  {
    field: 'alertTime', headerName: 'Alert Time', type: 'number', width: 130,
  },
  { field: 'byteSize', headerName: 'Byte Size', width: 130 },
  {
    field: 'minValue', headerName: 'Min Value', type: 'number', width: 130,
  },
  {
    field: 'maxValue', headerName: 'Max Value', type: 'number', width: 130,
  },
  { field: 'enggunit', headerName: 'Engg. Unit', width: 130 },
  { field: 'calMethod', headerName: 'Cal. Method', width: 130 },

];

const rows = [
  {
    id: 1, equipmentName: 'abc', sensorName: 'heat sensor', alertCriticality: 'high', sequenceNumber: 35, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'Torque', calMethod: 'formula',
  },
  {
    id: 2, equipmentName: 'abc', sensorName: 'Lanniser', alertCriticality: 'medium', sequenceNumber: 42, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'time', calMethod: 'formula',
  },
  {
    id: 3, equipmentName: 'abc', sensorName: 'moist sensor', alertCriticality: 'low', sequenceNumber: 45, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'vibration', calMethod: 'formula',
  },
  {
    id: 4, equipmentName: 'abc', sensorName: 'Stark', alertCriticality: 'low', sequenceNumber: 16, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'Torque', calMethod: 'formula',
  },
  {
    id: 5, equipmentName: 'abc', sensorName: 'hoist', alertCriticality: 'medium', sequenceNumber: null, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'Torque', calMethod: 'formula',
  },
  {
    id: 6, equipmentName: 'abc', sensorName: 'Melisandre', alertCriticality: 'high', sequenceNumber: 150, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'Torque', calMethod: 'formula',
  },
  {
    id: 7, equipmentName: 'abc', sensorName: 'Clifford', alertCriticality: 'medium', sequenceNumber: 44, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'Torque', calMethod: 'formula',
  },
  {
    id: 8, equipmentName: 'abc', sensorName: 'Frances', alertCriticality: 'medium', sequenceNumber: 36, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'Torque', calMethod: 'formula',
  },
  {
    id: 9, equipmentName: 'abc', sensorName: 'Roxie', alertCriticality: 'medium', sequenceNumber: 65, alertTime: 0, byteSize: '2 byte', minValue: 0, maxValue: 200, enggunit: 'Torque', calMethod: 'formula',
  },
];

function MheEquipmentAddSensorMapping() {
  const sensorSchema = Yup.object().shape({
    equipment_name: Yup.string()
      .required('Please Select Equipment Name from list'),

    sensor_id: Yup.string()
      .required('sensor id is required'),

    sensor_name: Yup.string()
      .required('Sensor Name is required'),

    sequence_number: Yup.string()
      .required('sequence number is required'),

    alert_time: Yup.string()
      .required('alert time is required'),

    byte_size: Yup.string()
      .required('byte size is required'),

    min_value: Yup.string()
      .required('Min value is required'),

    max_value: Yup.string()
      .required('max value is required'),

    engg_unit: Yup.string()
      .required('engg unit is required'),

    alert_c: Yup.string()
      .required('alert criticality is required'),

    calculation_method: Yup.string()
      .required('Calculation Method is required'),

    formula: Yup.string()
      .required('formula is required'),

  });

  const {
    register, handleSubmit, reset, errors,
  } = useForm({

    resolver: yupResolver(sensorSchema),

  });

  function onSubmit(data) {
    // display form data on success
    // eslint-disable-next-line no-alert
    alert(`SUCCESS!! :-)\n\n${JSON.stringify(data, null, 4)}`);
  }

  return (
    <main>
      {/* <Dashboard /> */}

      <div>
        <Typography variant="h6" noWrap component="div">
          MHE Equipment Add Sensor Mapping
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>

        <div className="card-body">

          <div className="form-row">

            <div className="form-group col-4">
              <label>Select Equipment Name</label>
              <select name="equipment_name" ref={register} className={`form-control ${errors.equipment_name ? 'is-invalid' : ''}`}>
                <option value="" />
                {equipmentName.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}

              </select>
              <div className="invalid-feedback">{errors.equipment_name?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Sensor Id</label>
              <input name="sensor_id" type="number" ref={register} className={`form-control ${errors.sensor_id ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.sensor_id?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>sensor Name</label>
              <input name="sensor_name" type="text" ref={register} className={`form-control ${errors.sensor_name ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.sensor_name?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>Sequence Number</label>
              <input name="sequence_number" type="text" ref={register} className={`form-control ${errors.sequence_number ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.sequence_number?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>Alert Time</label>
              <input name="alert_time" type="text" ref={register} className={`form-control ${errors.alert_time ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.alert_time?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>Byte Size</label>
              <input name="byte_size" type="text" ref={register} className={`form-control ${errors.byte_size ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.byte_size?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>Minimum Value</label>
              <input name="min_value" type="text" ref={register} className={`form-control ${errors.min_value ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.min_value?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>Maximum Value</label>
              <input name="max_value" type="text" ref={register} className={`form-control ${errors.max_value ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.max_value?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>Engg Unit</label>
              <input name="engg_unit" type="text" ref={register} className={`form-control ${errors.engg_unit ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.engg_unit?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Alert Criticality</label>
              <select name="alert_c" ref={register} className={`form-control ${errors.alert_c ? 'is-invalid' : ''}`}>
                <option value="" />
                {alertcriticality.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}

              </select>
              <div className="invalid-feedback">{errors.alert_c?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Calculation Method</label>
              <select name="calculation_method" ref={register} className={`form-control ${errors.calculation_method ? 'is-invalid' : ''}`}>
                <option value="" />
                {calculationMethod.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}

              </select>
              <div className="invalid-feedback">{errors.calculation_method?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Formula</label>
              <input name="formula" type="text" ref={register} className={`form-control ${errors.formula ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.formula?.message}</div>
            </div>

          </div>

        </div>

        <div className="form-group" style={{ marginLeft: '35%', paddingBottom: '1%', paddingTop: '2%' }}>
          <button type="submit" className="btn btn-primary mr-1">Submit</button>
          <button className="btn btn-secondary" type="reset">Reset</button>
        </div>

      </form>

      <div style={{ height: 400, width: '100%', paddingTop: '2%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={4} />
      </div>

    </main>
  );
}
export default MheEquipmentAddSensorMapping;
