/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-useless-escape */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable spaced-comment */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import CompanyAddForm from './companyAdd';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 420,
  },
  paper: {
    padding: theme.spacing(3),
    marginLeft: '1%',
    maxWidth: 940,
    paddingBottom: '5%',

  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '53ch',

    },
  },

}));

class Company extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: '', //json user field
      username: '',
      email: '',
      phone: '',
      companyname: '',
      website: '',

      updatedName: '',
      updatedUsername: '',
      updatedEmail: '',
      updatedPhone: '',
      updatedCompanyname: '',
      updatedWebsite: '',

      selected_name: '', // selected name
      selected_username: '',
      selected_email: '',
      selected_phone: '',
      selected_companyname: '',
      selected_website: '',
      selected_status: '',
      selected_companyAddedDate: '',

      id: [],
      companyDetails: [],
      userInfo: [],
      jsonName: '',

      User: [], // user which are linked with id's
      openDeleteDialog: false,
      errors: {},
      sameusers: [],
      posts: [],
      Name: [],
      value: '',
    };
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    this.getCompanyDetails();
  }

  handleDelete = (event) => {
    const urll = 'http://192.168.0.194:5005/api/1.0/company/';
    const response = axios.get(urll);
    const modeltodelete = this.state.selected_companyname;
    this.state.sameusers = this.state.Name.filter(() => this.state.selected_companyname);
    const confirmAction = confirm('Are you sure to Delete this Company?');
    if (confirmAction) {
      const nameToDelete = this.state.selected_companyname;
      event.preventDefault();
      axios.delete(`http://192.168.0.194:5005/api/1.0/company/deleteCompanyByName/${nameToDelete}`)

        .then((res) => {
          this.componentDidMount();

          this.state.selected_email = '';
          this.state.updatedEmail = '';

          this.state.selected_phone = '';
          this.state.updatedPhone = '';

          this.state.selected_companyname = '';
          this.state.updatedCompanyname = '';

          this.state.selected_website = '';
          this.state.updatedWebsite = '';

          alert('Company is Deleted!');
        });
    }
  };

 handleEditEvent=(val) => val

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleOpen = (e) => {
    this.setState({
      value: 'CompanyAddForm',
    });
  }

  handleErrors(error) {
    if (error.response && error.response.status === 404) {
      alert('user not found');
    }
  }

  getCompanyDetails = async () => {
    const url = 'http://192.168.0.194:5005/api/1.0/company/';
    const response = await axios.get(url);
    this.setState({ companyDetails: response.data, loading: false });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.EditUpdate();
    if (this.validate()) {
      const data = {
        companyName: this.state.updatedCompanyname,
        website: this.state.updatedWebsite,
        mobileNumber: this.state.updatedPhone,
        email: this.state.updatedEmail,
        companyStatus: this.state.selected_status,
        companyAddedDate: this.state.selected_companyAddedDate,
      };
      axios
        .put(`http://192.168.0.194:5005/api/1.0/company/updateCompanyByName/${this.state.selected_companyname}`, data)
        .then(
          (res) => {
            if (res.status === 200) {
              alert('data updated successfully..');
              this.getCompanyDetails();
            }

            this.state.selected_email = '';
            this.state.updatedEmail = '';

            this.state.selected_phone = '';
            this.state.updatedPhone = '';

            this.state.selected_companyname = '';
            this.state.updatedCompanyname = '';

            this.state.selected_website = '';
            this.state.updatedWebsite = '';
          },
          (error) => {
            this.handleErrors(error);
            return error;
          },
        )
        .catch((apiError) => {
          // console.log(apiError);
        });
    }
  };

  EditUpdate() {
    if (this.state.updatedEmail === '') {
      this.state.updatedEmail = this.state.selected_email;
    }
    if (this.state.updatedPhone === '') {
      this.state.updatedPhone = this.state.selected_phone;
    }

    if (this.state.updatedCompanyname === '') {
      this.state.updatedCompanyname = this.state.selected_companyname;
    }

    if (this.state.updatedWebsite === '') {
      this.state.updatedWebsite = this.state.selected_website;
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.updatedEmail) {
      isValid = false;
      errors.updatedEmail = 'Please enter Email-Id';
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(this.state.updatedEmail)) {
      isValid = false;
      errors.updatedEmail = 'Email Id should be in correct format';
    }

    if (!this.state.updatedPhone) {
      isValid = false;
      errors.updatedPhone = 'Please enter Phone No.';
    } else
    if (!/^[ 0-9 ]+$/i.test(this.state.updatedPhone)) {
      isValid = false;
      errors.updatedPhone = 'Phone no. should be number only';
    }

    if (!this.state.updatedCompanyname) {
      isValid = false;
      errors.updatedCompanyname = 'Please enter Company name.';
    } else
    if (!/^[ a-z A-Z 0-9 ]+$/i.test(this.state.updatedCompanyname)) {
      isValid = false;
      errors.updatedCompanyname = 'company name should be character only';
    }

    if (!this.state.updatedWebsite) {
      isValid = false;
      errors.updatedWebsite = 'Please enter Website.';
    } else
    // eslint-disable-next-line no-constant-condition
    if (!/^[ a-z A-Z 0-9 ]+$/) {
      isValid = false;
      errors.updatedWebsite = 'website should be in proper format';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const columns = [
      { field: 'companyName', headerName: 'Company Name', width: 250 },
      { field: 'email', headerName: 'Email_Id', width: 250 },
      { field: 'phone', headerName: 'Mobile Number', width: 200 },
      { field: 'website', headerName: 'Website', width: 200 },
      { field: 'companyStatus', headerName: 'Company Status', width: 220 },
      { field: 'companyAddedDate', headerName: 'Added Date', width: 130 },

      {
        field: 'editButton',
        headerName: 'Edit',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {

          };

          return (
            <Button onClick={onClick}>
              <Link to="#">
                <EditIcon />
              </Link>
            </Button>
          );
        },
      },
      {
        field: 'deleteButton',
        headerName: 'Delete',
        sortable: false,
        width: 100,
        renderCell: () => {
          const onClick = () => {
          };

          return (

            <Button type="submit" onClick={this.handleDelete}>
              {' '}
              <DeleteIcon />
              {' '}
            </Button>
          );
        },
      },
    ];

    const row = [];
    this.state.companyDetails.map((companyDetail) => {
      row.push(
        {
          id: companyDetail.id,
          companyName: companyDetail.companyName,
          email: companyDetail.email,
          phone: companyDetail.mobileNumber,
          website: companyDetail.website,
          companyStatus: companyDetail.companyStatus,
          companyAddedDate: companyDetail.companyAddedDate,
        },
      );
    });

    return (
      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography>
            <h3>Company</h3>
          </Typography>

          <div>

            <Link to="/um_company/companyAdd.js" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"
                value={CompanyAddForm}
                onClick={this.handleOpen}
              >
                Add New
              </Button>
            </Link>
          </div>
        </div>
        <div key={row.id} style={{ marginTop: '2%' }}>
          <div
            className="d-flex justify-content-start"
            style={{
              display: 'flex', height: 400,
            }}
          >
            <DataGrid
              checkboxSelection
              rows={row}
              onRowSelected={(newSelection) => {
                this.setState({
                  selected_name: newSelection.data.name,
                  id: newSelection.data.id,
                  selected_username: newSelection.data.username,
                  selected_email: newSelection.data.email,
                  selected_phone: newSelection.data.phone,
                  selected_website: newSelection.data.website,
                  selected_status: newSelection.data.companyStatus,
                  selected_companyname: newSelection.data.companyName,
                  selected_companyAddedDate: newSelection.data.companyAddedDate,
                });
              }}
              columns={columns}
              pageSize={6}
              icon
              SettingsApplicationsOutlinedIcon
            />
            <br />
          </div>
        </div>
        {(() => {
          if (this.state.selected_name === '') {
            return <h1> </h1>;
          } if (this.state.selected_username === '') {
            return <h1> </h1>;
          } if (this.state.selected_email === '') {
            return <h1> </h1>;
          } if (this.state.selected_phone === '') {
            return <h1> </h1>;
          } if (this.state.selected_companyname === '') {
            return <h1> </h1>;
          } if (this.state.selected_website === '') {
            return <h1> </h1>;
          }

          return (

            <div>

              <form onSubmit={this.handleSubmit} style={{ marginTop: '2%' }}>
                <div className="form-row" />

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Email-Id</label>
                    <input
                      name="selected_email"
                      type="text"
                      value={this.state.selected_email}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Email-id</label>
                    <input
                      name="updatedEmail"
                      type="text"
                      value={this.state.updatedEmail}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedEmail}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Phone No.</label>
                    <input
                      name="selected_phone"
                      type="text"
                      value={this.state.selected_phone}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Phone No.</label>
                    <input
                      name="updatedPhone"
                      type="text"
                      value={this.state.updatedPhone}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedPhone}</div>
                  </div>
                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Company Name</label>
                    <input
                      name="selected_companyname"
                      type="text"
                      value={this.state.selected_companyname}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Company Name</label>
                    <input
                      name="updatedCompanyname"
                      type="text"
                      value={this.state.updatedCompanyname}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedCompanyname}</div>
                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group col-4">
                    <label>Old Website</label>
                    <input
                      name="selected_website"
                      type="text"
                      value={this.state.selected_website}
                      onChange={this.handleChange}
                      className="form-control"
                      disabled
                    />

                  </div>

                  <div className="form-group col-4">
                    <label>Update Website</label>
                    <input
                      name="updatedWebsite"
                      type="text"
                      value={this.state.updatedWebsite}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <div className="text-danger">{this.state.errors.updatedWebsite}</div>
                  </div>

                </div>

                <input type="submit" value="Edit Company Details" className="btn btn-success" />
              </form>
            </div>
          );
        })()}

        <div>
          <div>

            {(() => {
              switch (this.state.value) {
                case 'CompanyAddForm':

                  return (

                    <CompanyAddForm />

                  );

                default:

                  return null;
              }
            })()}

          </div>

        </div>

      </div>

    );
  }
}

export default Company;
