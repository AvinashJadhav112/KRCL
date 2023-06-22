/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { withRouter } from 'react-router-dom';
import IotModelDataGrid from './iotModelDataGrid';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid transperent',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
};

export class IotModelTable extends Component {
  constructor() {
    super();

    this.state = {
      iotModels: [],
      open: false,
      model_name: '',
      Model: [],
      samedevices: [],
      model_id: '',
    };
  }

  async componentDidMount() {
    const response = await axios.get('http://192.168.0.194:5005/api/1.0/iotModels');
    this.setState({ iotModels: response.data });

    const urll = 'http://192.168.0.194:5005/api/1.0/devices';
    const res = await axios.get(urll);

    this.state.Model = res.data.map((u) => (
      u.iotModel.iotModelName
    ));
  }

   handleOpen = (name, id) => {
     this.setState({ open: true });
     this.setState({ model_name: name });
     this.setState({ model_id: id });
   }

   handleClose = () => this.setState({ open: false });

   handleDelete = async (model) => {
     this.state.samedevices = this.state.Model.filter(() => model);

     const confirmAction = confirm('Are you sure to Delete this Iotmodel?');
     if (confirmAction) {
       // eslint-disable-next-line eqeqeq
       if (this.state.samedevices.includes(model) == true) {
         alert('This IOT Model is linked with IOT device! Please delete respected device first');
       } else {
         const iotModelToDelete = model;

         await axios.delete(`http://192.168.0.194:5005/api/1.0/iotModels/${iotModelToDelete}`)

           .then((res) => {
             // console.log(res);
             // console.log(res.data);
             this.componentDidMount();
             this.state.model_name = '';
             this.state.updatedIotModelName = '';
             alert('The Model is Deleted!');
           });
       }
     } else {
       console.log('You are click on cancel ');
     }
   };

   render() {
     return (
       <div style={{ maxHeight: '520px', overflowY: 'auto', border: '1px solid #ccc' }}>
         <table
           style={{
             border: '1px solid #ccc', boxShadow: '2px 7px 15px 5px #80808033', borderRadius: '10px', outline: 'none',
           }}
           className="table table-hover "
         >
           <thead>
             <tr>
               <th scope="col">Model Name</th>
               <th scope="col">Edit</th>
               <th scope="col">Delete</th>

             </tr>
           </thead>
           <tbody className="table-group-divider">

             {this.state.iotModels.map((data, id) => (

               <tr>
                 <td onClick={() => this.props.history.push(`/iot_model/iotSensorTable/${data.id}`)}>{data.iotModelName}</td>
                 <td onClick={() => this.handleOpen(data.iotModelName, data.id)}><EditIcon /></td>
                 <td onClick={() => this.handleDelete(data.iotModelName)}><DeleteIcon /></td>
               </tr>
             ))}
           </tbody>
         </table>

         <div>
           <Modal
             open={this.state.open}
             onClose={this.handleClose}
           >
             <Box sx={style}>

               <IotModelDataGrid name={this.state.model_name} id={this.state.model_id} />
             </Box>
           </Modal>
         </div>

       </div>
     );
   }
}

export default withRouter(IotModelTable);
