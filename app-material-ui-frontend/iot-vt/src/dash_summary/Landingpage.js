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

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

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

class Landingpage extends React.Component {
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
        }, 1000);
      });
    } catch (e) {
      // console.log(e);
    }
  }

  // asceOrder() {
  //   this.setState(this.setState.dashboardOrder.sort((a, b) => a - b));
  // }

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

    // console.log(currentdate.getMinutes());
    // console.log(currentdate);
    // console.log(this.state.datetime);

    // console.log((currentdate.getMonth() + 1).toString().padStart(2, '0'));

    return (

      <div style={{ flexGrow: 4, paddingLeft: '20px', paddingTop: '6%' }}>

        <div>
          <Typography variant="h4" noWrap component="div">
            Summary Dashboard:
          </Typography>
          {loadingData ? <LoadingSpinner /> : <h5 />}
        </div>

        <div>

          {this.state.sensorReadingTwo.map((di) => (
            <div>
              <div style={{ display: 'flex' }}>
                <div>
                  {/* {console.log(di)} */}
                  <h4><li value={di.data.id}>{di.data.deviceName}</li></h4>
                </div>
                <div style={{ paddingLeft: '15px' }}>
                  {/* {di.data.latestSensorData.map((readings, i) => ( */}
                  <Grid container spacing={0}>
                    <Grid item xs={0} sm={0}>
                      { di.data.latestSensorData.map((readings, i) => (
                        this.state.displayindicator = di.data.latestSensorData.filter((sd) => sd.id === 'C000F'),
                        di.data.latestSensorData.sort((a, b) => a.dashboardOrder - b.dashboardOrder),
                        console.log(this.state.displayindicator)
                      ))}
                      {this.state.displayindicator.map((sd) => (

                        <Box

                          style={{
                            // backgroundColor: 1 == 2 ? 'green' : 'red',
                            padding: 14,

                            display: 'inline-block',
                            //  backgroundColor: sd.id=="C000F"?sd.name=="ADC Vref" ? 'red' : 'green':'green',
                            backgroundColor: currentdate.getDate() == sd.timestamp.substring(8, 10) && currentdate.getHours() == sd.timestamp.substring(11, 13) ? sd.timestamp.substring(14, 16) >= currentdate.getMinutes() - 5 ? 'green' : 'red' : 'red',

                            borderRadius: '50%',
                            width: 7,
                            height: 7,
                            left: 0,
                            top: 0,
                            boxShadow: '0px 10px 20px 1px',
                            border: '1px solid white',
                          }}
                        />
                      ))}
                    </Grid>
                  </Grid>

                </div>
                <div style={{ paddingLeft: '20px', paddingTop: '6px' }}>
                  {this.state.displayindicator.map((readings, i) => (
                    <h5>
                      { 'Activity status date-time' }
                      {'  : '}
                      {readings.timestamp.slice(0, 10)}
                      {' '}

                      {readings.timestamp.slice(11, 19)}
                    </h5>
                  ))}
                </div>
              </div>
              <div

                className="container px-3 py-3"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  paddingLeft: '5%',
                  paddingTop: '0%',
                }}
              >
                {di.data.latestSensorData.map((readings, i) => (

                  (() => {
                    if (readings.id.startsWith('R', 0)) {
                      return <h1> </h1>;
                    }

                    return (

                      <div
                        key={i + 1}
                        style={{
                          display: 'flex',
                          paddingRight: '0%',
                          flexWrap: 'wrap',
                        }}

                      >

                        <Grid
                          container
                          className={useStyles.root}
                          spacing={3}
                          item
                          xs={12}
                        >
                          <Grid item xs={12}>
                            <Grid container justify="center" spacing={3}>
                              {[0].map((value) => (
                                <Grid key={value} item>
                                  <Paper
                                    className={useStyles.paper}
                                    style={{
                                      backgroundColor: Math.round(readings.rawValue) >= readings.max ? 'red' : 'green',
                                      height: 75,
                                      width: 160,
                                      boxShadow: '0px 10px 20px 1px',
                                      borderRadius: '12px',
                                      margin: '8px',
                                      overflow: 'hidden',

                                    }}
                                  >

                                    <Typography align="center" className={useStyles.text} noWrap>
                                      <Box
                                        fontWeight="fontWeightBold "
                                        className={useStyles.text}
                                        style={{
                                          color: 'white',
                                          padding: '0px',

                                          fontWeight: 'fontWeightBold',
                                        }}
                                      >

                                        { (() => {
                                          if (readings.id.startsWith('R', 0)) {
                                            return <h1> </h1>;
                                          }

                                          return (
                                            <div>

                                              <b>
                                                {readings.name}
                                              </b>

                                              <br />

                                              <b>
                                                {readings.rawValue.slice(0, 6)}
                                              </b>

                                              <h6>
                                                {readings.unit}
                                              </h6>

                                            </div>
                                          );
                                        })()}
                                      </Box>
                                    </Typography>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>

                    );
                  })()
                ))}

              </div>
            </div>
          ))}
        </div>

      </div>

    );
  }
}
export default Landingpage;
