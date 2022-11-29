/* eslint-disable no-alert */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(1),
    paddingLeft: '20%',
    paddingTop: '0%',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '1%',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    paddingTop: '2%',
  },
  paper: {
    height: 140,
    width: 100,
  },
  table: {
    Width: 500,
  },
  control: {
    padding: theme.spacing(2),
  },

}));

class AlertKRCLSummaryDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      alertReading: [],
      alertReadingOne: [],

    };
  }

  async componentDidMount() {
    const url = 'http://192.168.0.194:5005/api/1.0/devices';
    const response = await axios.get(url);
    const resss = await axios.all(response.data.filter((companyData) => companyData.companyName === 'KRCL').map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/alerts/unresolved/device/${u.id}`)));
    // console.log(resss);
    if (resss.status === 400) {
      alert('Bad Request');
    } else if (resss.status === 404) {
      alert('Data Not Found');
    } else if (resss.status === 409) {
      alert('Request Conflict');
    } else if (resss.status === 500) {
      alert('Internal Server Error');
    }

    this.setState({ alertReadingOne: resss, loading: true });
    this.setState({
      alertReading: response.data,
      loading: false,
    });
  }

  render() {
    return (
      <div style={{ marginTop: '8%', marginLeft: '5%' }}>
        <Typography variant="h4" noWrap component="div">
          Alert Summary :
        </Typography>

        <div>

          {this.state.alertReadingOne.map((di) => (
            <div style={{ display: 'inline-flex' }}>
              <div>

                <div
                  className="container px-3 py-3"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    <Grid
                      container
                      className={useStyles.root}
                      spacing={3}
                      item
                      xs={12}
                      direction="column"
                    >
                      <Grid item xs={12}>
                        <Grid container justify="center" spacing={3} direction="column">
                          {[0].map((value) => (
                            <Grid key={value} item>
                              <Paper
                                style={{
                                  backgroundColor: '#009acd',
                                  height: 140,
                                  width: 280,
                                  margin: '10px',
                                  boxShadow: '5px 5px 10px #646970',
                                  borderRadius: '10px',
                                }}
                              >

                                <Typography align="center" className={useStyles.text} noWrap>
                                  <Box
                                    fontWeight="fontWeightBold "
                                    className={useStyles.text}
                                    style={{
                                      color: 'black',
                                      paddingTop: '2%',
                                      paddingLeft: '1px',
                                      textAlign: 'center',
                                    }}
                                  >

                                    <div>
                                      <h4 style={{ color: 'white', fontSize: '' }}>{di.data.DeviceName}</h4>

                                      <h5>

                                        High:-
                                        {' '}
                                        {di.data.High}
                                      </h5>
                                      <h5>

                                        Medium:-
                                        {' '}
                                        {di.data.Medium}
                                      </h5>
                                      <h5>

                                        Low:-
                                        {' '}
                                        {di.data.Low}
                                      </h5>
                                    </div>
                                  </Box>
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }
}
export default AlertKRCLSummaryDash;
