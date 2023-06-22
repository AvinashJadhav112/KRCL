/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { React, useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const MheModelEdit = () => {
  const history = useHistory();
  const { mheModelName } = useParams();

  const [mheModel, setMheModel] = useState(mheModelName);
  const [mheModelSerialNumber, setMheModelSerialNumber] = useState('');
  const [mheModelMake, setMheModelMake] = useState('');
  const [mheModelDescription, setMheModelDescription] = useState('');
  const [value, setvalue] = useState({});

  async function getData() {
    const response = await fetch(`http://192.168.0.194:5005/api/1.0/mheModel/getMheModelByName/${mheModelName}`);
    const json = await response.json();
    setMheModel(json.mheModel);
    setMheModelDescription(json.mheModelDescription);
    setMheModelSerialNumber(json.mheModelSerialNumber);
    setMheModelMake(json.mheModelMake);
  }

  useEffect(() => {
    getData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      const data = {
        mheModelName: mheModel, mheModelSerialNumber, mheModelMake, mheModelDescription,
      };
      fetch(`http://192.168.0.194:5005/api/1.0/mheModel/updateMheModelByName/${mheModelName}`, {
        method: 'Put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((result) => {
        if (result.status === 201 || result.status === 200) {
          // eslint-disable-next-line no-alert
          alert('Model Data Added Successfully..');
          history.push('/mhe_model/mhemodel.js');
        }
      });
    }
  }

  function validate() {
    const errors = {};
    let isValid = true;

    if (!mheModel) {
      isValid = false;
      errors.mheModel = 'Please enter Model name';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheModel)) {
      isValid = false;
      errors.mheModel = 'field should be in correct format';
    }
    if (!mheModelSerialNumber) {
      isValid = false;
      errors.mheModelSerialNumber = 'Please enter serial number';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheModelSerialNumber)) {
      isValid = false;
      errors.mheModelSerialNumber = 'field should be in correct format';
    }

    if (!mheModelMake) {
      isValid = false;
      errors.mheModelMake = 'Please enter make model';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheModelMake)) {
      isValid = false;
      errors.mheModelMake = 'field should be in correct format';
    }

    if (!mheModelDescription) {
      isValid = false;
      errors.mheModelDescription = 'Please enter description';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheModelDescription)) {
      isValid = false;
      errors.mheModelDescription = 'field should be in correct format';
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
        <Typography variant="h4">Edit Model</Typography>

        <form onSubmit={handleSubmit}>
          {/* <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput">Model Name</label>
            <input type="text" name="mheModelName" value={mheModelName} onChange={(e) => { setMheModelName(e.target.value); }} className="form-control" id="formGroupExampleInput" placeholder="Model Name" />
            <div className="text-danger">{value.mheModelName}</div>
          </div> */}
          <div className="mt-2 ">
            <label>Updated Mhe Model</label>
            <input
              name="mhe_Model"
              type="text"
              value={mheModel}
              onChange={(e) => {
                setMheModel(e.target.value);
              }}
              className="form-control"
            />
            <div className="text-danger">{value.mheModel}</div>
          </div>
          <div className="mt-2 ">
            <label>Updated SerialNumber</label>
            <input
              name="mhe_Model_SerialNumber"
              type="tex"
              value={mheModelSerialNumber}
              onChange={(e) => {
                setMheModelSerialNumber(e.target.value);
              }}
              className="form-control"
            />
            <div className="text-danger">{value.mheModelSerialNumber}</div>
          </div>
          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput">Updated Model Make</label>
            <input
              type="text"
              name="mhe_Model_Make"
              value={mheModelMake}
              onChange={(e) => {
                setMheModelMake(e.target.value);
              }}
              className="form-control"
              id="formGroupExampleInput"
              placeholder="mhe Model Make"
            />
            <div className="text-danger">{value.mheModelMake}</div>
          </div>
          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput">Updated Description</label>
            <input
              type="text"
              name="mhe_Model_Description"
              value={mheModelDescription}
              onChange={(e) => {
                setMheModelDescription(e.target.value);
              }}
              className="form-control"
              id="formGroupExampleInput"
              placeholder="mhe Model Description"
            />
            <div className="text-danger">{value.mheModelDescription}</div>
          </div>
          <div className="mt-3 ">
            <input type="submit" value="Submit" className="btn btn-primary" />
            <Link to="/mhe_model/mhemodel.js" style={{ textDecoration: 'none' }}>
              <input type="reset" value="Cancel" className="btn btn-secondary" style={{ marginLeft: '2%' }} />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MheModelEdit;
