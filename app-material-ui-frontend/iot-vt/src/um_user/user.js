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

export class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: [],
    };
  }

  componentDidMount() {
    this.getCompanyDetails();
  }

  getCompanyDetails = async () => {
    const url = 'http://192.168.0.194:5005/api/1.0/userDetails';
    const response = await axios.get(url);
    this.setState({ userDetails: response.data });
  };

  handleDelete = (email) => {
    const confirmAction = confirm('Are you sure to Delete this User?');
    if (confirmAction) {
      axios
        .delete(
          `http://192.168.0.194:5005/api/1.0/userDetails/${email}`,
        )

        .then(() => {
          alert('User is Deleted!');
          this.getCompanyDetails();
        });
    }
  };

  render() {
    const { history } = this.props;
    return (
      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '1%',
          }}
        >
          <Typography>
            <h3>User Details</h3>
          </Typography>

          <div>
            <Link
              to="/um_user/userAddnew.js"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="contained" color="primary">
                Add New
              </Button>
            </Link>
          </div>
        </div>
        <table
          style={{
            border: '1px solid transperent',
            boxShadow: '2px 7px 15px 5px #80808033',
            borderRadius: '10px',
            outline: 'none',
          }}
          className="table table-hover "
        >
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Company Name</th>
              <th scope="col">User Status</th>
              <th scope="col">User Added Date</th>
              <th>Edit</th>
              <th>Delete</th>
              {/* <th scope="col">Role</th> */}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {this.state.userDetails.map((data) => (
              <tr>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td>
                <td>{data.email}</td>
                <td>{data.mobileNumber}</td>
                <td>{data.companyName}</td>
                <td>{data.userStatus}</td>
                <td>{data.userAddedDate}</td>
                {/* <td>{data.role}</td> */}
                <td onClick={() => { history.push(`/um_user/EditUserData/${data.email}`); }}>
                  <EditIcon />
                </td>
                <td onClick={() => this.handleDelete(data.email)}>
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

export default User;
