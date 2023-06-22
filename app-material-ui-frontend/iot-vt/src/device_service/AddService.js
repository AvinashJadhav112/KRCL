/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Select from 'react-select';

function AddService() {
  const [devicesList, setDevicesList] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [lastServiceFinding, setLastServiceFinding] = useState('');
  const [lastServiceActions, setLastServiceActions] = useState('');
  const [health, setHealth] = useState('');
  const [engineer, setEngineer] = useState('');
  const [value, setvalue] = useState({});

  useEffect(() => {
    getDevices();
  }, []);

  async function getDevices() {
    console.log('getDevices');
    try {
      const deviceResponse = await fetch(
        'http://192.168.0.194:5005/api/1.0/devices',
      );
      const serviceResponse = await fetch(
        'http://192.168.0.194:5005/api/1.0/servicing/',
      );
      const deviceList = await deviceResponse.json();
      const servicingList = await serviceResponse.json();
      console.log(deviceList);
      console.log(servicingList);
      let filteredArray = deviceList;
      servicingList.map((servicing) => {
        filteredArray = filteredArray.filter(
          (device) => servicing.deviceName !== device.deviceName,
        );
      });
      const deviceLabelArray = filteredArray.map((device) => {
        const deviceLabel = {
          label: device.deviceName,
          id: device.id,
        };
        return deviceLabel;
      });
      setDevicesList(deviceLabelArray);
      console.log(deviceLabelArray);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const data = {
        deviceName,
        lastServiceDate,
        nextServiceDate,
        lastServiceFinding,
        lastServiceActions,
        health,
        engineer,
      };
      fetch('http://192.168.0.194:5005/api/1.0/servicing/', {
        method: 'Post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((result) => {
        if (result.status === 201 || result.status === 200) {
          // eslint-disable-next-line no-alert
          alert('Service Data Added Successfully..');
          // history.push('/device_service/AddService.js');
        }
      });
    }
  }

  function validate() {
    const errors = {};
    let isValid = true;

    if (!deviceName) {
      isValid = false;
      errors.deviceName = 'Please enter device name';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(deviceName)) {
      isValid = false;
      errors.deviceName = 'field should be in correct format';
    }

    if (!lastServiceDate) {
      isValid = false;
      errors.lastServiceDate = 'Please enter last service date';
    }

    if (!nextServiceDate) {
      isValid = false;
      errors.nextServiceDate = 'Please enter next service date';
    }

    if (!lastServiceFinding) {
      isValid = false;
      errors.lastServiceFinding = 'Please enter last service finding';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(lastServiceFinding)) {
      isValid = false;
      errors.deviceName = 'field should be in correct format';
    }

    if (!lastServiceActions) {
      isValid = false;
      errors.lastServiceActions = 'Please enter last service actions';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(lastServiceActions)) {
      isValid = false;
      errors.deviceName = 'field should be in correct format';
    }

    if (!health) {
      isValid = false;
      errors.health = 'Please enter health';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(health)) {
      isValid = false;
      errors.deviceName = 'field should be in correct format';
    }

    if (!engineer) {
      isValid = false;
      errors.engineer = 'Please enter engineer';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(health)) {
      isValid = false;
      errors.engineer = 'field should be in correct format';
    }

    setvalue(errors);

    return isValid;
  }

  return (
    <div
      style={{
        border: '1px solid #80808038',
        borderRadius: '15px',
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5rem auto',
        padding: '15px',
      }}
    >
      <Typography variant="h4" align="center">
        Add Service
      </Typography>
      <form onSubmit={handleSubmit} className="w-100">
        <div className="form-group">
          <label htmlFor="deviceName">Device Name</label>
          <Select
            id="deviceName"
            onChange={(e) => {
              setDeviceName(e.label);
            }}
            options={devicesList}
          />
          <div className="text-danger">{value.deviceName}</div>
        </div>
        <div className="form-group">
          <label htmlFor="lastServiceDate">Last Service Date</label>
          <input
            id="lastServiceDate"
            name="last_Service_date"
            type="date"
            value={lastServiceDate}
            onChange={(e) => {
              setLastServiceDate(e.target.value);
            }}
            className="form-control"
          />
          <div className="text-danger">{value.lastServiceDate}</div>
        </div>
        <div className="form-group">
          <label htmlFor="nextServiceDate">Next Service Date</label>
          <input
            id="nextServiceDate"
            name="next_Service_date"
            type="date"
            value={nextServiceDate}
            onChange={(e) => {
              setNextServiceDate(e.target.value);
            }}
            className="form-control"
          />
          <div className="text-danger">{value.nextServiceDate}</div>
        </div>
        <div className="form-group">
          <label htmlFor="lastServiceFinding">Last Service Finding</label>
          <input
            id="lastServiceFinding"
            type="text"
            name="last_service_finding"
            value={lastServiceFinding}
            onChange={(e) => {
              setLastServiceFinding(e.target.value);
            }}
            className="form-control"
            placeholder="Last Service Finding"
          />
          <div className="text-danger">{value.lastServiceFinding}</div>
        </div>
        <div className="form-group">
          <label htmlFor="lastServiceActions">Last Service Actions</label>
          <input
            id="lastServiceActions"
            type="text"
            name="last_service_Actions"
            value={lastServiceActions}
            onChange={(e) => {
              setLastServiceActions(e.target.value);
            }}
            className="form-control"
            placeholder="Last Service Actions"
          />
          <div className="text-danger">{value.lastServiceActions}</div>
        </div>
        <div className="form-group">
          <label htmlFor="health">Health</label>
          <input
            id="health"
            type="text"
            name="Health"
            value={health}
            onChange={(e) => {
              setHealth(e.target.value);
            }}
            className="form-control"
            placeholder="Health"
          />
          <div className="text-danger">{value.health}</div>
        </div>
        <div className="form-group">
          <label htmlFor="engineer">Engineer</label>
          <input
            id="engineer"
            type="text"
            name="engineer"
            value={engineer}
            onChange={(e) => {
              setEngineer(e.target.value);
            }}
            className="form-control"
            placeholder="Engineer"
          />
          <div className="text-danger">{value.engineer}</div>
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" className="btn btn-primary" />
          <Link
            to="/device_service/Service.js"
            style={{ textDecoration: 'none' }}
          >
            <input
              type="reset"
              value="Cancel"
              className="btn btn-secondary"
              style={{ marginLeft: '2%' }}
            />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddService;
