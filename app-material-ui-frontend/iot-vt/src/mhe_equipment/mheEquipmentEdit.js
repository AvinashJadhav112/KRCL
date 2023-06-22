/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import { useParams, Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
// import Select from 'react-select';

function MheEquipmentEdit() {
  const history = useHistory();
  const { mheEquipmentName } = useParams();
  const [mheModelName, setMheModelName] = useState('');
  const [mheEquipment, setMheEquipment] = useState(mheEquipmentName);
  const [mheEquipmentSerialNumber, setMheEquipmentSerialNumber] = useState('');
  const [mheActivityStatus, setmheActivityStatus] = useState('');
  const [value, setvalue] = useState({});
  const [modelList, setModelList] = useState([]);

  async function getData() {
    const response = await fetch(`http://192.168.0.194:5005/api/1.0/mheEquipment/getMheEquipmentByName/${mheEquipmentName}`);
    const json = await response.json();
    setMheModelName(json.mheModelName);
    setMheEquipmentSerialNumber(json.mheEquipmentSerialNumber);
    setmheActivityStatus(json.mheActivityStatus);
    setMheEquipment(json.mheEquipment);
  }

  const fetchData = async () => {
    const response = await fetch('http://192.168.0.194:5005/api/1.0/mheModel/');
    const newData = await response.json();
    setModelList(newData);
    // console.log(newData);
  };

  useEffect(() => {
    getData();
    fetchData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const data = {

        mheModelName,
        mheEquipmentSerialNumber,
        mheEquipmentName: mheEquipment,
        mheActivityStatus,
      };
      axios
        .put(
          `http://192.168.0.194:5005/api/1.0/mheEquipment/updateMheEquipmentByName/${mheEquipmentName}`,
          data,
        )
        .then((result) => {
          if (result.status === 201 || result.status === 200) {
            // eslint-disable-next-line no-alert
            alert('Equipment Data Updated Successfully..');
            history.push('/mhe_equipment/mheequipment.js');
          }
        });
      console.log(data);
    }
  }
  function validate() {
    const errors = {};
    let isValid = true;

    if (!mheEquipment) {
      isValid = false;
      errors.mheEquipment = 'Please enter Equipment name';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheEquipment)) {
      isValid = false;
      errors.mheEquipment = 'field should be in correct format';
    }

    if (!mheEquipmentSerialNumber) {
      isValid = false;
      errors.mheEquipmentSerialNumber = 'Please enter serial number';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheEquipmentSerialNumber)) {
      isValid = false;
      errors.mheEquipmentSerialNumber = 'field should be in correct format';
    }
    if (!mheActivityStatus) {
      isValid = false;
      errors.mheActivityStatus = 'Please Enter Status of Equipment';
    }
    if (!mheModelName) {
      isValid = false;
      errors.mheModelName = 'Please select Model Name';
    }
    setvalue(errors);

    return isValid;
  }
  return (
    <div>
      <div style={{
        border: '1px solid grey', width: '40%', padding: '2% 3% 2% 5%', borderRadius: '15px', margin: '8% 0 0 20%',
      }}
      >
        <Typography variant="h4">Edit Mhe Equipment</Typography>

        <form onSubmit={handleSubmit}>
          <div className="mt-2 ">
            <label> Mhe Equipment Name</label>
            <input
              name="mhe_Equipment"
              type="text"
              value={mheEquipment}
              onChange={(e) => {
                setMheEquipment(e.target.value);
              }}
              className="form-control"
            />
            <div className="text-danger">{value.mheEquipment}</div>
          </div>
          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput2"> Model Name</label>
            <select
              className="form-control"
              // value={mheModelName}
              onChange={(e) => {
                setMheModelName(e.target.value);
              }}

            >
              <option value="">Model name</option>
              {modelList.map((model) => (
                <option>
                  {model.mheModelName}

                </option>

              ))}

            </select>
            <div className="text-danger">{value.mheModelName}</div>
          </div>
          <div className="mt-2 ">
            <label>Serial number</label>
            <input
              name="mhe_EquipmentSerial_Number"
              type="text"
              value={mheEquipmentSerialNumber}
              onChange={(e) => {
                setMheEquipmentSerialNumber(e.target.value);
              }}
              className="form-control"
            />
            <div className="text-danger">{value.mheEquipmentSerialNumber}</div>
          </div>

          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput">Activity Status</label>
            <input
              type="text"
              name="mhe_Activity_Status"
              value={mheActivityStatus}
              onChange={(e) => {
                setmheActivityStatus(e.target.value);
              }}
              className="form-control"
              id="formGroupExampleInput"
              placeholder="mhe Activity Status"
            />
            <div className="text-danger">{value.mheActivityStatus}</div>
          </div>

          <div className="mt-3 ">
            <input type="submit" value="Submit" className="btn btn-primary" />
            <Link
              to="/mhe_equipment/mheequipment.js"
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
    </div>
  );
}

export default MheEquipmentEdit;
