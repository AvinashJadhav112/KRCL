/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-alert */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';

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

class Firmware extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      firmwareInfo: [],
      open: '',

      selected_version: '',
      selected_firmware: '',
      selected_addedDate: '',
      selected_firmwareName: '',

      updated_firmware: '',
      updated_addedDate: '',
      updated_version: '',
    };
  }

  async componentDidMount() {
    const url = 'http://192.168.0.194:5005/api/v1/firmwares/getFirmwareDetails';
    const response = await axios.get(url);
    this.setState({ firmwareInfo: response.data, loading: false });
  }

  getFirmwareDetails =async (version) => {
    console.log(version);
    const result = await axios.get('http://192.168.0.194:5005//api/v1/firmwares/getFirmwareDetails');
    const filered = result.data.filter((item) => item.firmwareVersion === version);
    // console.log(filered)
    this.setState({
      updated_firmware: filered[0].firmwareName,
      updated_addedDate: filered[0].firmwareAddedDate,
      updated_version: filered[0].firmwareVersion,
    });
  }

  onClick = () => { }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmitUpdated = (e) => {
    e.preventDefault();
    this.EditUpdate();

    const alertData = {
      firmware: this.state.updated_firmware,
      addedDate: this.state.updated_addedDate,
      version: this.state.updated_version,
      firmwareName: this.state.selected_firmwareName,
    };

    axios.put(`http://192.168.0.194:5005/1.0/firmware/${this.state.selected_firmwareName}`, alertData)
      .then((res) => {
        if (res.status === 200) {
          alert('Alert data updated Successfully..');
        }
        this.setState({
          selected_addedDate: '',
          selected_version: '',
          selected_firmwareName: '',
          selected_firmware: '',
          updated_addedDate: '',
          updated_firmware: '',
          updated_version: '',
        });
        this.componentDidMount();
      })
      .catch((apiError) => {
        console.log(apiError);
      });
  };

  handleDelete = (event) => {
    const firmwareToDelete = this.state.selected_firmwareName;
    event.preventDefault();
    axios.delete(`http://192.168.0.194:5005/1.0/firmware/${firmwareToDelete}`)
      .then((res) => {
        this.componentDidMount();
        this.setState({
          selected_addedDate: '',
          selected_version: '',
          selected_firmwareName: '',
          selected_firmware: '',
          updated_addedDate: '',
          updated_firmware: '',
          updated_version: '',
        });
      });
  }

  EditUpdate() {
    if (this.state.updated_firmware === '') {
      this.state.updated_firmware = this.state.selected_firmware;
    }
    if (this.state.updated_version === '') {
      this.state.updated_version = this.state.selected_version;
    }
    if (this.state.updated_addedDate === '') {
      this.state.updated_addedDate = this.state.selected_addedDate;
    }
  }

   handleOpen = () => this.setState({ open: true });

   handleClose = () => this.setState({ open: false });

   render() {
     const rows = this.state.firmwareInfo.map((it) => ({
       id: it.id,
       firmwareName: it.firmwareName,
       deviceId: it.deviceId,
       deviceName: it.deviceName,
       version: it.firmwareVersion,
       addedDate: it.firmwareAddedDate,
     }));

     return (
       <div style={{ marginTop: '8%', marginLeft: '5%' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
           <h3>Firmware</h3>
           <div>
             <Link to="/iot_firmware/FirmwareAdd.js" style={{ textDecoration: 'none' }}>
               <Button style={{ marginBottom: '10px' }} variant="contained" color="primary">
                 Add New
               </Button>
             </Link>
           </div>
         </div>

         <Table
           responsive
           style={{
             border: '1px solid #ccc', boxShadow: '2px 7px 15px 5px #80808033', borderRadius: '10px', outline: 'none',
           }}
         >
           <thead>
             <tr>
               <th>Version</th>
               <th>Firmware Name</th>
               <th>Added Date</th>
             </tr>
           </thead>
           <tbody>
             {rows.map((row) => (
               <tr key={row.id} onClick={() => { this.handleOpen(); this.getFirmwareDetails(row.version); }} style={{ cursor: 'pointer' }}>
                 <td>{row.version}</td>
                 <td>{row.firmwareName}</td>
                 <td>{row.addedDate}</td>
               </tr>
             ))}
           </tbody>
         </Table>

         <Modal
           open={this.state.open}
           onClose={this.handleClose}
           aria-labelledby="modal-modal-title"
           aria-describedby="modal-modal-description"
         >
           <Box sx={style}>
             <form className="post" onSubmit={this.handleSubmitUpdated}>
               <h3>Edit Firmware</h3>

               <div style={{ marginLeft: '-4%' }}>
                 <div className="form-group col-6">
                   <label>firmware Name</label>
                   <input
                     style={{ width: '18rem' }}
                     name="updated_firmware"
                     type="text"
                     value={this.state.updated_firmware}
                     onChange={this.handleChange}
                     className="form-control"
                   />
                 </div>

                 <div className="form-group col-6">
                   <label>Version</label>
                   <input
                     style={{ width: '18rem' }}
                     name="updated_version"
                     type="text"
                     value={this.state.updated_version}
                     onChange={this.handleChange}
                     className="form-control"
                   />
                 </div>

                 <div className="form-group col-6">
                   <label>Added Date</label>
                   <input
                     style={{ width: '18rem' }}
                     name="updated_addedDate"
                     type="int"
                     value={this.state.updated_addedDate}
                     onChange={this.handleChange}
                     className="form-control"
                   />
                 </div>
               </div>
               <input type="submit" value="Edit Firmware" className="btn btn-success" />
             </form>
           </Box>
         </Modal>
       </div>
     );
   }
}

export default Firmware;
