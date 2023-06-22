/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export class MheEquipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equipmentDetails: [],
    };
  }

  componentDidMount() {
    this.getEquipmentDetails();
  }

  getEquipmentDetails = async () => {
    const url = 'http://192.168.0.194:5005/api/1.0/mheEquipment/';
    const response = await axios.get(url);
    this.setState({ equipmentDetails: response.data });
  };

   handleDelete = (id) => {
     const confirmAction = confirm('Are you sure to Delete this Equipment?');
     if (confirmAction) {
       const url = `http://192.168.0.194:5005/api/1.0/mheEquipment/deleteMheEquipmentById/${id}`;
       axios.delete(url)
         .then((response) => {
           console.log(response);
           alert('Equipment is Deleted!');
           this.getEquipmentDetails();
         })
         .catch((error) => {
           console.log(error);
         });
     }
   };

   render() {
     const { history } = this.props;
     return (
       <div style={{ marginTop: '6%', marginLeft: '5%' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>

           <Typography variant="h4" noWrap component="div">
             Mhe Equipment
           </Typography>
           <div>

             <Link to="/mhe_equipment/mheEquipmentAddNew.js" style={{ textDecoration: 'none' }}>
               <Button
                 className="mhemodel"
                 variant="contained"
                 color="primary"
                 button
               >

                 Add Equipment

               </Button>
             </Link>
           </div>
         </div>
         <table className="table border-1 " style={{ border: '1px solid #80808038' }}>
           <thead>
             <tr>
               <th>Mhe Equipment Name</th>
               <th>Serial Number</th>
               <th>Activity status</th>
               <th>Model Name</th>
               <th>Edit</th>
               <th>Delete</th>
             </tr>
           </thead>
           <tbody className="table-group-divider">
             {this.state.equipmentDetails.map((item) => (
               <tr key={item.id}>
                 <td>{item.mheEquipmentName}</td>
                 <td>{item.mheEquipmentSerialNumber}</td>
                 <td>{item.mheActivityStatus}</td>
                 <td>{item.mheModelName}</td>

                 <td onClick={() => { history.push(`/mhe_equipment/mheEquipmentEdit.js/${item.mheEquipmentName}`); }}>

                   <EditIcon />

                   {/* <button className="btn btn-primary ml-2" onClick={() => handleEdit(item.id)}>Edit</button> */}
                 </td>
                 <td onClick={() => this.handleDelete(item.id)}>
                   <DeleteIcon />
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }
}

export default MheEquipment;
