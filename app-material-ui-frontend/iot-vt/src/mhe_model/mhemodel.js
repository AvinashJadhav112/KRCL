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

export class Mhemodel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modelDetails: [],
    };
  }

  componentDidMount() {
    this.getModelDetails();
  }

  getModelDetails = async () => {
    const url = 'http://192.168.0.194:5005/api/1.0/mheModel/';
    const response = await axios.get(url);
    this.setState({ modelDetails: response.data });
  };

  handleDelete = (mheModelName) => {
    const confirmAction = confirm('Are you sure to Delete this Model?');
    if (confirmAction) {
      axios
        .delete(
          `http://192.168.0.194:5005/api/1.0/mheModel/deleteMheModelByName/${mheModelName}`,
        )

        .then(() => {
          alert('Model is Deleted!');
          this.getModelDetails();
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
            <h3>Mhe Models</h3>
          </Typography>

          <div>
            <Link
              to="/mhe_model/MheModelAdd.js"
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
              <th>Serial NO.</th>
              <th>Mhe Model Name</th>
              <th>Madel Make</th>
              <th>Description</th>

              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {this.state.modelDetails.map((item) => (
              <tr>
                <td>{item.mheModelSerialNumber}</td>
                <td>{item.mheModelName}</td>
                <td>{item.mheModelMake}</td>
                <td>{item.mheModelDescription}</td>

                <td onClick={() => { history.push(`/mhe_model/mhemodeledit.js/${item.mheModelName}`); }}>

                  <EditIcon />

                </td>
                <td onClick={() => this.handleDelete(item.mheModelName)}>
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

export default Mhemodel;
