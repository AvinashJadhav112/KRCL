/* eslint-disable import/no-cycle */
/* eslint-disable react/display-name */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
// import ResponsiveDrawer from './components/drawer.js';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import DeleteIcon from '@material-ui/icons/Delete';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IotModelDataGrid from './iotModelDataGrid';

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

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function IotModel() {
  const classes = useStyles();
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

  const columns = [
    { field: 'serial_number', headerName: 'Serial Number', width: 200 },
    { field: 'model_name', headerName: 'Model Name', width: 200 },
    { field: 'added_date', headerName: 'Added Date', width: 200 },
    { field: 'description', headerName: 'Description', width: 200 },
    // new edit button added
    {
      field: 'editButton',
      headerName: 'Edit',
      sortable: false,
      width: 100,
      // disableClickEventBubbling: true,
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

    {
      field: 'sensor_mappingButton',
      headerName: 'Add/View Sensor Mapping',
      sortable: false,
      width: 250,
      // disableClickEventBubbling: true,
      renderCell: () => {
        const onClick = () => {

        };

        return (
          <Button onClick={onClick}>
            <Link to="/iot_model/iotAddSensorMapping.js">
              <EditAttributesIcon />
            </Link>
          </Button>
        );
      },
    },
    // delete button
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
    {
      id: 1, serial_number: '1', model_name: 'Hoist', added_date: '01/01/2020', description: 'write here',
    },
    {
      id: 2, serial_number: '2', model_name: 'HCL', added_date: '01/01/2020', description: 'write here',
    },
    {
      id: 3, serial_number: '3', model_name: 'VT', added_date: '01/01/2020', description: 'write here',
    },
    {
      id: 4, serial_number: '4', model_name: 'Hitachi', added_date: '01/01/2020', description: 'write here',
    },
    {
      id: 5, serial_number: '5', model_name: 'VT', added_date: '01/01/2020', description: 'write here',
    },
  ];

  return (
    <div style={{ marginLeft: '5%', marginTop: '8%' }}>

      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
      }}
      >

        <Typography>
          <h3>IOT Model</h3>
        </Typography>

        <div>
          <Link to="/iot_model/iotAddNewModel.js" style={{ textDecoration: 'none' }}>
            <Button id="add-model-button" variant="contained" color="primary">
              Add New
            </Button>
          </Link>
        </div>
      </div>
      <div style={{ marginTop: '2%' }}>
        <IotModelDataGrid />

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

    </div>
  );
}
export default IotModel;
