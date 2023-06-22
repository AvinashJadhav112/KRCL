/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable no-alert */

// import ResponsiveDrawer from './components/drawer.js';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
// import Dashboard from '../components/dashboard';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',

  },

}));

const iotDeviceType = [
  'AWARE',
  'AWARE Testing',
  'Crane Test Device Type',
  'CTD2',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function MheSpecificationmodel() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object().shape({
    specid: Yup.number()
      .required('spec number is required')
      .typeError('you must specify a number'),

    specdetail: Yup.string()
      .required('Spec detail is required'),

    specification: Yup.string()
      .required('Specification is required'),

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

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const specColumns = [
    { field: 'id', headerName: 'Spec ID', width: 200 },
    { field: 'Spec_Details', headerName: 'Spec Details', width: 200 },
    { field: 'Specification', headerName: 'Specification', width: 200 },
    {
      field: 'editButton',
      headerName: 'Edit',
      sortable: false,
      width: 100,
      // disableClickEventBubbling: true,
      renderCell: () => (
        <Link to="/mhe_model/MheSpecificationEdit.js">
          <Button>
            <EditIcon />
          </Button>
        </Link>
      ),
    },

    {
      field: 'deleteButton',
      headerName: 'Delete',
      sortable: false,
      width: 100,
      // disableClickEventBubbling: true,
      renderCell: () => <Button onClick={handleClickOpenDelete}><DeleteIcon /></Button>,
    },

  ];

  const specRows = [
    { id: 1, Spec_Details: 'Snow', Specification: 'Jon' },
    { id: 2, Spec_Details: 'Lannister', Specification: 'Cersei' },
    { id: 3, Spec_Details: 'Lannister', Specification: 'Jaime' },

  ];

  return (
    <div style={{ marginTop: '8%', marginLeft: '5%' }}>
      {/* <Dashboard /> */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

        <Typography>
          <h3>MHE Model</h3>
        </Typography>
      </div>
      <div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={iotDeviceType}
          style={{ width: 300 }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} label="M.H.E. Device Type" />}
        />

      </div>
      <div style={{ paddingTop: '2%' }}>
        <Typography variant="h6">
          Specification details of a model
        </Typography>

      </div>

      <div style={{
        paddingLeft: '58%', paddingBottom: '1%', paddingTop: '0%', fontFamily: 'sans-serif', marginTop: '-2%',
      }}
      >

        <Link to="/mhe_model/MheSpecificationAdd.js" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">

            Add Model Specification
          </Button>
        </Link>
      </div>

      <div style={{
        height: 300, width: '80%',
      }}
      >
        <DataGrid rows={specRows} columns={specColumns} pageSize={5} />
      </div>
      <div style={{ paddingBottom: '1%', paddingTop: '2%' }}>

        <Link to="mhemodel.js" style={{ textDecoration: 'none' }}>
          {' '}
          <Button type="cancel" onClick={handleClose} variant="contained">Cancel </Button>
        </Link>
      </div>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you want to remove this Specification?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>No</Button>
          <Button onClick={handleCloseDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>

  );
}
export default MheSpecificationmodel;
