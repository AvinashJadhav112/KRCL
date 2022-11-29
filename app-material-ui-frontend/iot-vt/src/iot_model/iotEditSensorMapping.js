/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable max-len */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-alert */
/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',
  },
  // new added
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',

    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,

  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// const code for iot add new model page
const alert_criticality = [
  'Medium',
  'High',
  'Low',
  'None',
];

const byte_size = [
  '2 Byte',
  '8 Byte',
];

const engineering_unit = [
  'Angle',
  'Count',
  'Current',
  'Frequency',
  'Hoist Speed',
  'Load',
  'Location Tracker',
  'Mileage',
  'Percentage',
  'Power',
  'Pressure',
  'Speed',
  'Temperature',
  'Time',
  'Torque',
  'Vibration',
  'Voltage',
  'Volume',
  'Weight',
];

const calculation_method = [
  ' Formula',
  'LookUp Table',
];

// Function

function IotEditSensorMapping() {
  const classes = useStyles();

  const [openEditButton, setOpenEditButton] = React.useState(false);

  const handleClickOpenEditButton = () => {
    setOpenEditButton(true);
  };

  const handleCloseEditButton = () => {
    setOpenEditButton(false);
  };

  const [openDeleteButton, setOpenDeleteButton] = React.useState(false);

  const handleClickOpenDeleteButton = () => {
    setOpenDeleteButton(true);
  };

  const handleCloseDeleteButton = () => {
    setOpenDeleteButton(false);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // validation schema for iot add new model page

  const validationSchema = Yup.object().shape({

    sensor_id: Yup.number()
      .typeError('Invalid number')
      .required('Sensor Id is required'),

    sensor_name: Yup.string()
      .required('Sensor Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),

    sequence_number: Yup.number()
      .typeError('Invalid number')
      .required('Sequence Number is required'),

    alert_time: Yup.number()
      .typeError('Invalid number')
      .required('Alert Time is required'),

    minimum_value: Yup.number()
      .typeError('Invalid number')
      .required(' Minimum Value is required'),

    maximum_value: Yup.number()
      .typeError('Invalid number')
      .required(' Maximum Value is required'),

    alert_criticality: Yup.string()
      .required('Alert Criticality is required'),

    byte_size: Yup.string()
      .required(' Byte Size is required'),

    engineering_unit: Yup.string()
      .required(' Engineering Unit is required'),

    calculation_method: Yup.string()
      .required('Calculation Method  is required'),

    formula: Yup.string()
      .required('Formula is required'),
  });

  // functions to build form returned by useForm() hook
  const {
    register, handleSubmit, reset, errors,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function onSubmit(data) {
    // display form data on success
    alert(`SUCCESS!! :-)\n\n${JSON.stringify(data, null, 4)}`);
  }

  return (
    <main className={classes.content}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <div className="card-body">
          <div className="form-row">

            <div>
              <Typography>
                <h3>
                  Edit Sensor Mapping
                </h3>
              </Typography>
            </div>

            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>

            <div className="form-group col-4">
              <label>Sensor Id</label>
              <input name="sensor_id" type="int" ref={register} className={`form-control ${errors.sensor_id ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.sensor_id?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Sensor name</label>
              <input name="sensor_name" type="string" ref={register} className={`form-control ${errors.sensor_name ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.sensor_name?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Sequence Number </label>
              <input name="sequence_number" type="int" ref={register} className={`form-control ${errors.sequence_number ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.sequence_number?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Alert Time</label>
              <input name="alert_time" type="int" ref={register} className={`form-control ${errors.alert_time ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.alert_time?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Minimum Value</label>
              <input name="minimum_value" type="int" ref={register} className={`form-control ${errors.minimum_value ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.minimum_value?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Maximum Value </label>
              <input name="maximum_value" type="int" ref={register} className={`form-control ${errors.maximum_value ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.maximum_value?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Alert Criticality</label>
              <select ref={register} name="alert_criticality" className={`form-control ${errors.alert_criticality ? 'is-invalid' : ''}`}>
                <option value="" />
                {alert_criticality.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.alert_criticality?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Byte Size</label>
              <select ref={register} name="byte_size" className={`form-control ${errors.byte_size ? 'is-invalid' : ''}`}>
                <option value="" />
                {byte_size.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.byte_size?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Engineering Unit</label>
              <select ref={register} name="engineering_unit" className={`form-control ${errors.engineering_unit ? 'is-invalid' : ''}`}>
                <option value="" />
                {engineering_unit.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.engineering_unit?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Calculation Method</label>
              <select ref={register} name="calculation_method" className={`form-control ${errors.calculation_method ? 'is-invalid' : ''}`}>
                <option value="" />
                {calculation_method.map((name) => (
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
              <label>Formula </label>
              <input name="formula" type="int" ref={register} className={`form-control ${errors.formula ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.formula?.message}</div>
            </div>

            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div>
              <Button variant="contained" color="primary" type="submit" style={{ marginTop: '2%', marginLeft: '1%' }}>
                Submit
              </Button>
              <Button variant="contained" type="reset" style={{ marginLeft: '60%', marginTop: '-34%' }}>
                Cancel
              </Button>
            </div>

          </div>
        </div>
      </form>

    </main>
  );
}
export default IotEditSensorMapping;
