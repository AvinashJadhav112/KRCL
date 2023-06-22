/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

function Service() {
  const [data, setData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axios.get('http://192.168.0.194:5005/api/1.0/servicing/')
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
  }
  const handleDelete = (id) => {
    const confirmAction = confirm('Are you sure to Delete this service datail?');
    if (confirmAction) {
      const url = `http://192.168.0.194:5005/api/1.0/servicing/deleteServicingDetailById/${id}`;
      axios.delete(url)
        .then((response) => {
          console.log(response);
          getData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <div style={{ marginTop: '6%', marginLeft: '5%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>

        <Typography variant="h4" noWrap component="div">
          Device Servicing
        </Typography>
        <div>

          <Link to="/device_service/AddService.js" style={{ textDecoration: 'none' }}>
            <Button
              className="mhemodel"
              variant="contained"
              color="primary"
              button
            >

              Add Service

            </Button>
          </Link>
        </div>
      </div>
      <table className="table border-1 " style={{ border: '1px solid #80808038' }}>
        <thead>
          <tr>
            <th>Device Name</th>
            <th>Last Service Actions</th>
            <th>Last Service Finding</th>
            <th>Last servicing Date</th>
            <th>Next servicing Date</th>
            <th>Engineer</th>
            <th>Health</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.deviceName}</td>
              <td>{item.lastServiceActions}</td>
              <td>{item.lastServiceFinding}</td>
              <td>{item.lastServiceDate}</td>
              <td>{item.nextServiceDate}</td>
              <td>{item.engineer}</td>
              <td>{item.health}</td>
              <td onClick={() => { history.push(`/device_service/deviceServiceEdit.js/${item.deviceName}`); }}>

                <EditIcon />

              </td>
              <td onClick={() => handleDelete(item.id)}>

                <DeleteIcon />

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Service;
