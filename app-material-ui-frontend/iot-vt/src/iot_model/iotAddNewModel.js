/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-no-bind */

/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';

// React Notification
// import { NotificationManager } from 'react-notifications';
// import Dashboard from '../components/dashboard';

class IotAddNewModel extends React.Component {
  constructor(props) {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      iotModelName: '',
      errors: {},
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a model with same name..');
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validate()) {
      const modelName = {
        iotModelName: this.state.iotModelName,
      };

      // console.log(modelName);

      axios
        .post('http://192.168.0.194:5005/api/1.0/iotModels', modelName)
        .then((res) => {
          // console.log(res);
          // console.log(res.data);
          // NotificationManager.success('You have added a new book!', 'Successful!', 2000);
          if (res.status === 201) {
            alert('Data Added Successfully..');
            window.location.reload();
            this.props.closeModal(false);
          }
        },
        (error) => {
          this.handleError(error);
          return error;
        })
        .catch((apiError) => {
          // console.log(apiError);
        });
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.iotModelName) {
      isValid = false;
      errors.iotModelName = 'Please enter your Model Name.';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(this.state.iotModelName)) {
      isValid = false;
      errors.iotModelName = 'Model name should be character only';
    }
    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    return (

      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        <div>

          <h3>Add New Model</h3>

        </div>

        <form onSubmit={this.handleSubmit}>
          <div className="form-row">

            <div className="form-group" style={{ width: '83%' }}>
              <label>Model Name</label>
              <input
                name="iotModelName"
                type="text"
                value={this.state.iotModelName}
                onChange={this.handleChange}
                className="form-control"
                id="title"
              />

              <div className="text-danger">{this.state.errors.iotModelName}</div>
            </div>

          </div>
          <input id="add-model" type="submit" value="Add Model" className="btn btn-success" />

        </form>
      </div>

    );
  }
}
export default IotAddNewModel;
