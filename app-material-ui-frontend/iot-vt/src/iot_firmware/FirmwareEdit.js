/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/button-has-type */

/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable no-unused-vars */
// import ResponsiveDrawer from './components/drawer.js';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

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
      width: '54ch',
      paddingBottom: '2%',
    },
  },
  root2: {
    '& > *': {
      margin: theme.spacing(1),
      width: '40ch',
      paddingBottom: '2%',
      margiLeft: '20%',
    },
  },

  FormControlLabel:
  {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '50%',
    paddingTop: '0%',

  },

}));

class FirmwareEdit extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      loading: true,
      version: '',
      firmwareName: '',
      status: '',
      statuschangedon: '',
      addeddate: '',
      errors: [],
      firmwareApp1: '',
      firmwareApp2: '',

    };
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a model with same name..');
    }
  }

 handleChange = (e) => {
   this.setState({
     [e.target.name]: e.target.value,
   });
 }

 handleSubmit(e) {
   e.preventDefault();
   if (this.validate()) {
     const data = {
       firmwareName: this.state.firmwareName,
       version: this.state.version,
       firmwareApp1: this.state.firmwareApp1,
       firmwareApp2: this.state.firmwareApp2,
     };

     console.log(data);
     {
       // display form data on success
       alert('Firmware Download Successfully');
     }
   }
 }

 validate() {
   const errors = {};
   let isValid = true;

   if (!this.state.firmwareName) {
     isValid = false;
     errors.firmwareName = 'Please enter Firmware';
   }

   if (!this.state.version) {
     isValid = false;
     errors.version = 'Please enter version';
   }

   if (!this.state.firmwareApp1) {
     isValid = false;
     errors.firmwareApp1 = 'Please upload 1st firmware file';
   }

   if (!this.state.firmwareApp2) {
     isValid = false;
     errors.firmwareApp2 = 'Please Upload 2nd firmware file';
   }

   this.setState({
     errors,
   });

   return isValid;
 }

 render() {
   return (
     <div style={{ flexGrow: 4, paddingLeft: '20%', paddingTop: '0%' }}>

       <div style={{ paddingBottom: '0%', marginTop: '7%' }}>
         <Typography variant="h4" noWrap component="div">
           Firmware/Edit Firmware
         </Typography>
       </div>

       <form className="post" onSubmit={this.handleSubmit}>
         <div className="form-row">

           <div className="form-group col-4">
             <label>Firmware Name</label>
             <input
               name="firmwareName"
               type="text"
               onChange={this.handleChange}
               className="form-control"
             />
             <div className="text-danger">
               {this.state.errors.firmwareName}
             </div>

           </div>

           <div className="form-group col-4">
             <label>Version</label>
             <input
               name="version"
               type="number"
               onChange={this.handleChange}
               className="form-control"
             />
             <div className="text-danger">
               {this.state.errors.version}
             </div>
           </div>
         </div>

         <div className="form-group col-5">
           <label>Firmware 1</label>
           <input
             name="firmwareApp1"
             type="file"
             onChange={this.handleChange}
             className="form-control"
           />
           <div className="text-danger">{this.state.errors.firmwareApp1}</div>
         </div>

         <div className="form-group col-5">
           <label>Firmware </label>
           <input
             name="firmwareApp2"
             type="file"
             onChange={this.handleChange}
             className="form-control"
           />
           <div className="text-danger">{this.state.errors.firmwareApp2}</div>
         </div>

         <div className="form-group col-5">
           <button type="submit" className="btn btn-primary mr-2">Submit</button>
           <Link to="Firmware.js">
             <button className="btn btn-secondary">Cancel</button>
           </Link>
         </div>

       </form>
     </div>

   );
 }
}

export default FirmwareEdit;
