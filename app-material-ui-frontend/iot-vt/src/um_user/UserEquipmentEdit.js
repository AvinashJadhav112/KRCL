/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
// import ResponsiveDrawer from './components/drawer.js';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',
    paddingRight: '0%',
    margin: theme.spacing(1),
  },

  root: {
    '& > *': {
      margin: theme.spacing(2),
      width: '20ch',

    },
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 170,
    marginLeft: '0%',
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

// function
function UserEquipmentEdit() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [alertName, setAlert] = React.useState('');

  const alert_criticality_dialoghandleChange = (event) => {
    setAlert(event.target.value);
  };

  const [byteName, setByte] = React.useState('');

  const byte_size_dialoghandleChange = (event) => {
    setByte(event.target.value);
  };

  const [engineeringName, setEngineering] = React.useState('');

  const engineering_unit_dialoghandleChange = (event) => {
    setEngineering(event.target.value);
  };

  const [calculationName, setCalculation] = React.useState('');

  const calculation_method_dialoghandleChange = (event) => {
    setCalculation(event.target.value);
  };

  const [selectedValue, setSelectedValue] = React.useState('Active');

  const radiohandleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  // validation schema

  const validationSchema = Yup.object().shape({

    equipment_name_dialog: Yup.string()
      .required(' Equipment Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),

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

            <div className="form-group col-4">
              <Typography>
                <h3>Edit Equipment Access</h3>
              </Typography>
            </div>

            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>

            <div className="form-group col-4">
              <label>Equipment Name</label>
              <input name="equipment_name_dialog" type="string" ref={register} className={`form-control ${errors.equipment_name_dialog ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.equipment_name_dialog?.message}</div>
            </div>

            <div className="form-group col-4" />
            <div className="form-group col-4" />

            <div style={{ paddingTop: '3%', paddingLeft: '1%' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Activity Status</FormLabel>

                <FormControlLabel
                  value=" Active "
                  control={(

                    <GreenRadio
                      checked={selectedValue === 'Active'}
                      onChange={radiohandleChange}
                      value="Active"
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'Active' }}

                    />
                  )}
                  label="Active"
                />

                <FormControlLabel
                  value="InActive"
                  control={(
                    <Radio
                      checked={selectedValue === 'InActive'}
                      onChange={radiohandleChange}
                      value="InActive"
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'InActive' }}
                    />
                    )}
                  label="InActive"
                />

              </FormControl>
            </div>

            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className=" form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-4"> </div>
            <div className="form-group col-3"> </div>

            <div className="form-group col-4">
              <button type="submit" className="btn btn-primary mr-1">Submit</button>
              <Link to="userEdituser.js" style={{ textDecoration: 'none' }}>
                {' '}
                <Button type="cancel" onClick={handleClose} variant="contained" style={{ marginLeft: '3%' }}>Cancel </Button>
              </Link>
            </div>

          </div>
        </div>
      </form>

    </main>
  );
}
export default UserEquipmentEdit;
