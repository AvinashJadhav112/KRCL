/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

function deviceServiceEdit() {
  const { deviceName } = useParams();
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [lastServiceFinding, setLastServiceFinding] = useState('');
  const [lastServiceActions, setLastServiceActions] = useState('');
  const [health, setHealth] = useState('');
  const [engineer, setEngineer] = useState('');
  const [value, setvalue] = useState({});

  async function getData() {
    const response = await fetch(`http://192.168.0.194:5005/api/1.0/servicing/getServicingDetailsByDeviceName/${deviceName}`);
    const json = await response.json();
    setLastServiceDate(json.lastServiceDate);
    setNextServiceDate(json.nextServiceDate);
    setLastServiceFinding(json.lastServiceFinding);
    setLastServiceActions(json.lastServiceActions);
    setHealth(json.health);
    setEngineer(json.engineer);
  }

  useEffect(() => {
    getData();
  }, []);

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
      axios
        .put(
          `http://192.168.0.194:5005/api/1.0/servicing/updateServicingDetailsByDeviceName/${deviceName}`,
          data,
        )
        .then((result) => {
          if (result.status === 201 || result.status === 200) {
            // eslint-disable-next-line no-alert
            alert('Service Data Updated Successfully..');
          }
        });
    }
  }

  function validate() {
    const errors = {};
    let isValid = true;

    if (!lastServiceDate) {
      isValid = false;
      errors.lastServiceDate = 'Please enter the last service date';
    }

    if (!nextServiceDate) {
      isValid = false;
      errors.nextServiceDate = 'Please enter the next service date';
    }

    if (!lastServiceFinding) {
      isValid = false;
      errors.lastServiceFinding = 'Please enter the last service finding';
    } else if (!/^[a-z A-Z 0-9]+$/i.test(lastServiceFinding)) {
      isValid = false;
      errors.deviceName = 'Field should be in the correct format';
    }

    if (!lastServiceActions) {
      isValid = false;
      errors.lastServiceActions = 'Please enter the last service actions';
    } else if (!/^[a-z A-Z 0-9]+$/i.test(lastServiceActions)) {
      isValid = false;
      errors.deviceName = 'Field should be in the correct format';
    }

    if (!health) {
      isValid = false;
      errors.health = 'Please enter the health';
    } else if (!/^[a-z A-Z 0-9]+$/i.test(health)) {
      isValid = false;
      errors.deviceName = 'Field should be in the correct format';
    }

    if (!engineer) {
      isValid = false;
      errors.engineer = 'Please enter the engineer';
    } else if (!/^[a-z A-Z 0-9]+$/i.test(health)) {
      isValid = false;
      errors.engineer = 'Field should be in the correct format';
    }

    setvalue(errors);

    return isValid;
  }

  return (
    <div style={{
      marginTop: '100px',
      border: '1px solid #80808038',
      borderRadius: '15px',
      width: '35%',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '15px',
    }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '10px',
      }}
      >
        <Typography variant="h4">Edit Service</Typography>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Last Service Date</label>
          <input
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
          <label>Next Service Date</label>
          <input
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
          <label htmlFor="formGroupExampleInput">Last Service Finding</label>
          <input
            type="text"
            name="last_service_finding"
            value={lastServiceFinding}
            onChange={(e) => {
              setLastServiceFinding(e.target.value);
            }}
            className="form-control"
            id="formGroupExampleInput"
            placeholder="Last Service Finding"
          />
          <div className="text-danger">{value.lastServiceFinding}</div>
        </div>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput">Last Service Actions</label>
          <input
            type="text"
            name="last_service_Actions"
            value={lastServiceActions}
            onChange={(e) => {
              setLastServiceActions(e.target.value);
            }}
            className="form-control"
            id="formGroupExampleInput"
            placeholder="Last Service Actions"
          />
          <div className="text-danger">{value.lastServiceActions}</div>
        </div>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput">Health</label>
          <input
            type="text"
            name="Health"
            value={health}
            onChange={(e) => {
              setHealth(e.target.value);
            }}
            className="form-control"
            id="formGroupExampleInput"
            placeholder="Health"
          />
          <div className="text-danger">{value.health}</div>
        </div>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput">Engineer</label>
          <input
            type="text"
            name="engineer"
            value={engineer}
            onChange={(e) => {
              setEngineer(e.target.value);
            }}
            className="form-control"
            id="formGroupExampleInput"
            placeholder="Engineer"
          />
          <div className="text-danger">{value.engineer}</div>
        </div>
        <div className="form-group" style={{ display: 'flex' }}>
          <input type="submit" value="Submit" className="btn btn-primary" />
          <Link to="/device_service/Service.js" style={{ textDecoration: 'none' }}>
            <input
              type="reset"
              value="Cancel"
              className="btn btn-secondary ml-2"
              // style={{ marginLeft: '2%' }}
            />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default deviceServiceEdit;
