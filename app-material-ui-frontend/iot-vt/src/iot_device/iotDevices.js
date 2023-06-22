/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable comma-dangle */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';

const IotDevices = (props) => {
  const [deviceDetails, setDeviceDetails] = useState([]);
  const history = useHistory();
  const getDeviceDetails = async () => {
    try {
      const url = 'http://192.168.0.194:5005/api/1.0/devices';
      const response = await axios.get(url);
      setDeviceDetails(response.data);
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  useEffect(() => {
    getDeviceDetails();
  }, []);

  const handleDelete = async (deviceName) => {
    const confirmAction = window.confirm('Are you sure to delete this device?');
    if (confirmAction) {
      try {
        await axios.delete(
          `http://192.168.0.194:5005/api/1.0/devices/${deviceName}`
        );
        alert('Device is deleted!');
        getDeviceDetails();
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  return (
    <div style={{ marginTop: '8%', marginLeft: '5%', maxWidth: '88%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '1%',
        }}
      >
        <Typography>
          <h3>Device Details</h3>
        </Typography>

        <div>
          <Link to="/iot_device/deviceAddNew.js" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Add New
            </Button>
          </Link>
        </div>
      </div>
      <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            border: '1px solid #ccc',
          }}
          className="table table-hover"
        >
          <thead>
            <tr>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Company Name</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Device Name</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Device Serial Number</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Manufacturing Date</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Model Name</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Status</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Server Firmware Version</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Device Firmware Version</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>MHE Equipment Name</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Edit</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {deviceDetails.map((data) => (
              <tr key={data.deviceName}>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.companyName}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.deviceName}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.serialNumber}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.manufacturingDate}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.modelName}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.status}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.serverFirmwareVersion}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.deviceFirmwareVersion}
                </td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                  {data.mheEquipmentName}
                </td>
                <td onClick={() => { history.push(`/iot_device/EditDeviceData/${data.id}`); }}>
                  <EditIcon />

                </td>
                <td onClick={() => handleDelete(data.deviceName)}>
                  <DeleteIcon />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IotDevices;
