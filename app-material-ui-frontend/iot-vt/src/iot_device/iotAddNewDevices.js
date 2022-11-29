/* eslint-disable import/no-duplicates */
/* eslint-disable react/display-name */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import IotAddNewDevicesForm from './iotAddNewDevicesForm';

const useStyles = makeStyles((theme) => ({

  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

  content: {
    flexGrow: 4,
    padding: theme.spacing(3),
    paddingLeft: '20%',
    paddingTop: '0%',
  },

  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',

    },
  },
}));

// eslint-disable-next-line react/jsx-props-no-spreading
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function IotAddNewDevices() {
  const classes = useStyles();
  return (
    <main style={{ marginLeft: '5%', marginTop: '8%' }}>
      <Typography>
        <h3>
          Add New Devices
        </h3>
      </Typography>

      <div>
        <IotAddNewDevicesForm />

      </div>

    </main>
  );
}

export default IotAddNewDevices;
