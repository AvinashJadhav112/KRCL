/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class IotAddNewModel extends React.Component {
  constructor() {
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

      axios
        .post('http://192.168.0.194:5005/api/1.0/iotModels', modelName)
        .then((res) => {
          if (res.status === 201) {
            alert('Data Added Successfully..');
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
      <main style={{
        flexGrow: 4,
        paddingLeft: '2%',
        paddingTop: '5%',
        paddingRight: '2%',
      }}
      >
        <div style={{ marginTop: '2%' }}>

          <form onSubmit={this.handleSubmit}>
            <div className="form-row">

              <div className="form-group col-4">
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
            <Link to="/iot_model/iotModel.js" style={{ textDecoration: 'none' }}>
              <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '2%' }} />
            </Link>
          </form>
        </div>
      </main>
    );
  }
}
export default IotAddNewModel;
