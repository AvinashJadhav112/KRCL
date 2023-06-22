/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';

import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import IotAddNewModel from './iotAddNewModel';
import IotModelTable from './IotModelTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#fff',
  border: '2px solid transperent',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,

};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class IotModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openEditModal: false,
      openDeleteDialog: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickOpenDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleCloseDeleteDialog = (st) => {
    this.setState({ openDeleteDialog: st });
  };

  render() {
    const { openDeleteDialog } = this.state;

    return (
      <div style={{ marginLeft: '5%', marginTop: '8%' }}>
        <div style={{ display: 'flex' }}>
          <Typography>
            <h3>IOT Model</h3>
          </Typography>

          <div style={{ display: 'flex', marginLeft: 'auto' }}>
            <Modal open={this.state.open} onClose={() => this.handleClose(false)}>
              <Box sx={style}>
                <IotAddNewModel closeModal={this.handleClose} />
              </Box>
            </Modal>

            <Modal open={this.state.openEditModal} onClose={() => this.setState({ openEditModal: false })}>
              <Box sx={style}>
                <iotModelDataGrid />
              </Box>
            </Modal>

            <Button style={{ height: '2.3rem' }} onClick={this.handleClickOpen} id="add-model-button" variant="contained" color="primary">
              Add New Model
            </Button>

            {/* <Link to="/iot_model/iotAddSensorMapping.js" style={{ textDecoration: 'none' }}>
              <Button style={{ marginLeft: '10px' }} id="add-model-button" variant="contained" color="primary">
                Add New Sensor
              </Button>
            </Link> */}
          </div>
        </div>

        <div style={{ marginTop: '2%' }}>
          <IotModelTable />
        </div>

        <div>
          <Dialog
            open={openDeleteDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">Delete</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseDeleteDialog} color="primary">
                No
              </Button>
              <Button onClick={this.handleCloseDeleteDialog} color="primary">
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default IotModel;
