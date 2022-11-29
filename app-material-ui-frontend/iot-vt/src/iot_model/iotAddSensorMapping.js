/* eslint-disable react/display-name */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DataGrid } from '@material-ui/data-grid';
import IotSensorTable from './iotSensorTable';
import IotSensorInput from './iotSensorInput';

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

function IotAddSensorMapping() {
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

  // for delete dialogbox in edit page
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <main style={{ marginLeft: '5%' }}>
      <div style={{ marginTop: '8%' }}>
        <IotSensorInput title="Add Sensor Mapping" />
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
export default IotAddSensorMapping;
