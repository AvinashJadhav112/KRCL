/* eslint-disable no-alert */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
import { Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';

function MheEquipmentAddNew() {
  const history = useHistory();
  const [modelsList, setModelsList] = useState([]);
  const [mheModelName, setMheModelName] = useState('');
  const [mheEquipmentSerialNumber, setMheEquipmentSerialNumber] = useState('');
  const [mheActivityStatus, setMheActivityStatus] = useState('');
  const [mheEquipmentName, setMheEquipmentName] = useState('');

  const [value, setvalue] = useState({});

  useEffect(() => {
    getMheequipment();
  }, []);

  async function getMheequipment() {
    console.log('getMheequipment');
    try {
      const modelResponse = await fetch(
        'http://192.168.0.194:5005/api/1.0/mheModel/',
      );
      const equipmentResponse = await fetch(
        'http://192.168.0.194:5005/api/1.0/mheEquipment/',
      );
      const modelList = await modelResponse.json();
      const equipmentList = await equipmentResponse.json();
      console.log(modelList);
      console.log(equipmentList);
      let filteredArray = modelList;
      equipmentList.map((equipment) => {
        filteredArray = filteredArray.filter(
          (model) => equipment.mheModelName !== model.mheModelName,
        );
      });
      const modelLabelArray = filteredArray.map((model) => {
        const modelLabel = {
          label: model.mheModelName,
          id: model.id,
        };
        return modelLabel;
      });
      setModelsList(modelLabelArray);
      console.log(modelLabelArray);
    } catch (error) {
      console.error(error);
    }
  }
  function handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('There is already a Equipment detials same name..');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const data = {
        mheEquipmentName,
        mheEquipmentSerialNumber,
        mheActivityStatus,
        mheModelName,

      };
      fetch('http://192.168.0.194:5005/api/1.0/mheEquipment/', {
        method: 'Post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((result) => {
        if (result.status === 201 || result.status === 200) {
          // eslint-disable-next-line no-alert
          alert('Mhe Equipment Data Added Successfully..');
          history.push('/mhe_equipment/mheequipment.js');
        }
      },
      (error) => {
        handleError(error);
        return error;
      });
    }
  }

  function validate() {
    const errors = {};
    let isValid = true;

    if (!mheEquipmentName) {
      isValid = false;
      errors.mheEquipmentName = 'Please enter Equipment name';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheEquipmentName)) {
      isValid = false;
      errors.mheEquipmentName = 'field should be in correct format';
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
      errors.mheActivityStatus = 'Please Enter status';
    }
    if (!mheModelName) {
      isValid = false;
      errors.mheModelName = 'Please select model name';
    }

    setvalue(errors);

    return isValid;
  }
  return (
    <div>
      <div style={{
        border: '1px solid grey', width: '40%', padding: '2% 0 2% 5%', borderRadius: '15px', margin: '8% 0 0 20%',
      }}
      >
        <Typography variant="h4">Add New Mhe Equipment</Typography>

        <form style={{ width: '75%' }} onSubmit={handleSubmit}>
          <div className="row" style={{ marginRight: '-18%' }}>

            <div className=" "> </div>
            <div className=" "> </div>
            <div className=" "> </div>
            <div className=" "> </div>
            <div className=" "> </div>
            <div className="mt-2 ">
              <label htmlFor="formGroupExampleInput2">Mhe Equipment Name</label>
              <input type="text" name="mheEquipmentName" value={mheEquipmentName} onChange={(e) => { setMheEquipmentName(e.target.value); }} className="form-control" id="formGroupExampleInput2" placeholder="Equipment Name" />
              <div className="text-danger">{value.mheEquipmentName}</div>
            </div>

            <div className="mt-2 ">
              <label htmlFor="formGroupExampleInput2">Mhe Serial Number</label>
              <input type="text" name="mheEquipmentSerialNumber" value={mheEquipmentSerialNumber} onChange={(e) => { setMheEquipmentSerialNumber(e.target.value); }} className="form-control" id="formGroupExampleInput2" placeholder="Serial Number" />
              <div className="text-danger">{value.mheEquipmentSerialNumber}</div>
            </div>

            <div className="mt-2 ">
              <label htmlFor="formGroupExampleInput2">Updated Activity Status</label>
              <input type="text" name="mheActivityStatus" value={mheActivityStatus} onChange={(e) => { setMheActivityStatus(e.target.value); }} className="form-control" id="formGroupExampleInput2" placeholder="Activity Status" />
              <div className="text-danger">{value.mheActivityStatus}</div>
            </div>
            <div className="mt-2 ">
              <label htmlFor="formGroupExampleInput">Model Name</label>
              <Select
                onChange={(e) => {
                  setMheModelName(e.label);
                }}
                options={modelsList}
              />
              <div className="text-danger">{value.mheModelName}</div>
            </div>
          </div>
          <div className="mt-3 ">
            <input type="submit" value="Submit" className="btn btn-success" />
            <Link to="/mhe_equipment/mheequipment.js" style={{ textDecoration: 'none' }}>
              <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '12%' }} />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MheEquipmentAddNew;
