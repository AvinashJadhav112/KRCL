/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const Configuration = () => {
  const [loading, setLoading] = useState(true);
  const [sensorReadingOne, setSensorReadingOne] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [firmwareList, setFirmwareList] = useState([]);
  const [firmwareDownload, setFirmwareDownload] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDevices();
    fetchFirmwareList();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://192.168.0.194:5005/api/1.0/dashboard/devices');
      const data = await response.json();
      setSensorReadingOne(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFirmwareList = async () => {
    try {
      const response = await axios.get('http://192.168.0.194:5005/api/v1/firmwares/getFirmwareDetails');
      const { data } = response;
      setFirmwareList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDropdownChange = async (e) => {
    const selectValue = e.target.value;
    try {
      const response = await axios.get(`http://192.168.0.194:5005/api/1.0/device/${selectValue}`);
      const { data } = response;
      setSelectedDevice(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleFirmwareDownloadChange = (e) => {
    const selectedFirmware = e.target.value;
    setFirmwareDownload(selectedFirmware);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const firmwareData = firmwareDownload.split(' ');
      const iotDeviceData = {
        serialNumber: selectedDevice.serialNumber,
        modelName: selectedDevice.modelName,
        status: selectedDevice.status,
        manufacturingDate: selectedDevice.manufacturingDate,
        deviceID: selectedDevice.id,
        deviceName: selectedDevice.deviceName,
        deviceFirmwareVersion: selectedDevice.deviceFirmwareVersion,
        timezone: selectedDevice.timezone,
        downloadStatus: selectedDevice.downloadStatus,
        firmwareId: firmwareData[0],
        serverFirmwareVersion: firmwareData[1],
        companyId: selectedDevice.companyId,
        companyName: selectedDevice.companyName,
        mheEquipmentName: 'Test Equipment',
      };

      axios.post(`http://192.168.0.194:5005/api/v1/firmwares/device/${selectedDevice.deviceName}`, iotDeviceData)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            alert('Firmware updated successfully. Please wait for the download to finish.');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const validate = () => {
    // eslint-disable-next-line no-shadow
    const errors = {};
    let isValid = true;

    if (!firmwareDownload) {
      errors.firmwareDownload = 'Please select Firmware';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Please enter password';
      isValid = false;
    } else if (password !== 'Cloud@123') {
      errors.password = 'Please enter correct password';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const renderTable = () => {
    if (selectedDevice) {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Device Firmware Version</th>
              <th>Server Firmware Version</th>
              <th>Configuration Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedDevice.deviceName}</td>
              <td>{selectedDevice.deviceFirmwareVersion}</td>
              <td>{selectedDevice.serverFirmwareVersion}</td>
              <td>{selectedDevice.downloadStatus}</td>
            </tr>
          </tbody>
        </Table>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: '8%', marginLeft: '5%' }}>
      <div>
        <h3>Configure request to assign firmware</h3>
      </div>

      <div>
        <form>
          <div className="form-group col-3" style={{ marginLeft: '-1%' }}>
            <label>Select Device</label>
            <select
              className="form-control"
              onChange={handleDropdownChange}
              onClick={fetchDevices}
            >
              <option value="">Select</option>
              {sensorReadingOne.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.deviceName}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        {renderTable()}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row col-3" style={{ marginBottom: '20px' }}>
          <label>Firmware Download</label>
          <select
            className="form-control"
            name="firmwareDownload"
            onClick={fetchFirmwareList}
            onChange={handleFirmwareDownloadChange}
          >
            <option value="">Select</option>
            {firmwareList.map((firmware) => (
              <option key={firmware.id} value={`${firmware.id} ${firmware.firmwareVersion}`}>
                {firmware.firmwareVersion}
              </option>
            ))}
          </select>
          <div className="text-danger">{errors.firmwareDownload}</div>
        </div>

        <div className="form-row col-3">
          <label>Server IP/UN/Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-danger">{errors.password}</div>
        </div>

        <div className="form-row" style={{ marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary ms-3">Apply</button>
          <button className="btn btn-secondary ms-4" type="reset">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Configuration;
