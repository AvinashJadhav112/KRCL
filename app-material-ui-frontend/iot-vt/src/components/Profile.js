/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    const val = window.localStorage.getItem('email');
    const data = await fetch(
      `http://192.168.0.194:5005/api/1.0/userDetails/${val}`,
    );
    const json = await data.json();
    setUserInfo(json);
  }

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    color: '#343a40',
    marginBottom: '30px',
  };

  const labelStyle = {
    color: '#343a40',
    fontWeight: 'bold',
    marginBottom: '5px',
  };

  const inputStyle = {
    backgroundColor: '#f1f3f5',
    color: '#343a40',
    borderColor: 'transparent',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: 'none',
    marginBottom: '15px',
  };

  const editButtonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
    borderRadius: '5px',
    padding: '8px 15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  return (
    <div style={{ marginTop: '100px', marginLeft: '50px' }}>
      <div className="container mt-4" style={containerStyle}>
        <h1 className="text-center" style={headingStyle}>
          Profile Page
        </h1>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.firstName}
                readOnly
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.lastName}
                readOnly
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                className="form-control"
                value={userInfo.email}
                readOnly
                style={inputStyle}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label style={labelStyle}>Company Name</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.companyName}
                readOnly
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>User Status</label>
              <input
                type="text"
                className="form-control"
                value={userInfo.userStatus}
                readOnly
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                value={userInfo.mobileNumber}
                readOnly
                style={inputStyle}
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link to={`/components/ProfileEdit/${userInfo.email}`}>
            <button className="btn btn-primary" style={editButtonStyle}>
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
