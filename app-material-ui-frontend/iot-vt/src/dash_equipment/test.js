/* eslint-disable no-alert */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-key */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable no-shadow */
/* eslint-disable no-sequences */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable global-require */
/* eslint-disable react/sort-comp */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */

/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-dupe-keys */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const tableStyle = {
  border: '1px solid black',
  borderCollapse: 'collapse',
  textAlign: 'center',
};

const tdStyle = {
  border: '1px solid #85C1E9',
  background: 'white',
  padding: '5px',

};

const thStyle = {
  border: '1px solid #3498DB',
  background: '#3498DB',
  color: 'white',
  padding: '5px',
};

const useStyles = makeStyles((theme) => ({

  content: {
    flexGrow: 4,
    padding: theme.spacing(5),
    paddingLeft: '20%',
    paddingTop: '0%',

  },
  root: {
    flexGrow: 1,

  },
  paper: {
    height: 120,
    width: 180,
    boxShadow: '0px 10px 20px 1px',

  },

  text: {
    color: 'white',
    fontWeight: 'fontWeightBold',
  },

}));

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      // eslint-disable-next-line react/no-unused-state
      loading: true,
      sensorReading: [],
      sensorReadingOne: [],
      sensorReadingOneTwo: [],
      sensorReadingTwo: [],
      templateName: '',

      selectOptions: [],
      selectcheckbox: [],
      openDeleteDialog: false,
      reload: false,
      checkedA: true,
      checkbox: ' ',
      sensorId: '',
      rawValue: '',
      deviceName: '',
      latestSensorData: [],
      unit: '',
      factoryDeviceId: '',
      timestamp: '',
      id: '',
      idd: '',
      serialNumber: '',
      modelName: '',
      date: '',
      startTime: '',
      endTime: '',
      value: '',
      Concat: '',
      label: '',
      name: '',

      selectValue: [],
      addedProducts: [],

      sensorid: '0000',
      plotData: '',
      plotDataid: '',
      Data: {},
      Data1: {},
      paginationdata: [],
      activePage: 1,

      Storesensor: [],
      Sensordata: [],
      sReadingOneTwo: [],
      sensorReadOneTwo: [],
      sReadingOne: [],
      sReadingTwo: [],
      sReadingThree: [],
      sReadingFour: [],
      sReadingFive: [],
      sReadingSix: [],
      sReadingSeven: [],
      converterhd: require('hex2dec'),
      errors: {},

      Readingdata: [],
      addedsensor: [],
      Deviceid: [],
      result: [],

    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.handlePlotdata = this.handlePlotdata.bind(this);
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('Request conflicts');
    } else if (error.response && error.response.status === 400) {
      alert('Bad Request');
    } else if (error.response && error.response.status === 404) {
      alert('Not found');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 403) {
      alert('Forbidden');
    }
  }

  async componentDidMount() {
    const url = 'http://192.168.0.194:5005/api/1.0/dashboard/devices';
    const response = await axios.get(url);
    const a = this.state.selectValue;
    console.log(a);

    console.log(response.data);

    this.setState({ sensorReadingOne: response.data, loading: true });
  }

  fetchDevices = () => {
    fetch('http://192.168.0.194:5005/api/1.0/dashboard/devices')
      .then((response) => response.json())
      .then((devicelist) => {
        if (devicelist.status === 204) {
          alert('No content');
        }
        this.setState({ sensorReadingOne: devicelist, loading: true });
      },
      (error) => {
        this.handleError(error);
        return error;
      });
  }

  handleChecked() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  async handleDropdownChange(e) {
    try {
      setInterval(async () => {
        const selectValue = e.target.value;
        this.setState({ selectValue });
        console.log(this.state.selectValue);

        const res = await axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/devices/${selectValue}/sensors/latest`);
        const { data } = res;

        console.log(data);

        this.setState({ sensorReadingTwo: res.data.latestSensorData, loading: true });
      }, 500);
    } catch (a) {
      console.log(a);
    }
  }

  clearInterval = () => {
    this.clearInterval(this.interval);
  }

  async handlePlotdata(e) {
    this.state.Deviceid = [this.state.selectValue];
    console.log(this.state.Deviceid);
    const { Storesensor } = this.state;
    Storesensor.push(this.state.addedProducts);
    this.setState({ Storesensor });
    Storesensor.map((ms) => {
      console.log(ms);
      this.state.Storesensor = ms;
    });
    const ress = await axios.all(this.state.Storesensor.map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/${this.state.Deviceid}/sensors/${u.substring(1, 5)}/readings?start=${this.state.date}T${this.state.startTime}:00&end=${this.state.date}T${this.state.endTime}:00`)));

    const { data } = ress;
    console.log(ress);
    console.log(ress.data);

    for (let i = 0; i < ress.length; i++) {
      i; // is the index

      if (ress.length == 1) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
      } else if (ress.length == 2) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
      } else if (ress.length == 3) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
      } else if (ress.length == 4) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
        this.setState({ sReadingOne: ress[3].data, loading: true });
      } else if (ress.length == 5) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
        this.setState({ sReadingOne: ress[3].data, loading: true });
        this.setState({ sReadingTwo: ress[4].data, loading: true });
      } else if (ress.length == 6) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
        this.setState({ sReadingOne: ress[3].data, loading: true });
        this.setState({ sReadingTwo: ress[4].data, loading: true });
        this.setState({ sReadingThree: ress[5].data, loading: true });
      } else if (ress.length == 7) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
        this.setState({ sReadingOne: ress[3].data, loading: true });
        this.setState({ sReadingTwo: ress[4].data, loading: true });
        this.setState({ sReadingThree: ress[5].data, loading: true });
        this.setState({ sReadingFour: ress[6].data, loading: true });
      } else if (ress.length == 8) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
        this.setState({ sReadingOne: ress[3].data, loading: true });
        this.setState({ sReadingTwo: ress[4].data, loading: true });
        this.setState({ sReadingThree: ress[5].data, loading: true });
        this.setState({ sReadingFour: ress[6].data, loading: true });
        this.setState({ sReadingFive: ress[7].data, loading: true });
      } else if (ress.length == 9) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
        this.setState({ sReadingOne: ress[3].data, loading: true });
        this.setState({ sReadingTwo: ress[4].data, loading: true });
        this.setState({ sReadingThree: ress[5].data, loading: true });
        this.setState({ sReadingFour: ress[6].data, loading: true });
        this.setState({ sReadingFive: ress[7].data, loading: true });
        this.setState({ sReadingSix: ress[8].data, loading: true });
      } else if (ress.length == 10) {
        this.setState({ sensorReadingOneTwo: ress[0].data, loading: true });
        this.setState({ sensorReadOneTwo: ress[1].data, loading: true });
        this.setState({ sReadingOneTwo: ress[2].data, loading: true });
        this.setState({ sReadingOne: ress[3].data, loading: true });
        this.setState({ sReadingTwo: ress[4].data, loading: true });
        this.setState({ sReadingThree: ress[5].data, loading: true });
        this.setState({ sReadingFour: ress[6].data, loading: true });
        this.setState({ sReadingFive: ress[7].data, loading: true });
        this.setState({ sReadingSix: ress[8].data, loading: true });
        this.setState({ sReadingSeven: ress[9].data, loading: true });
      }

      var converter = require('hex2dec');

      let dec = converter.hexToDec('0xFA');
      console.log(dec);

      console.log(ress.length);

      const getdata1 = this.state.sensorReadingOneTwo;
      const getdata2 = this.state.sensorReadOneTwo;
      const getdata3 = this.state.sReadingOneTwo;
      const getdata4 = this.state.sReadingOne;
      const getdata5 = this.state.sReadingTwo;
      const getdata6 = this.state.sReadingThree;
      const getdata7 = this.state.sReadingFour;
      const getdata8 = this.state.sReadingFive;
      const getdata9 = this.state.sReadingSix;
      const getdata10 = this.state.sReadingSeven;

      const time = [];
      const sid = [];
      const deci = [];

      const time1 = [];
      const sid1 = [];
      const deci1 = [];

      const time2 = [];
      const sid2 = [];
      const deci2 = [];

      const time3 = [];
      const deci3 = [];

      const time4 = [];
      const deci4 = [];

      const time5 = [];
      const deci5 = [];

      const time6 = [];
      const deci6 = [];

      const time7 = [];
      const deci7 = [];

      const time8 = [];
      const deci8 = [];

      const time9 = [];
      const deci9 = [];

      getdata1.forEach((record) => {
        time.push(`${record.timestamp.slice(record.timestamp.length - 14)}`);
        sid.push(record.value);
        deci.push(`${converter.hexToDec(record.value)}`);
      });
      getdata2.forEach((record) => {
        time1.push(record.timestamp.slice(record.timestamp.length - 14));
        sid1.push(record.value);
        deci1.push(converter.hexToDec(record.value));
      });
      getdata3.forEach((record) => {
        time2.push(record.timestamp.slice(record.timestamp.length - 14));
        sid2.push(record.value);
        deci2.push(converter.hexToDec(record.value));
      });
      getdata4.forEach((record) => {
        time3.push(record.timestamp.slice(record.timestamp.length - 14));
        sid.push(record.value);
        deci3.push(converter.hexToDec(record.value));
      });
      getdata5.forEach((record) => {
        time4.push(record.timestamp.slice(record.timestamp.length - 14));
        sid.push(record.value);
        deci4.push(converter.hexToDec(record.value));
      });
      getdata6.forEach((record) => {
        time5.push(record.timestamp.slice(record.timestamp.length - 14));
        sid.push(record.value);
        deci5.push(converter.hexToDec(record.value));
      });
      getdata7.forEach((record) => {
        time6.push(record.timestamp.slice(record.timestamp.length - 14));
        sid.push(record.value);
        deci6.push(converter.hexToDec(record.value));
      });
      getdata8.forEach((record) => {
        time7.push(record.timestamp.slice(record.timestamp.length - 14));
        sid.push(record.value);
        deci7.push(converter.hexToDec(record.value));
      });
      getdata9.forEach((record) => {
        time8.push(record.timestamp.slice(record.timestamp.length - 14));
        sid.push(record.value);
        deci8.push(converter.hexToDec(record.value));
      });
      getdata10.forEach((record) => {
        time9.push(record.timestamp.slice(record.timestamp.length - 14));
        sid.push(record.value);
        deci9.push(converter.hexToDec(record.value));
      });

      this.state.result = time, time1, time2, time3, time4, time5, time6, time7, time8, time9;
      console.log(this.state.result);
      console.log(deci == time);
      this.setState({
        Data: {

          labels: this.state.result,

          scales: {
            yAxes: [{

              display: true,
            }],
          },

          datasets: [

            {
              label: `Monitoring Value:- ${this.state.addedProducts[0]}`,

              data: deci,

              backgroundColor: 'red',

              width: '50%',
            },

            {
              label: `Monitoring Value:- ${this.state.addedProducts[1]}`,
              data: deci1,
              backgroundColor: 'blue',
              width: '50%',

            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[2]}`,
              data: deci2,
              backgroundColor: 'purple',
              width: '50%',

            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[3]}`,
              data: deci3,
              backgroundColor: 'green',
              width: '50%',

            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[4]}`,
              data: deci4,
              backgroundColor: 'orange',
              width: '50%',

            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[5]}`,
              data: deci5,
              backgroundColor: 'skyblue',
              width: '50%',

            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[6]}`,
              data: deci6,
              backgroundColor: 'pink',
              width: '50%',

            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[7]}`,
              data: deci7,
              backgroundColor: 'yellow',
              width: '50%',

            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[8]}`,
              data: deci8,
              backgroundColor: 'gray',

              width: '50%',
            },
            {
              label: `Monitoring Value:- ${this.state.addedProducts[9]}`,
              data: deci9,
              backgroundColor: 'red',
              width: '50%',

            },

          ],

        },
      });
    }

    this.setState({ plotData: ` ${this.state.addedProducts} ${this.state.date}` });
  }

  handleButton(e) {
    this.setState({ selectButton: `${this.state.date}             ST        ${this.state.startTime}            ET         ${this.state.endTime}` });

    console.log(this.state.selectButton);
  }

  onAddingItem = (item) => {
    const isChecked = item.target.checked;
    const { value } = item.target;

    this.setState((prevState) => ({ sensorReadingTwo: prevState.sensorReadingTwo.map((product) => (product.sensorId === value ? { ...product, isAdded: isChecked } : product)) }));

    if (isChecked) this.setState((prevState) => ({ addedProducts: [...prevState.addedProducts, value] }));
    else {
      const newAddedProducts = this.state.addedProducts.filter((product) => product !== value);

      this.setState({ addedProducts: newAddedProducts });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      console.log(this.state.date);
      console.log(this.state.startTime);
      console.log(this.state.endTime);
    }
  }

  onSubmitTwo = (e) => {
    e.preventDefault();
    if (this.validate()) {
      console.log(this.state.selectxaxis);
      console.log(this.state.selectyaxis);
    }
  }

  validate() {
    const errors = {};
    let isValid = true;

    if (!this.state.date) {
      isValid = false;
      errors.date = 'Please select date';
    }

    if (!this.state.startTime) {
      isValid = false;
      errors.startTime = 'Please select start time';
    }

    if (!this.state.endTime) {
      isValid = false;
      errors.endTime = 'Please select end time';
    }

    if (!this.state.selectxaxis) {
      isValid = false;
      errors.selectxaxis = 'Please select X axis data';
    }

    if (!this.state.selectyaxis) {
      isValid = false;
      errors.selectyaxis = 'Please select Y axis data';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  render() {
    const { selectValue } = this.state;
    const rowss = [];

    let txt4;
    txt4 = this.state.date;

    let txt5;
    txt5 = this.state.startTime;

    let txt6;
    txt6 = this.state.endTime;

    let txt7;
    txt7 = this.state.factoryDeviceId;

    let txt9;
    txt9 = this.state.sensorId;

    let txt10;

    const columns = [

      { field: 'id', headerName: 'ID', width: 250 },
      { field: 'sensorId', headerName: 'Sensor Id', width: 170 },
      { field: 'timestamp', headerName: 'Time Stamp', width: 250 },
      { field: 'value', headerName: 'Value', width: 170 },

    ];

    // for paper grid
    const row = [];
    this.state.sensorReadingTwo.map((it) => {
      row.push({
        id: it.id,
        timestamp: it.timestamp,
        rawValue: it.rawValue,
        unit: it.unit,
        name: it.name,

      });
    });

    const values = {
      someDate: '2017-08-07',
      startTime: '12:30',
      endTime: '15:30',
    };

    const { date, startTime, endTime } = this.state;

    return (

      <div style={{ flexGrow: 4, paddingLeft: '2%' }}>

        <div style={{ paddingBottom: '0%', marginTop: '7%' }}>
          <Typography variant="h4" noWrap component="div">
            Equipment-Wise Raw & Calculated Dashboard
          </Typography>
        </div>

        <div>
          <form>
            <div className="form-group col-4">
              <label>Select Equipment</label>

              <select style={{ width: 300, height: 37 }} onChange={this.handleDropdownChange} onClick={this.fetchDevices}>
                <option value="" />
                {this.state.sensorReadingOne.map((fid, i) => <option style={{ width: 300, height: 37 }} key={i} value={fid.id}>{fid.deviceName}</option>)}
              </select>

            </div>
          </form>
        </div>

        {' '}

        <div
          key={row.id}
          className="container px-3 py-3"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            paddingLeft: '5%',
            paddingTop: '0%',
          }}
        >

          {this.state.sensorReadingTwo.map((readings, i) => (
            <div
              key={readings.id}
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
                            backgroundColor: '#43a047',
                            height: 110,
                            width: 170,
                            boxShadow: '0px 10px 20px 1px',
                            borderRadius: '12px',
                            margin: '8px',
                            overflow: 'hidden',
                          }}
                        >
                          <div className="checkbox checkbox-circle checkbox-color-scheme">
                            <label className="checkbox-checked">
                              <input
                                type="checkbox"
                                style={{ width: 30, height: 20 }}

                                value={`${readings.id + readings.name}`}
                                checked={this.state.sensorReadingTwo[i].isAdded}
                                onChange={this.onAddingItem}
                              />

                            </label>
                          </div>

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

                              <div key={readings.id}>
                                <h6>

                                  {readings.id}
                                </h6>
                                <h6>

                                  {readings.name}
                                </h6>
                                <h6>

                                  {readings.rawValue}
                                </h6>
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

          ))}

        </div>

        <div style={{ paddingTop: '' }}>
          <form style={{ marginLeft: '2%' }} onSubmit={this.onSubmit}>
            <div className="form-row">

              <div className="form-group col">
                <TextField name="date" label="Date" id="time" InputLabelProps={{ shrink: true, required: true }} type="date" onChange={this.onChange} value={date} defaultValue={values.someDate} />
                <div className="text-danger">
                  {this.state.errors.date}
                </div>
              </div>

              <div className="form-group col">
                <TextField name="startTime" id="time" label="Start Time" type="time" onChange={this.onChange} value={startTime} defaultValue="12:30" InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} style={{ paddingLeft: '5%' }} />
                <div className="text-danger">
                  {this.state.errors.startTime}
                </div>
              </div>

              <div className="form-group col">
                <TextField name="endTime" id="time" label="End Time " type="time" onChange={this.onChange} value={endTime} defaultValue="15:30" InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} style={{ paddingLeft: '5%', paddingRight: '5%' }} />
                <div className="text-danger">
                  {this.state.errors.endTime}
                </div>
              </div>

              <div className="form-group col">
                <Button type="submit" Concat={this.state.date} variant="contained" color="primary" onClick={this.handleButton}>SetDateRange</Button>
              </div>
              <div className="form-group col">
                <ReactHTMLTableToExcel
                  className="btn btn-primary btn-sl active"
                  table="emp-table"
                  filename="Equipment's Data File"
                  sheet="Sheet"
                  buttonText="Export To Excel"
                />

              </div>

            </div>
          </form>
        </div>

        <div style={{ display: 'flex', paddingTop: '5%', margin: '10px' }}>
          <form style={{ paddingLeft: '10px', paddingRight: '20px' }} onSubmit={this.onSubmitTwo}>
            <lable><h5><spam style={{ paddingLeft: '0%' }}>Select X and Y Axis Coordinates:-</spam></h5></lable>

            <lable><h6><spam style={{ paddingLeft: '5%' }}>Select X axis Coordinates:</spam></h6></lable>

            <select name="selectxaxis " type="text" className="form-control" onChange={this.onChange}>

              <option>{this.state.selectButton}</option>
              <div className="text-danger">
                {this.state.errors.selectxaxis}
              </div>

            </select>

            <lable><h6><spam style={{ paddingLeft: '5%' }}>Select Y axis Coordinates:</spam></h6></lable>

            <select name="selectyaxis " type="text" className="form-control" onChange={this.onChange}>
              {this.state.addedProducts.map((index, i) => (

                <option key={i + 1} value={this.state.addedProducts[i].substring(1, 1000)}>{this.state.addedProducts[i].substring(1, 5)}</option>

              ))}

              <div className="text-danger">
                {this.state.errors.selectyaxis}
              </div>

            </select>
            <Button type="submit" variant="contained" color="primary" onClick={this.handlePlotdata} style={{ paddingLeft: '15px', margin: '3px' }}>PlotData</Button>
          </form>
        </div>

        {(() => {
          if (this.state.plotData === '') {
            return <h1> </h1>;
          }

          return (

            <div className="col-md-12 col-sm-12  redemption-container pd-30-0 bg-gray">
              <h3 className="roboto paragraph mgb-60">Live Sensor Monitoring</h3>
              <div className="row pd-0-30">
                <div className="col-md-11  default-shadow bg-white pd-30-0 border-radius-10 align-center">

                  <Line
                    data={this.state.Data}
                    options={{
                      scales: {
                        yAxes: [{
                          scaleLabel: {
                            update: false,
                            display: true,
                            labelString: 'probability',
                          },
                        }],
                      },
                      animation: {
                        duration: 0,
                      },
                      title: {
                        text: 'Total Check-ins',
                        fontSize: 20,
                        display: true,
                      },
                      legend: {
                        display: true,
                        position: 'top',
                      },

                    }}
                  />

                </div>

              </div>
            </div>

          );
        })()}

        {(() => {
          if (this.state.plotData === '') {
            return <h1> </h1>;
          }

          return (

            <div style={{ paddingTop: '5%', margin: '10px' }}>
              <form noValidate autoComplete="off" style={{ paddingLeft: '10px', paddingRight: '20px' }}>
                <lable><h5><spam>Detailed Info Table</spam></h5></lable>

                <section className="py-4 container">
                  <div className="row justify-content-center">
                    <table className="table table-striped" id="emp-table" style={{ borderWidth: '1px', borderColor: '#aaaaaa', borderStyle: 'solid' }}>
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">SensorId</th>
                          <th scope="col">TimeStamp</th>
                          <th scope="col">Value</th>

                        </tr>
                      </thead>
                      {

                    this.state.sensorReadingOneTwo.map((dynamicData) => (

                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sensorReadOneTwo.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingOneTwo.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingOne.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingTwo.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingThree.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingFour.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingFive.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingSix.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }
                      {

                    this.state.sReadingSeven.map((dynamicData) => (
                      <tr>
                        <td>
                          {' '}
                          {dynamicData.sensorId}
                          {' '}

                        </td>
                        <td>
                          {' '}
                          {dynamicData.timestamp}
                          {' '}
                        </td>
                        <td>
                          {' '}
                          {this.state.converterhd.hexToDec(dynamicData.value)}
                          {' '}
                        </td>

                      </tr>
                    ))
                  }

                    </table>
                  </div>
                </section>

              </form>

            </div>

          );
        })()}

      </div>

    );
  }
}
export default Test;
