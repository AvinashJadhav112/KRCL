/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyDetails: [],
    };
  }

  componentDidMount() {
    this.getCompanyDetails();
  }

   getCompanyDetails = async () => {
     const url = 'http://192.168.0.194:5005/api/1.0/company/';
     const response = await axios.get(url);
     this.setState({ companyDetails: response.data });
   }

  handleDelete = (id) => {
    const confirmAction = confirm('Are you sure to Delete this Company?');
    if (confirmAction) {
      axios.delete(`http://192.168.0.194:5005/api/1.0/company/deleteCompanyById/${id}`)

        .then(() => {
          alert('Company is Deleted!');
          this.getCompanyDetails();
        });
    }
  };

  render() {
    const { history } = this.props;
    return (
      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '1%',
        }}
        >
          <Typography>
            <h3>Company</h3>
          </Typography>

          <div>

            <Link to="/um_company/companyAdd.js" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"

              >
                Add New
              </Button>
            </Link>
          </div>
        </div>
        <table
          style={{
            border: '1px solid transperent', boxShadow: '2px 7px 15px 5px #80808033', borderRadius: '10px', outline: 'none',
          }}
          className="table table-hover "
        >
          <thead>
            <tr>
              <th scope="col">Company Name</th>
              <th scope="col">Email_Id</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Website</th>
              <th scope="col">Company Status</th>
              <th scope="col">Added Date</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">

            {this.state.companyDetails.map((data) => (
              <tr>
                <td>{data.companyName}</td>
                <td>{data.email}</td>
                <td>{data.mobileNumber}</td>
                <td>{data.website}</td>
                <td>{data.companyStatus}</td>
                <td>{data.companyAddedDate}</td>
                <td onClick={() => { history.push(`/um_company/EditCompanyData/${data.id}`); }}><EditIcon /></td>
                <td onClick={() => this.handleDelete(data.id)}><DeleteIcon /></td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
