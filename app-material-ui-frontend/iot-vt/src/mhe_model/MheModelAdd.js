/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { React, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const MhemodelAdd = () => {
  const history = useHistory();
  const [mheModelName, setMheModelName] = useState('');
  const [mheModelSerialNumber, setMheModelSerialNumber] = useState('');
  const [mheModelMake, setMheModelMake] = useState('');
  const [mheModelDescription, setMheModelDescription] = useState('');
  const [value, setvalue] = useState({});
  const [modelList, setModelList] = useState([]);

  const fetchData = () => fetch('http://192.168.0.194:5005/api/1.0/mheModel/')
    .then((response) => response.json())
    .then((data) => setModelList(data));
  console.log(modelList);

  useEffect(() => {
    fetchData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      let modelTobeStored = true;
      modelList.map((modelsList) => {
        if (modelsList.mheModelName === mheModelName || modelsList.mheModelSerialNumber === mheModelSerialNumber || modelsList.mheModelMake === mheModelMake || modelList.mheModelDescription === mheModelDescription) {
          modelTobeStored = false;
        }
      });
      if (modelTobeStored) {
        const data = {
          mheModelName, mheModelSerialNumber, mheModelMake, mheModelDescription,
        };
        fetch('http://192.168.0.194:5005/api/1.0/mheModel/', {
          method: 'Post',
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
          // console.warn('result', result);
          result.json().then((res) => {
            console.warn('res', res);
          });
        });
      } else {
        modelList.map((model) => {
          if (model.mheModelName === mheModelName && model.mheModelSerialNumber === mheModelSerialNumber && model.mheModelMake === mheModelMake && model.mheModelDescription === mheModelDescription) {
            setMheModelName('');
            setMheModelSerialNumber('');
            setMheModelMake('');
            setMheModelDescription('');
            alert('These Model details allready exists, please try with different details');
          } else if (model.mheModelName === mheModelName) {
            setMheModelName('');
            alert('Model Name already exists, please try with different Name');
          } else if (model.mheModelSerialNumber === mheModelSerialNumber) {
            setMheModelSerialNumber('');
            alert('Model serial number already exists, please try with different Number');
          }
        });
      }
    }
  }

  function validate() {
    const errors = {};
    let isValid = true;

    if (!mheModelName) {
      isValid = false;
      errors.mheModelName = 'Please enter Model name';
    } else if (!/^[a-z A-Z 0-9 ]+$/i.test(mheModelName)) {
      isValid = false;
      errors.mheModelName = 'field should be in correct format';
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
        <Typography variant="h4">Add Model</Typography>

        <form style={{ width: '75%' }} onSubmit={handleSubmit}>
          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput">Model Name</label>
            <input type="text" name="mheModelName" value={mheModelName} onChange={(e) => { setMheModelName(e.target.value); }} className="form-control" id="formGroupExampleInput" placeholder="Model Name" />
            <div className="text-danger">{value.mheModelName}</div>
          </div>
          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput2">Serial Number</label>
            <input type="text" name="mheModelSerialNumber" value={mheModelSerialNumber} onChange={(e) => { setMheModelSerialNumber(e.target.value); }} className="form-control" id="formGroupExampleInput2" placeholder="Serial Number" />
            <div className="text-danger">{value.mheModelSerialNumber}</div>
          </div>
          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput2">Model Make</label>
            <input type="text" name="mheModelMake" value={mheModelMake} onChange={(e) => { setMheModelMake(e.target.value); }} className="form-control" id="formGroupExampleInput2" placeholder="Model Make" />
            <div className="text-danger">{value.mheModelMake}</div>
          </div>
          <div className="mt-2 ">
            <label htmlFor="formGroupExampleInput2">Model Description</label>
            <input type="text" name="mheModelDescription" value={mheModelDescription} onChange={(e) => { setMheModelDescription(e.target.value); }} className="form-control" id="formGroupExampleInput2" placeholder="Model Description" />
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

export default MhemodelAdd;
