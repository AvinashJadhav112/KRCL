/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable max-len */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-alert */
/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',

  },

  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '35ch',
    },
  },

  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

}));

const user = [
  'VT',
  'Hitachi',
  'HCL',

];

function IotDeviceEditAddUser() {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();

  const userSchema = Yup.object().shape({
    user: Yup.string()
      .required('Please select user from list'),
  });

  const {
    register, handleSubmit, reset, errors,
  } = useForm({

    resolver: yupResolver(userSchema),

  });

  function onSubmit(data) {
    // display form data on success
    alert(`SUCCESS!! :-)\n\n${JSON.stringify(data, null, 4)}`);
  }

  return (
    <main>
      <div>
        <Typography>
          <h5> Add User</h5>
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>

        <div className="card-body">

          <div className="form-row">

            <div className="form-group col-10 ">
              <label>User</label>
              <select name="user" ref={register} className={`form-control ${errors.user ? 'is-invalid' : ''}`}>
                <option value="" />
                {user.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.user?.message}</div>
            </div>
            <div className="form-group col-4" />
            <div className="form-group col-4" />

            <div className="form-group ">
              <button type="submit" className="btn btn-primary mr-1">Submit</button>
            </div>

          </div>
        </div>
      </form>
    </main>
  );
}
export default IotDeviceEditAddUser;
