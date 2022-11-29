/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

class CompanyAddUserDataGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      companyUserInfo: [],
      id: [],
      deviceName: [],
      openDeleteDialog: false,
      selectUser: '',
      selectRole: '',

      selectOptions: [],
      errors: [],
    };
  }

  async componentDidMount() {
    const url = 'https://jsonplaceholder.typicode.com/users';
    const response = await axios.get(url);
    this.setState({ companyUserInfo: response.data, loading: false });
  }

    handleDelete = (event) => {
      const iotDeviceToDelete = this.state.deviceName;
      event.preventDefault();
      axios.delete('https://jsonplaceholder.typicode.com/users')
        .then((res) => {
          console.log(res);
          console.log(res.data);
        });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    handleError(error) {
      if (error.response && error.response.status === 409) {
        alert('There is already a sensor with same name');
      }
    }

    handleSubmit = (e) => {
      e.preventDefault();
      if (this.validate()) {
        const data = {
          selectUser: this.state.selectUser,
          selectRole: this.state.selectRole,
        };
        axios
          .post('https://jsonplaceholder.typicode.com/users', data)
          .then((res) => {
            console.log(res);
            console.log(res.data);
            if (res.status === 201) {
              alert('Data Added Successfully..');
            }
          },
          (error) => {
            this.handleError(error);
            return error;
          })
          .catch((apiError) => {
            console.log(apiError);
          });
      }
    };

    handleChangeDropdown = (e) => {
      this.setState({ iotModelName: e.label, id: e.value });
    }

    async getOptions() {
      const res = await axios.get('https://jsonplaceholder.typicode.com/users');
      const { data } = res;
      const options = data.map((d) => ({
        value: d.id,
        label: d.iotModelName,
      }));
      this.setState({ selectOptions: options });
    }

    validate() {
      const errors = {};
      let isValid = true;

      if (!this.state.selectUser) {
        isValid = false;
        errors.selectUser = 'Please select user name';
      }

      if (!this.state.selectRole) {
        isValid = false;
        errors.selectRole = 'Please select user role';
      }

      this.setState({
        errors,
      });

      return isValid;
    }

    render() {
      const selectUser = [
        'Prasad Shelake',
        'Elite Creane',
        'Avare',
      ];

      const selectRole = [
        'App Admin',
        'Cust Admin',
        'Cust User',
      ];
      const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'userName', headerName: 'User Name', width: 200 },
        { field: 'userRole', headerName: 'User Role', width: 200 },
        {
          field: 'deleteButton',
          headerName: 'Delete',
          sortable: false,
          width: 100,
          renderCell: () => {
            const onClick = () => {
            };

            return <Button type="submit" onClick={this.handleDelete}><DeleteIcon /></Button>;
          },
        },
      ];

      const row = [];
      this.state.companyUserInfo.map((it) => {
        row.push(
          {
            id: it.id,
            userName: it.username,
            userRole: it.company.bs,
          },
        );
      });

      console.log(row);

      return (
        <div>

          <div className="form-group col-4" />
          <div className="form-group col-4" />
          <div className="post">

            <form className="post" onSubmit={this.handleSubmit}>
              <div className="form-row">

                <div className="form-group col-4">
                  <label>Select User</label>
                  <select
                    name="selectUser"
                    onChange={this.handleChange}
                    className={`form-control
         ${this.state.errors.selectUser ? 'is-invalid' : ''}`}
                  >
                    <option value="" />
                    {selectUser.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <div className="text-danger">
                    {this.state.errors.selectUser}
                  </div>
                </div>

                <div className="form-group col-4">
                  <label>Select Role</label>
                  <select
                    name="selectRole"
                    onChange={this.handleChange}
                    className={`form-control
         ${this.state.errors.selectRole ? 'is-invalid' : ''}`}
                  >
                    <option value="" />
                    {selectRole.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <div className="text-danger">
                    {this.state.errors.selectRole}
                  </div>
                </div>

                <div className="form-group col-3" style={{ paddingLeft: '6%', paddingTop: '2%' }}>
                  <input type="submit" value="Add User" className="btn btn-primary" />
                </div>

              </div>

            </form>
          </div>

          <div key={row.id}>
            <div style={{
              height: 400, width: '90%', marginTop: '0%', marginLeft: '0%',
            }}
            >
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                icon
                SettingsApplicationsOutlinedIcon
                onRowSelected={(newSelection) => {
                  this.setState({ userName: newSelection.data.userName });
                  console.log('userRole: ', newSelection.data.userName);
                }}
                SelectionModelCheckbox={this.state.SelectionModelCheckbox}
              />
              <br />
            </div>
          </div>

        </div>
      );
    }
}

export default CompanyAddUserDataGrid;
