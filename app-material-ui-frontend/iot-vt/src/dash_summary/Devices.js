/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-alert */
/* eslint-disable no-const-assign */
/* eslint-disable react/jsx-key */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-sequences */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-no-bind */

/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
// //vtiot-cloudapp.nelkinda.com/api/1.0/templates
import React from 'react';
import axios from 'axios';
import './Inactivedevices.css';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import LoadingSpinner from '../components/loadingSpinner';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },

}));

class Devices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      sensorReading: [],
      sensorReadingOne: [],
      sensorReadingTwo: [],
      sensorId: '',
      templateName: '',
      // isDialogOpen: false,
      openDeleteDialog: false,
      reload: false,
      factoryDeviceId: '',

      sensorRead: [],
      rawValue: '',
      timestamp: '',
      dashboardOrder: [],
      sortType: 'asc',
      id: [],
      unit: '',
      name: '',
      gOpen: false,

      fid: [],
      deviceName: '',
      serialNumber: '',
      latestSensorData: [],
      sdata: [],

      datetime: '',
      apitime: '',
      displayindicator: '',
      loadingData: false,

    };
  }

  async componentDidMount() {
    try {
      this.setState({ loadingData: true }, async () => {
        setInterval(async () => {
          const url = 'http://192.168.0.194:5005/api/1.0/dashboard/devices';
          const response = await axios.get(url);
          if (response.status === 500) {
            alert('Internal server error');
          }
          // console.log(response.data);

          const ress = await axios.all(response.data.map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/devices/${u.id}/sensors/latest/calculated`)));
          if (ress.status === 500) {
            alert('Internal server error');
          }
          // console.log(ress);
          this.setState({ loadingData: false });
          this.setState({ sensorReadingTwo: ress, loading: true });
          // console.log(this.state.sensorReadingTwo);

          this.setState({
            sensorReading: response.data,
            loading: false,
          });
        }, 300);
      });
    } catch (e) {
      // console.log(e);
    }
  }

  render() {
    const { sensorReadingTwo } = this.state;
    const { loadingData } = this.state;

    const row = [];
    this.state.sensorReadingTwo.map((it) => {
      row.push({
        id: it.id,
        timestamp: it.timestamp,
        rawValue: it.rawValue,
        unit: it.unit,
        name: it.name,
        dashboardOrder: it.dashboardOrder,

      });
    });

    const currentdate = new Date();
    this.state.datetime = `${currentdate.getFullYear()}-${(currentdate.getMonth() + 1).toString().padStart(2, '0')
    }-${currentdate.getDate()}T${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}.${currentdate.getMilliseconds()}Z`;

    return (

      <div style={{
        flexGrow: 4, marginTop: '8%', marginLeft: '5%',
      }}
      >

        <div>
        <h3>Active Devices:</h3>
          {loadingData ? <LoadingSpinner /> : <h5 />}
        </div>
        {/* <div className="section_our_solution"> */}
        <div className="row">

          {this.state.sensorReadingTwo.map((di) => {
            const deviceValue = di.data.latestSensorData.filter((sd) => sd.id === 'C000F');
            di.data.latestSensorData.sort((a, b) => a.dashboardOrder - b.dashboardOrder);
            console.log(di.data);
            return (
              <div className="col-md-4 col-xl-3" style={{ display: currentdate.getDate() == deviceValue[0].timestamp.substring(8, 10) && currentdate.getHours() == deviceValue[0].timestamp.substring(11, 13) ? deviceValue[0].timestamp.substring(14, 16) >= currentdate.getMinutes() - 2 ? '1' : 'none' : 'none' }}>
                 { di.data.latestSensorData.map((readings, i) => (
                   this.state.displayindicator = di.data.latestSensorData.filter((sd) => sd.id === 'C000F'),
                   di.data.latestSensorData.sort((a, b) => a.dashboardOrder - b.dashboardOrder),
                   console.log('Hello')
                 ))}
              <div className="solution_card">
              <div className="hover_color_bubble" />
              <div className="solu_title">
              {di.data.deviceName.length > 15 ? (
                      <h3>
                        {di.data.deviceName.slice(0, 10)}
                        ...
                      </h3>
              ) : (
                      <h3>{di.data.deviceName}</h3>
              )}
              </div>
              <div className="solu_description">
              {this.state.displayindicator.map((readings) => (
                <>
                      <h4>
                     Activity Status
                      </h4>
                      <h6>
                        Date:
                        {' '}
                        {readings.timestamp.slice(0, 10)}
                      </h6>
                                              <h6>
                        Time:
                        {' '}
                        {readings.timestamp.slice(11, 19)}
                                              </h6>
                </>
              ))}
             <button type="button" className="read_more_bn"><Link style={{ textDecoration: 'none' }} className="link" to={`/dash_summary/Activedevices/sensors/${di.data.id}/${di.data.deviceName}`}>More Details</Link></button>
              </div>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Devices;
