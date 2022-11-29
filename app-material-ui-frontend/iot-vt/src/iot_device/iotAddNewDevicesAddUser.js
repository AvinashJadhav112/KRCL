/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable no-alert */
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
    width: 275,
  },

}));

const user = [
  'VT',
  'Hitachi',
  'HCL',

];

const role = [
  'App Admin',
  'Company Admin',
  'Company User',

];

function IotAddNewDevicesAddUser() {
  const classes = useStyles();

  const userSchema = Yup.object().shape({
    user: Yup.string()
      .required('Please select user from list'),

    role: Yup.string()
      .required('please select role from list'),

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
        <Typography variant="h6" noWrap component="div">
          Add User
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>

        <div className="card-body">

          <div className="form-row">

            <div className="form-group col-10">
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
            <div className="form-group ">
              <button type="submit" className="btn btn-primary mr-1">Submit</button>
            </div>

          </div>
        </div>
      </form>

    </main>
  );
}
export default IotAddNewDevicesAddUser;
