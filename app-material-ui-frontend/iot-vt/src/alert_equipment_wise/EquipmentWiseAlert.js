/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LoadingSpinner from '../components/loadingSpinner';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 4,
    padding: theme.spacing(1),
    paddingLeft: '15%',
    paddingTop: '0%',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '1%',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,

  },
  table: {
    width: 500,
  },

  dateInput: {
    width: 150,
  },

  timeInput: {
    width: 120,
  },

}));

const EquipmentWiseAlert = () => {
  const classes = useStyles();
  const [selectOptions, setSelectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlerts, setShowAlerts] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedAlert, setSelectedAlert] = useState({});
  const [updatedAlert, setUpdatedAlert] = useState({});
  const [deviceName, setDeviceName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const getOptions = async () => {
      try {
        const res = await axios.get('http://192.168.0.194:5005/api/1.0/devices');
        const options = res.data.map((d) => ({
          value: d.id,
          label: d.deviceName,
        }));
        setSelectOptions(options);
      } catch (error) {
        handleErrors(error);
      }
    };
    getOptions();
  }, []);

  const handleChangeDropdown = (selectedOption) => {
    setDeviceName(selectedOption.label);
    setSelectedAlert({ ...selectedAlert, deviceId: selectedOption.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const url = `http://192.168.0.194:5005/api/1.0/alerts/device/${selectedAlert.deviceId}?start=${startDate}T${startTime}:00Z&end=${startDate}T${endTime}:00Z`;
      setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setLoading(false);
          setShowAlerts(response.data);
          if (response.data.length === 0) {
            alert('No Alerts found for selected device in opted time bound');
          }
        })
        .catch((error) => {
          handleErrors(error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://192.168.0.194:5005/api/1.0/alerts/${id}`)
      .then(() => {
        setLoading(false);
        setShowAlerts(showAlerts.filter((alert) => alert.id !== id));
        alert('Alert deleted successfully');
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const handleSubmitUpdated = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`http://192.168.0.194:5005/api/1.0/alerts/${selectedAlert.id}`, updatedAlert)
      .then(() => {
        setLoading(false);
        alert('Alert updated successfully');
      })
      .catch((error) => {
        handleErrors(error);
      });
  };

  const handleErrors = (error) => {
    if (error.response) {
      setErrors({
        ...errors,
        message: error.response.data.message,
        status: error.response.status,
      });
    } else {
      setErrors({
        ...errors,
        message: 'Something went wrong. Please try again later.',
        status: '',
      });
    }
    setLoading(false);
  };

  const validate = () => {
    const errors = {};
    let isValid = true;

    if (startDate.trim() === '') {
      errors.startDate = 'Start Date is required';
      isValid = false;
    }

    if (startTime.trim() === '') {
      errors.startTime = 'Start Time is required';
      isValid = false;
    }

    if (endTime.trim() === '') {
      errors.endTime = 'End Time is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAlert((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdatedAlertChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAlert((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (row) => {
    setSelectedAlert(row);
    setUpdatedAlert(row);
  };

  return (
    <div className={classes.content} style={{ marginTop: '6%', marginRight: '20%' }}>
      <h4>Equipment Wise Alerts</h4>
      <br />

      <div>
        <form className="container" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <Select
              options={selectOptions}
              className={classes.textField}
              placeholder="Select Device"
              onChange={handleChangeDropdown}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '0.5rem' }}>
            <div className="form-group" style={{ width: '12.5rem' }}>
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                type="date"
                defaultValue=""
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate && (
              <div className="invalid-feedback">{errors.startDate}</div>
              )}
            </div>

            <div className="form-group" style={{ width: '12.5rem' }}>
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                name="startTime"
                className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                type="time"
                defaultValue=""
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              {errors.startTime && (
              <div className="invalid-feedback">{errors.startTime}</div>
              )}
            </div>

            <div className="form-group" style={{ width: '12.5rem' }}>
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                name="endTime"
                className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                type="time"
                defaultValue=""
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              {errors.endTime && (
              <div className="invalid-feedback">{errors.endTime}</div>
              )}
            </div>

            <button className="btn btn-primary" style={{ height: '2.5rem', marginTop: '1.7rem' }} type="submit">
              Show Alerts
            </button>
          </div>

        </form>

      </div>

      <br />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table" style={{ border: '1px solid #ccc' }}>
            <thead>
              <tr>
                <th>Sensor Name</th>
                <th>Processed Value</th>
                <th>Criticality</th>
                <th>Employee Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Timestamp</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {showAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.sensorName}</td>
                  <td>{alert.processedValue}</td>
                  <td>{alert.alertCriticality}</td>
                  <td>{alert.employeeName}</td>
                  <td>{alert.alertStatus}</td>
                  <td>{alert.alertDescription}</td>
                  <td>{alert.timestamp}</td>
                  <td>
                    <Button component={Link} to={`/alert_equipment_wise/EquipmentAlertEdit.js/${alert.id}`}>
                      <EditIcon />
                    </Button>
                  </td>
                  <td>
                    <Button type="submit" onClick={() => handleDelete(alert.id)}>
                      <DeleteIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}

    </div>
  );
};

export default EquipmentWiseAlert;
