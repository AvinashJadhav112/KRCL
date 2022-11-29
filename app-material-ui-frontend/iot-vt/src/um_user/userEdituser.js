/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Link } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import UserAddNewAddCompany from './userAddNewAddCompany';
import UserEquipmentAccess from './userEquipmentAccess';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',

  },

  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },

  form: {
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingBottom: '16%',
    height: '200px',
  },

}));
//

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

function UserEditUser() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedValue, setSelectedValue] = React.useState('Active');

  const radiohandleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [eopenDelete, esetOpenDelete] = React.useState(false);
  const handleOpenDelete = () => {
    esetOpenDelete(true);
  };

  const handleDelete = () => {
    esetOpenDelete(false);
  };

  const [openEquipment, setOpenEquipment] = React.useState(false);

  const handleClickOpenEquipment = () => {
    setOpenEquipment(true);
  };

  const handleCloseEquipment = () => {
    setOpenEquipment(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last name is required'),

    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),

    alternate_email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),

    mobile: Yup.string()
      .required('Mobile is required')

      .matches(/^[6-9]\d{9}$/, 'Mobile Number should be in right Format'),

    alternate_mobile: Yup.string()
      .required(' Alternate Mobile is required')
      .matches(/^[6-9]\d{9}$/, 'Mobile Number should be in right Format'),

    companyname: Yup.string()
      .required('User Company Name is required'),

  });
  // Equipment
  const equipmentColumns = [
    { field: 'id', headerName: 'Serial No', width: 150 },
    { field: 'Name', headerName: 'Equipment Name', width: 170 },
    { field: 'Status', headerName: 'Active Status', width: 150 },

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
            <Link to="/um_user/UserEquipmentEdit.js">
              <EditIcon />
            </Link>
          </Button>
        );
      },
    },
    {
      field: 'deleteButton',
      headerName: 'Delete',
      sortable: false,
      width: 100,
      renderCell: () => <Button onClick={handleOpenDelete}><DeleteIcon /></Button>,
    },
  ];

  const equipmentRows = [
    {
      id: 1, Name: 'ABC', Status: 'Active',
    },
    {
      id: 2, Name: 'XYZ', Status: 'Inactive',
    },
    {
      id: 3, Name: 'DEF', Status: 'Active',
    },

  ];

  // Company
  const customerColumns = [
    { field: 'id', headerName: 'Serial No', width: 150 },
    { field: 'Name', headerName: 'Company name', width: 170 },
    { field: 'Role', headerName: 'Role', width: 150 },
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
            <Link to="/um_user/UserCompanyEdit.js">
              <EditIcon />
            </Link>
          </Button>
        );
      },
    },

    {
      field: 'deleteButton',
      headerName: 'Delete',
      sortable: false,
      width: 100,
      // disableClickEventBubbling: true,
      renderCell: () => {
        const onClick = () => {

        };

        return <Button onClick={handleClickOpenDelete}><DeleteIcon /></Button>;
      },
    },
  ];
  const customerRows = [
    { id: 1, Name: 'ABC', Role: 'App Admin' },
    { id: 2, Name: 'XYZ', Role: 'Customer Admin' },
    { id: 3, Name: 'DEF', Role: 'User' },

  ];
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
      <div style={{ paddingLeft: '1%' }}>
        <Typography variant="h6" noWrap component="div">
          User / Edit User
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <div className="card-body">

          <div className="form-row">

            <div className="form-group col-4">
              <label>First Name</label>
              <input name="firstName" type="text" ref={register} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.firstName?.message}</div>
            </div>
            <div className="form-group col-4">
              <label>Last Name</label>
              <input name="lastName" type="text" ref={register} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Email</label>
              <input name="email" type="text" ref={register} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Alternative Email</label>
              <input name="alternate_email" type="text" ref={register} className={`form-control ${errors.alternate_email ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.alternate_email?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Mobile No</label>
              <input name="mobile" type="int" ref={register} className={`form-control ${errors.mobile ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.mobile?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Alternate Mobile No</label>
              <input name="alternate_mobile" type="int" ref={register} className={`form-control ${errors.alternate_mobile ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.alternate_mobile?.message}</div>
            </div>

            <div className="form-group col-4">
              <label>Users Company Name</label>
              <select name="companyname" type="int" ref={register} className={`form-control ${errors.companyname ? 'is-invalid' : ''}`}>
                <option value="" />
                <option>ABC </option>
                <option>DEF</option>
                <option>FAS</option>
                <option>ABS</option>
                <option>GSP</option>
              </select>
              <div className="invalid-feedback">{errors.companyname?.message}</div>

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

          </div>

          <div className="form-group" style={{ marginLeft: '30%', paddingBottom: '1%', paddingTop: '2%' }}>
            <button type="submit" className="btn btn-primary mr-1">Submit</button>
            <Link to="user.js" style={{ textDecoration: 'none' }}>
              {' '}
              <button className="btn btn-secondary" type="cancel">Cancel</button>
            </Link>
          </div>

        </div>

      </form>

      <div>

        <div style={{ paddingLeft: '1%', paddingTop: '5%', paddingBottom: '5%' }}>
          <Typography variant="h6" noWrap component="div">
            Equipment Access
          </Typography>

        </div>

        <div style={{
          paddingLeft: '80%', paddingBottom: '1%', paddingTop: '0%', fontFamily: 'sans-serif',
        }}
        >

          <Button variant="contained" color="primary" onClick={handleClickOpenEquipment}>
            Add Equipment
          </Button>
          <Dialog open={openEquipment} TransitionComponent={Transition} keepMounted onClose={handleCloseEquipment}>
            <DialogContent>

              <UserEquipmentAccess />
              <DialogActions>
                <Button onClick={handleCloseEquipment}><span style={{ color: 'black' }}>Cancle</span></Button>

              </DialogActions>
            </DialogContent>

          </Dialog>

        </div>

        <div style={{
          height: 300, width: '85%', paddingLeft: '10%', paddingRight: '10%',
        }}
        >
          <DataGrid rows={equipmentRows} columns={equipmentColumns} pageSize={5} icon SettingsApplicationsOutlinedIcon />
        </div>

      </div>

      <div style={{ paddingLeft: '1%', paddingTop: '2%' }}>
        <Typography variant="h6" noWrap component="div">
          Company
        </Typography>

      </div>

      <div style={{
        paddingLeft: '80%', paddingBottom: '1%', paddingTop: '0%', fontFamily: 'sans-serif',
      }}
      >
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Company
        </Button>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"

        >
          <DialogContent>

            <UserAddNewAddCompany />
            <DialogActions>
              <Button onClick={handleClose}><span style={{ color: 'black' }}>Cancle</span></Button>

            </DialogActions>
          </DialogContent>

        </Dialog>

      </div>

      <div>
        <div style={{
          height: 300, width: '85%', paddingLeft: '10%', paddingRight: '10%',
        }}
        >
          <DataGrid rows={customerRows} columns={customerColumns} pageSize={4} />
        </div>
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
            Are you want to remove this company?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>No</Button>
          <Button onClick={handleCloseDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={eopenDelete}
        onClose={handleDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you want to remove this Equipment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </main>
  );
}
export default UserEditUser;
