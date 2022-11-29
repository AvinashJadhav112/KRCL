/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable no-alert */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '54ch',
    },
  },
  formcontrol: {
    margin: theme.spacing(1),
    minWidth: 425,
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

function CompAddEditUser() {
  const classes = useStyles();
  const [, setOnEd] = React.useState(false);

  const handleClose3 = () => {
    setOnEd(false);
  };

  const Schema = Yup.object().shape({
    selectUser: Yup.string()
      .required('User is required'),

    selectRole: Yup.string()
      .required('Role is required'),
  });

  const {
    register, handleSubmit, reset, errors,
  } = useForm({
    resolver: yupResolver(Schema),
  });

  function onSubmit(data) {
    // display form data on success
    alert(`SUCCESS!! :-)\n\n${JSON.stringify(data, null, 4)}`);
  }
  return (
    <main className={classes.content}>

      <div>
        <Typography variant="h6" noWrap component="div">
          Select User
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <div className="card-body">

          <div className="form-row">

            <div className="form-group col-6">
              <label>Select User</label>
              <select name="selectUser" ref={register} className={`form-control ${errors.selectUser ? 'is-invalid' : ''}`}>
                <option aria-label="None" value="" />
                <option value="Prasad Shelake">Prasad Shelake</option>
                <option value="Elite Creane">Elite Crane</option>
                <option value="Avare">Avare</option>
              </select>
              <div className="invalid-feedback">{errors.selectUser?.message}</div>
            </div>

            <div className="form-group col-6">
              <label>Select Role</label>
              <select name="selectRole" ref={register} className={`form-control ${errors.selectRole ? 'is-invalid' : ''}`}>
                <option aria-label="None" value="" />
                <option value="App Admin">App Admin</option>
                <option value="Cust Admin">Cust Admin</option>
                <option value="Cust User">Cust User</option>
              </select>
              <div className="invalid-feedback">{errors.selectRole?.message}</div>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginLeft: '40%', paddingBottom: '1%', paddingTop: '2%' }}>
          <button type="submit" className="btn btn-primary mr-1" onClick={handleClose3}>Save</button>
        </div>
      </form>
    </main>
  );
}
export default CompAddEditUser;
