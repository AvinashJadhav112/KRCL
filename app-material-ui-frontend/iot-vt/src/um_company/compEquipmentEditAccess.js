/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
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

function CompEquipmentEditAccess() {
  const classes = useStyles();

  const [, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // For Company add equipment Access
  const [openDialogEquipment, setOpenDialogEquipment] = React.useState(false);
  const handleClickOpenEquipment = () => {
    setOpenDialogEquipment(true);
  };

  const handleCloseDialogEquipment = () => {
    setOpenDialogEquipment(false);
  };

  const Schema = Yup.object().shape({
    selectEquipment: Yup.string()
      .required('Equipment is required'),

    selectStatus: Yup.string()
      .required('Status is required'),
  });

  const {
    register, handleSubmit, reset, errors,
  } = useForm({
    resolver: yupResolver(Schema),
  });

  function onSubmit(data) {
    // display form data on success
    // eslint-disable-next-line no-alert
    alert(`SUCCESS!! :-)\n\n${JSON.stringify(data, null, 4)}`);
  }
  return (
    <main className={classes.content}>
      <div>
        <Typography variant="h6" noWrap component="div">
          Equipment Access
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <div className="card-body">

          <div className="form-row">

            <div className="form-group col-6">
              <label>Select Equipment</label>
              <select name="selectEquipment" ref={register} className={`form-control ${errors.selectEquipment ? 'is-invalid' : ''}`}>
                <option aria-label="None" value="" />
                <option value="Equipment1">Equipment1</option>
                <option value="Equipment2">Equipment2</option>
              </select>
              <div className="invalid-feedback">{errors.selectEquipment?.message}</div>
            </div>

            <div className="form-group col-6">
              <label>Select Status</label>
              <select name="selectStatus" ref={register} className={`form-control ${errors.selectStatus ? 'is-invalid' : ''}`}>
                <option aria-label="None" value="" />
                <option value="Active">Active</option>
                <option value="In-Active">In-Active</option>
              </select>
              <div className="invalid-feedback">{errors.selectStatus?.message}</div>
            </div>
          </div>

        </div>

        <div className="form-group" style={{ marginLeft: '40%', paddingBottom: '1%', paddingTop: '2%' }}>
          <button type="submit" className="btn btn-primary mr-1" onClick={handleClose}>Submit</button>
        </div>
      </form>

    </main>
  );
}
export default CompEquipmentEditAccess;
