/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/extensions */
/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable no-alert */

import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import CompEditUserEditIcon from './compEditUserEditIcon.js';
import CompEditAddUser from './compEditAddUser.js';
import CompEquipmentEditAccess from './compEquipmentEditAccess.js';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(1),
    paddingLeft: '20%',
    paddingTop: '0%',
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '54ch',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 420,
  },
  formControl1: {
    margin: theme.spacing(1),
    minWidth: 260,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

}));

function CompanyEdit() {
  const classes = useStyles();

  // For User table edit user role
  const [onEd, setOnEd] = React.useState(false);

  const handleClickOpen3 = () => {
    setOnEd(true);
  };

  const handleClose3 = () => {
    setOnEd(false);
  };
  // for Users table delete icon
  const [on, setOn] = React.useState(false);

  const handleClickOpen2 = () => {
    setOn(true);
  };

  const handleClose2 = () => {
    setOn(false);
  };

  // DELETE ICON FOR EQUIPMENT TABLE

  // for EQUIPMENT table delete icon
  const [onEq, setOnEq] = React.useState(false);

  const handleClickOpen4 = () => {
    setOnEq(true);
  };
  const handleClose4 = () => {
    setOnEq(false);
  };

  const equipmentColumns = [
    { field: 'id', headerName: 'Sr.No', width: 90 },
    { field: 'Name', headerName: 'Equipment Name', width: 200 },
    { field: 'Status', headerName: 'Active Status', width: 200 },
    { field: 'Date', headerName: 'Status Date', width: 200 },

    {
      field: 'equipmentdeleteButton',
      headerName: 'Delete',
      sortable: false,
      width: 130,
      // disableClickEventBubbling: true,
      renderCell: () => <Button onClick={handleClickOpen4}><DeleteIcon /></Button>,
    },

  ];

  const equipmentRows = [
    {
      id: 1, Name: 'ABC', Status: 'Active', Date: '12/02/2020',
    },
    {
      id: 2, Name: 'XYZ', Status: 'Inactive', Date: '18/11/2020',
    },
    {
      id: 3, Name: 'DEF', Status: 'Active', Date: '31/01/2021',
    },

  ];
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'role', headerName: 'Role', width: 300 },
    {
      field: 'editButton',
      headerName: 'Edit',
      sortable: false,
      width: 130,
      // disableClickEventBubbling: true,
      // eslint-disable-next-line react/display-name
      renderCell: () => <Button onClick={handleClickOpen3}><EditIcon /></Button>,
    },

    {
      field: 'userdeleteButton',
      headerName: 'Delete',
      sortable: false,
      width: 130,
      // disableClickEventBubbling: true,
      // eslint-disable-next-line react/display-name
      renderCell: () => <Button onClick={handleClickOpen2}><DeleteIcon /></Button>,
    },

  ];
  const rows = [
    { id: 1, name: 'Aware', role: 'App Admin' },
    { id: 2, name: 'Elite-crane', role: 'App Admin' },

  ];
  const [selectedValue, setSelectedValue] = React.useState('Active');

  const radiohandleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // For company Add user button
  const [Open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // For Comp-Edit equipment Access
  const [openDialogEquipment, setOpenDialogEquipment] = React.useState(false);
  const handleClickOpenEquipment = () => {
    setOpenDialogEquipment(true);
  };

  const handleCloseDialogEquipment = () => {
    setOpenDialogEquipment(false);
  };

  // for validation company page
  const validationSchema = Yup.object().shape({
    companyName: Yup.string()
      .required('Company Name is required'),

    buildingName: Yup.string()
      .required('Building Name is required'),

    societyName: Yup.string()
      .required('Society Name is required'),

    landmark: Yup.string()
      .required('Landmark is required'),

    pincode: Yup.number()
      .typeError('Invalid pin code')
      .required('Pincode is required'),

    websiteURL: Yup.string()
      .required('Website URL is required'),

    mobile: Yup.string()
      .required('Mobile is required')
      .matches(/^[6-9]\d{9}$/, 'Mobile Number should be in right Format'),

    emailID: Yup.string()
      .required('Email ID is required'),

    city: Yup.string()
      .required('City is required'),

    state: Yup.string()
      .required('State is required'),

    country: Yup.string()
      .required('Country is required'),

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
      <div style={{ paddingLeft: '', paddingBottom: '1%' }}>
        <Typography variant="h6">Company/Update Company:</Typography>
      </div>

      <div>
        <FormControl component="fieldset" style={{ paddingLeft: '2%' }}>
          <FormLabel component="legend">Status</FormLabel>

          <FormControlLabel
            value="Active"
            control={(
              <Radio
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

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <div className="card-body">

          <div className="form-row">

            <div className="form-group col-5">
              <label>Company Name</label>
              <input name="companyName" type="text" ref={register} className={`form-control ${errors.companyName ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.companyName?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Building Name</label>
              <input name="buildingName" type="text" ref={register} className={`form-control ${errors.buildingName ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.buildingName?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Society Name</label>
              <input name="societyName" type="text" ref={register} className={`form-control ${errors.societyName ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.societyName?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Landmark</label>
              <input name="landmark" type="text" ref={register} className={`form-control ${errors.landmark ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.landmark?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Pin code</label>
              <input name="pincode" type="text" ref={register} className={`form-control ${errors.pincode ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.pincode?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Website URL</label>
              <input name="websiteURL" type="text" ref={register} className={`form-control ${errors.websiteURL ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.websiteURL?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>City</label>
              <input name="city" type="text" ref={register} className={`form-control ${errors.city ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.city?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>State</label>
              <select name="state" ref={register} className={`form-control ${errors.state ? 'is-invalid' : ''}`}>
                {/* // eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <option value="" />
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujrat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Panjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="west Bengal">West Bengal</option>
              </select>
              <div className="invalid-feedback">{errors.state?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Country</label>
              <input name="country" type="string" ref={register} className={`form-control ${errors.country ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.country?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Mobile No</label>
              <input name="mobile" type="string" ref={register} className={`form-control ${errors.mobile ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.mobile?.message}</div>
            </div>

            <div className="form-group col-5">
              <label>Email ID</label>
              <input name="emailID" type="string" ref={register} className={`form-control ${errors.emailID ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.emailID?.message}</div>
            </div>

          </div>
        </div>
        <div className="form-group" style={{ marginLeft: '30%', paddingBottom: '1%', paddingTop: '2%' }}>
          <button type="submit" className="btn btn-primary mr-1">Submit</button>
          <Link to="company.js">
            <button className="btn btn-secondary">
              Cancel
            </button>
          </Link>
        </div>

      </form>
      <div>
        <div style={{ paddingLeft: '1%', paddingTop: '3%', paddingBottom: '1%' }}>
          <Typography variant="h6" noWrap component="div">
            Equipment Access:
          </Typography>

        </div>

        <div style={{ paddingLeft: '68%', marginBottom: '1%' }}>
          <Button variant="contained" color="primary" onClick={handleClickOpenEquipment}>
            Add Equipment
          </Button>
          <Dialog open={openDialogEquipment} onClose={handleCloseDialogEquipment} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent>
              <CompEquipmentEditAccess />
            </DialogContent>
            <DialogActions>
              <div className="form-group" style={{ marginTop: '-25%' }}>
                <Button className="btn btn-secondary" onClick={handleCloseDialogEquipment}>Cancel</Button>
              </div>
            </DialogActions>

          </Dialog>
        </div>

        <div style={{ height: 215, width: '82%' }}>
          <DataGrid rows={equipmentRows} columns={equipmentColumns} pageSize={4} icon SettingsApplicationsOutlinedIcon />
        </div>

      </div>

      <div style={{ paddingLeft: '', paddingBottom: '', paddingTop: '1%' }}>
        <Typography variant="h6">Users:</Typography>
      </div>

      {/* company Edit Add user Button */}
      <div style={{ paddingLeft: '72%', marginBottom: '1%' }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add User
        </Button>
        <Dialog open={Open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <CompEditAddUser />
            <DialogActions>
              <div className="form-group" style={{ marginTop: '-22%' }}>
                <Button className="btn btn-primary mr-1" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </DialogActions>
          </DialogContent>

        </Dialog>
      </div>

      <div style={{ height: 215, width: '82%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={4} />
      </div>

      {/* delete confirmation in user table */}
      <div>
        <Dialog open={on} onClose={handleClose2} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you want to remove this User?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2} color="primary" variant="contained">
              Yes
            </Button>
            <Button onClick={handleClose2} variant="contained" color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* delete confirmation in equipment table */}
      <div>
        <Dialog open={onEq} onClose={handleClose4} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you want to remove this Equipment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose4} color="primary" variant="contained">
              Yes
            </Button>
            <Button onClick={handleClose4} variant="contained" color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Company edit-user table edit icon */}
      <Dialog open={onEd} onClose={handleClose3} aria-labelledby="form-dialog-title">
        <DialogContent>
          <CompEditUserEditIcon />
        </DialogContent>
        <DialogActions>
          <div className="form-group" style={{ marginLeft: '2%', marginTop: '-22%' }}>
            <Button className="btn btn-secondary" onClick={handleClose3}>
              Cancel
            </Button>
          </div>
        </DialogActions>
      </Dialog>

    </main>
  );
}

export default CompanyEdit;
