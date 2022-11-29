/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/display-name */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { green } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import Slide from '@material-ui/core/Slide';
import IotDeviceEditAddUser from './iotDeviceEditAddUser';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',

  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

}));

const model_name = [
  'Aether Test',
  'Aether Test DM1',
  'Aether Test 2',
  'AetherDM2',
  ' AetherModel5',
  ' Avare_2018',
  ' Avare Testing',
  ' Avare Testing_2',
  ' Crane_test_DeviceType',
  ' Forklift_Demo',
  ' HHL_Device',
  ' V',
  'Vibration_US',
];

const device_name = [
  'Crane',
  'JCB',
  'Heavy cranes',
];

const firmware = [
  'Aether',
  ' FW_30_07_4_HT_bin ',

];

const status = [
  'Active',
  'InActive',
];

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// function
function IotDeviceEdit() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [modelName, setModel] = React.useState('');

  const selectModelNamehandleChange = (event) => {
    setModel(event.target.value);
  };

  const [firmwareName, setFirmware] = React.useState('');

  const selectFirmwarehandleChange = (event) => {
    setFirmware(event.target.value);
  };

  const [selectedValue, setSelectedValue] = React.useState('Active');

  const radiohandleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // for delete dialogbox in edit page
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const columns = [
    { field: 'user', headerName: 'User', width: 200 },
    { field: 'role', headerName: 'Role', width: 200 },
    {
      field: 'deleteButton',
      headerName: 'Delete',
      sortable: false,
      width: 100,
      // disableClickEventBubbling: true,
      renderCell: () => {
        const onClick = () => {

        };

        return <Button onClick={handleClickOpenDeleteDialog}><DeleteIcon /></Button>;
      },
    },

  ];

  const rows = [
    { id: 1, user: 'VT', role: 'App Admin' },
    { id: 2, user: 'Hitachi', role: 'Company Admin' },
    { id: 3, user: 'HCL', role: 'Company User' },
  ];

  // validate schema

  const validationSchema = Yup.object().shape({
    device_serial_number: Yup.number()
      .typeError('Invalid number')
      .required('Device_Serial_Number is required'),

    manufacturing_date: Yup.string()
      .required('Manufacturing Date is required')
      .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Manufacturing Date must be a valid date in the format YYYY-MM-DD'),

    model_name: Yup.string()
      .required(' Model Name is required'),

    device_name: Yup.string()
      .required('Device Name is required'),

    firmware: Yup.string()
      .required('Firmware is required'),

  });

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
      <div style={{ paddingLeft: '2%', paddingBottom: '0%' }}>

        <Typography>
          <h3>Edit Devices</h3>
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>

        <div className="form-row">

          <div>
            <FormControl component="fieldset" style={{ paddingLeft: '10%' }}>
              <FormLabel component="legend">Status</FormLabel>

              <FormControlLabel
                value="Active"
                control={(
                  <GreenRadio
                    checked={selectedValue === 'Active'}
                    onChange={radiohandleChange}
                    value="Active"
                    name="radio_button_demo"
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
                    name="radio_button_demo"
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
          <div className="form-group col-4"> </div>

          <div className="form-group col-5">
            <label>Device Name</label>
            <input name="device_name" type="int" ref={register} className={`form-control ${errors.device_name ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.device_name?.message}</div>
          </div>

          <div className="form-group col-5">
            <label>Device Serial Number</label>
            <input name="device_serial_number" type="int" ref={register} className={`form-control ${errors.device_serial_number ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.device_serial_number?.message}</div>
          </div>

          <div className="form-group col-5">
            <label>Manufacturing  Date</label>
            <input name="manufacturing_date" type="date" ref={register} className={`form-control ${errors.manufacturing_date ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.manufacturing_date?.message}</div>
          </div>

          <div className="form-group col-5">
            <label>Model Name</label>
            <select ref={register} name="model_name" className={`form-control ${errors.model_name ? 'is-invalid' : ''}`}>
              <option value="" />
              {model_name.map((name) => (
                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.model_name?.message}</div>
          </div>

          <div className="form-group col-5">
            <label>Firmware</label>
            <select ref={register} name="firmware" className={`form-control ${errors.firmware ? 'is-invalid' : ''}`}>
              <option value="" />
              {firmware.map((name) => (
                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.firmware?.message}</div>
          </div>

          <div className="form-group col-4"> </div>
          <div className="form-group col-4"> </div>
          <div className="form-group col-4"> </div>
          <div className="form-group col-4"> </div>
          <div className="form-group col-4"> </div>
          <div className="form-group col-4"> </div>
          <div className="form-group col-4"> </div>

          <div className="form-group col-4">
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
            <Link to="iotDevices.js" style={{ textDecoration: 'none' }}>
              <Button variant="contained" type="reset" style={{ marginLeft: '3%' }}>
                Cancel
              </Button>
            </Link>
          </div>

        </div>

      </form>

      <div style={{ marginLeft: '50%' }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add User
        </Button>
        <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
          <DialogContent>
            <IotDeviceEditAddUser />
          </DialogContent>
          <DialogActions>
            <Button className="btn btn-secondary" onClick={handleClose} style={{ marginLeft: '1%', marginTop: '-30%' }}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Typography>
          <h5>Users:</h5>
        </Typography>
      </div>

      <div style={{ height: 300, width: '60%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={6} checkboxSelection />
      </div>
      <div>
        <Dialog
          open={openDeleteDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete ??
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              No
            </Button>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    </main>
  );
}
export default IotDeviceEdit;
