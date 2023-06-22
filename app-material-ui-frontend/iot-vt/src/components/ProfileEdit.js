/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/react-in-jsx-scope */
import { useParams, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileEdit = () => {
  const { email } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [userStatus, setUserStatus] = useState();
  const [id, setId] = useState();
  const [isDeleted, setIsDeleted] = useState(false);
  const [role, setRole] = useState();
  const [userAddedDate, setUserAddedDate] = useState();
  const [companyName, setCompanyName] = useState();
  const [error, setError] = useState({});

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    const data = await fetch(
      `http://192.168.0.194:5005/api/1.0/userDetails/${email}`,
    );
    const json = await data.json();
    setFirstName(json.firstName);
    setLastName(json.lastName);
    setMobileNumber(json.mobileNumber);
    setUserStatus(json.userStatus);
    setUserInfo(json);
    setId(json.id);
    setIsDeleted(json.isDeleted);
    setRole('Admin');
    setUserAddedDate(json.userAddedDate);
    setCompanyName(json.companyName);
  }

  function validate() {
    const errors = {};
    let isValid = true;

    if (!firstName) {
      isValid = false;
      errors.firstName = 'Please enter first name';
    } else if (!/^[ a-z A-Z 0-9 ]+$/i.test(firstName)) {
      isValid = false;
      errors.firstName = 'User name should be character only';
    }

    if (!lastName) {
      isValid = false;
      errors.lastName = 'Please enter last name';
    } else if (!/^[ a-z A-Z 0-9 ]+$/i.test(lastName)) {
      isValid = false;
      errors.lastName = 'Last name should be character only';
    }

    if (!mobileNumber) {
      isValid = false;
      errors.mobileNumber = 'Please enter Phone No.';
    } else if (!/^[ 0-9 ]+$/i.test(mobileNumber)) {
      isValid = false;
      errors.mobileNumber = 'Phone no. should be number only';
    }

    if (!userStatus) {
      isValid = false;
      errors.userStatus = 'Please enter user status';
    }

    setError(errors);
    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const data = {
        firstName,
        lastName,
        mobileNumber,
        userStatus,
        id,
        role,
        isDeleted,
        userAddedDate,
        email,
        companyName,
      };
      axios
        .put(`http://192.168.0.194:5005/api/1.0/userDetails/${email}`, data)
        .then((result) => {
          if (result.status === 201 || result.status === 200) {
            // eslint-disable-next-line no-alert

            alert('User Data Updated Successfully..');
            window.history.go(-1);
          }
        });
    }
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div>
      <div
        style={{
          border: '1px solid grey',
          width: '40%',
          padding: '2% 0 2% 5%',
          borderRadius: '15px',
          margin: '8% 0 0 20%',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ margin: '2% -9% 0 0', width: '198%' }}
        >
          <div className="form-row" />
          <Typography>
            <h3>Edit User</h3>
          </Typography>

          <div className="form-row">
            <div className="form-group col-5">
              <label>First Name</label>
              <input
                name="updatedFirstname"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                className="form-control"
              />
              <div className="text-danger">{error.firstName}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-5">
              <label>Last Name</label>
              <input
                name="updatedLastname"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className="form-control"
              />
              <div className="text-danger">{error.lastName}</div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-5">
              <label>Mobile No.</label>
              <input
                name="updatedMobilenumber"
                type="text"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                }}
                className="form-control"
              />
              <div className="text-danger">{error.mobileNumber}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-5">
              <label>Status</label>
              <input
                name="updatedUserstatus"
                type="text"
                value={userStatus}
                onChange={(e) => {
                  setUserStatus(e.target.value);
                }}
                className="form-control"
              />
              <div className="text-danger">{error.userStatus}</div>
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <input
              type="submit"
              value="Edit User Details"
              className="btn btn-success"
            />
            <Link
              to="/components/Profile.js"
              style={{ textDecoration: 'none' }}
            >
              <input
                type="reset"
                value="Cancel"
                className="btn btn-secondary"
                style={{ marginLeft: '12%' }}
              />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
