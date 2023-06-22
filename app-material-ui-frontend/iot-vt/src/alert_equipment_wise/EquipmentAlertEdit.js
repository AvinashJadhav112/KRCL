/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

function EquipmentAlertEdit() {
  const { id } = useParams();
  const [alertDescription, setAlertDescription] = useState('');
  const [alertStatus, setAlertStatus] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [alertDescriptionError, setAlertDescriptionError] = useState('');
  const [alertStatusError, setAlertStatusError] = useState('');
  const [employeeNameError, setEmployeeNameError] = useState('');

  const [sensorId, setSensorId] = useState('');
  const [sensorName, setSensorName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [processedValue, setProcessedValue] = useState('');
  const [alertCriticality, setAlertCriticality] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    getInfo();
  }, []);

  async function getInfo() {
    const response = await axios.get(`http://192.168.0.194:5005/api/1.0/alerts/${id}`);
    const json = response.data;
    setSensorId(json.sensorId);
    setSensorName(json.sensorName);
    setDeviceId(json.deviceId);
    setTimestamp(json.timestamp);
    setProcessedValue(json.processedValue);
    setAlertCriticality(json.alertCriticality);
    setInfo(json);
    setAlertDescription(json.alertDescription);
    setAlertStatus(json.alertStatus);
    setEmployeeName(json.employeeName);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Reset previous error messages
    setAlertDescriptionError('');
    setAlertStatusError('');
    setEmployeeNameError('');

    // Validate form inputs
    let isValid = true;
    if (!alertDescription) {
      setAlertDescriptionError('Please enter the alert description');
      isValid = false;
    }
    if (!alertStatus) {
      setAlertStatusError('Please enter the alert status');
      isValid = false;
    }
    if (!employeeName) {
      setEmployeeNameError('Please enter the employee name');
      isValid = false;
    }

    if (isValid) {
      const data = {
        alertDescription,
        alertStatus,
        employeeName,
        sensorId,
        sensorName,
        deviceId,
        timestamp,
        processedValue,
        alertCriticality,
      };

      axios
        .put(`http://192.168.0.194:5005/api/1.0/alerts/${id}`, data)
        .then(() => {
          alert('Alert updated successfully');
        })
        .catch((error) => {
          // handleErrors(error);
        });
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="border p-4" style={{ width: '35%' }}>
        <div className="text-center mb-4">
          <Typography variant="h4">Edit Alert</Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="alertDescription">Alert Description</label>
            <input
              id="alertDescription"
              name="alertDescription"
              type="text"
              value={alertDescription}
              onChange={(e) => setAlertDescription(e.target.value)}
              className="form-control"
              required
            />
            {alertDescriptionError && <div className="text-danger">{alertDescriptionError}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="alertStatus">Alert Status</label>
            <input
              id="alertStatus"
              name="alertStatus"
              type="text"
              value={alertStatus}
              onChange={(e) => setAlertStatus(e.target.value)}
              className="form-control"
              required
            />
            {alertStatusError && <div className="text-danger">{alertStatusError}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="employeeName">Employee Name</label>
            <input
              id="employeeName"
              name="employeeName"
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="form-control"
              required
            />
            {employeeNameError && <div className="text-danger">{employeeNameError}</div>}
          </div>
          <div className="form-group">
            <input type="submit" value="Submit" className="btn btn-primary" />
            <Link to="/alert_equipment_wise/EquipmentWiseAlert.js" className="btn btn-secondary ml-2" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipmentAlertEdit;
