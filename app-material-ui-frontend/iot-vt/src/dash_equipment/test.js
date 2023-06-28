/* eslint-disable react/jsx-indent */
/* eslint-disable no-inner-declarations */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-alert */
/* eslint-disable no-empty */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-return-assign */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-sequences */
/* eslint-disable no-loop-func */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  DataGrid, GridToolbarExport,
} from '@mui/x-data-grid';
import uuid from 'react-uuid';
import LoadingSpinner from '../components/loadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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

class EquipmentWise extends React.Component {
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
      plotGraph: '',
      plotDataid: '',
      Data: [{}],
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
      result2: [],
      selectXAxisData: '',
      selectYAxisData: '',
      selectedXsensorData: '',
      selectedYsensorData: '',
      storeSelectedSensor: {},
      selectedXaxisValidation: '',
      selectedYaxisValidation: '',

      selectedSensorsData: '',
      loadingData: false,
      loadingGraph: false,

      selectxaxis: '',
      selectyaxis: '',

      xAxis: [],
      yAxis: [],
      y1Axis: [],

      dataSets: [{}],
      colors: [],
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.handlePlotdata = this.handlePlotdata.bind(this);
    this.handlePlotGraph = this.handlePlotGraph.bind(this);
  }

  async componentDidMount() {
    const url = 'http://192.168.0.194:5005/api/1.0/dashboard/devices';
    const response = await axios.get(url);
    const a = this.state.selectValue;

    this.setState({ sensorReadingOne: response.data, loading: true });
    (error) => {
      this.handleError(error);
      return error;
    };
  }

  fetchDevices = () => {
    fetch('http://192.168.0.194:5005/api/1.0/dashboard/devices')
      .then((response) => response.json())
      .then((devicelist) => {
        this.setState({ sensorReadingOne: devicelist, loading: true });
      });
  }

  handleChecked() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  async handleDropdownChange(e) {
    try {
      const selectValue = e.target.value;
      this.setState({ selectValue });
      const res = await axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/devices/${selectValue}/sensors/latest/calculated`);
      this.setState({ sensorReadingTwo: res.data.latestSensorData, loading: true });
    } catch (a) {
      console.log(a);
    }
  }

  clearInterval = () => {
    this.clearInterval(this.interval);
  }

  async handlePlotdata(e) {
    this.setState({ loadingData: true }, async () => {
      this.state.Deviceid = [this.state.selectValue];
      const { Storesensor } = this.state;
      Storesensor.push(this.state.addedProducts);
      this.setState({ Storesensor });
      Storesensor.map((ms) => {
        this.state.Storesensor = ms;
      });
      let store = [];
      Storesensor[0].map((value) => {
        let unit = value.split(/(\s+)/);
        store.push(unit.pop());
      });
      console.log(store);

      store.map((value) => {
        if (value === 'Hz') {
          console.log('Kiran');
          this.state.isDataSplit = true;
        } else {
          this.state.isDataSplit = false;
        }
      });
      console.log(this.state.isDataSplit);
      if (this.state.isDataSplit) {
        const result = await axios.all(this.state.Storesensor.map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/${this.state.Deviceid}/sensors/${u.substring(1, 5)}/readings?start=${this.state.date}T${this.state.startTime}:00&end=${this.state.date}T${this.state.endTime}:00`)));
        this.setState({ loadingData: false });
        const sensorData = result[0].data;
        this.setState({ sensorData });
        console.log(sensorData);
        const timeStamp = sensorData.map((element) => element.timestamp.slice(0, 19));
        console.log(timeStamp);
        function getUnique(array) {
          var uniqueArray = [];

          for (let i = 0; i < array.length; i++) {
            if (uniqueArray.indexOf(array[i]) === -1) {
              uniqueArray.push(array[i]);
            }
          }
          return uniqueArray;
        }

        const uniqueTimeStamp = getUnique(timeStamp);
        console.log(uniqueTimeStamp);

        let valuesForTimeStamp = [];
        for (let i = 0; i < uniqueTimeStamp.length; i++) {
          valuesForTimeStamp[i] = sensorData.filter((element) => {
            if (element.timestamp.slice(0, 19) === uniqueTimeStamp[i]) {
              return element;
            }
          });
        }
        console.log(valuesForTimeStamp);
        let amplitude = [];

        valuesForTimeStamp.map((element, index) => {
          amplitude[index] = element.map((data) => parseInt(data.value.slice(2, 4), 16));
        });

        let valuesForFrequency = [];
        let frequencyData = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D', '0E', '0F', '10'];
        for (let i = 0; i < frequencyData.length; i++) {
          valuesForFrequency[i] = sensorData.filter((element) => {
            let { value } = element;
            if (value.slice(0, 2) === frequencyData[i]) {
              return element;
            }
          });
        }
        console.log(valuesForFrequency[0]);

        let uniqueValuesForFrequency = [];
        for (let i = 0; i < frequencyData.length; i++) {
          uniqueValuesForFrequency[i] = valuesForFrequency[i].map((element) => parseInt(element.value.slice(2, 4), 16));
          uniqueValuesForFrequency[i] = getUnique(uniqueValuesForFrequency[i]);
        }
        console.log(uniqueValuesForFrequency);

        let maxArrayLength = 0;

        for (let i = 0; i < uniqueValuesForFrequency.length; i++) {
          if (maxArrayLength < uniqueValuesForFrequency[i].length) {
            maxArrayLength = uniqueValuesForFrequency[i].length;
          }
        }

        console.log(maxArrayLength);

        const uniqueFrequency = () => {
          let value = [];
          for (let i = 0; i < uniqueValuesForFrequency.length; i++) {
            value[i] = uniqueValuesForFrequency[i].shift();
          }
          return value;
        };

        let element = [];
        for (let k = 0; k < maxArrayLength; k++) {
          element[k] = uniqueFrequency(k + 1);
        }
        console.log(element);

        let dataSets = [{}];
        let colors = [];
        for (let i = 0; i < element.length; i++) {
          let color = Math.floor((Math.random() * 1000000) + 1);
          colors.push(`#${(`000000${color.toString(16)}`).slice(-6)}`);
          try {
            dataSets[i] = {
              label: `Amplitude${i}`,
              data: element[i],
              backgroundColor: colors[i],

            };
          } catch (error) {
            console.log(error);
          }
        }
        console.log(dataSets);
        // dataSets[1] = {
        //     label: '2nd',
        //     data: '2nd',
        // }
        console.log(dataSets);
        this.setState({ Data: dataSets });
        this.setState({ loadingData: false });
        this.setState({ plotData: `${this.state.addedProducts} ${this.state.date} ` });
      } else {
        const ress = await axios.all(this.state.Storesensor.map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/${this.state.Deviceid}/sensors/${u.substring(1, 5)}/readings?start=${this.state.date}T${this.state.startTime}:00&end=${this.state.date}T${this.state.endTime}:00`)));
        for (let i = 0; i < ress.length; i++) {
          i;

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
        }

        var converter = require('hex2dec');

        const dec = converter.hexToDec('0xFA');

        console.log(this.state.sensorReadingOneTwo);
        console.log(this.state.sensorReadOneTwo);

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
        const sid3 = [];
        const deci3 = [];

        const time4 = [];
        const sid4 = [];
        const deci4 = [];

        const time5 = [];
        const sid5 = [];
        const deci5 = [];

        const time6 = [];
        const sid6 = [];
        const deci6 = [];

        const time7 = [];
        const sid7 = [];
        const deci7 = [];

        const time8 = [];
        const sid8 = [];
        const deci8 = [];

        const time9 = [];
        const sid9 = [];
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
          sid3.push(record.value);
          deci3.push(converter.hexToDec(record.value));
        });
        getdata5.forEach((record) => {
          time4.push(record.timestamp.slice(record.timestamp.length - 14));
          sid4.push(record.value);
          deci4.push(converter.hexToDec(record.value));
        });
        getdata6.forEach((record) => {
          time5.push(record.timestamp.slice(record.timestamp.length - 14));
          sid5.push(record.value);
          deci5.push(converter.hexToDec(record.value));
        });
        getdata7.forEach((record) => {
          time6.push(record.timestamp.slice(record.timestamp.length - 14));
          sid6.push(record.value);
          deci6.push(converter.hexToDec(record.value));
        });
        getdata8.forEach((record) => {
          time7.push(record.timestamp.slice(record.timestamp.length - 14));
          sid7.push(record.value);
          deci7.push(converter.hexToDec(record.value));
        });
        getdata9.forEach((record) => {
          time8.push(record.timestamp.slice(record.timestamp.length - 14));
          sid8.push(record.value);
          deci8.push(converter.hexToDec(record.value));
        });
        getdata10.forEach((record) => {
          time9.push(record.timestamp.slice(record.timestamp.length - 14));
          sid9.push(record.value);
          deci9.push(converter.hexToDec(record.value));
        });
      }
      this.setState({ loadingData: false });
      this.setState({ plotData: ` ${this.state.addedProducts} ${this.state.date}` });
    });
    // }
  }

  async handlePlotGraph(e) {
    if (this.state.isDataSplit) {
      console.log(this.state.dataSets);
      this.setState({ plotGraph: `${this.state.addedProducts} ${this.state.date}` });
    } else {
      this.setState({ loadingGraph: true }, async () => {
        this.state.Deviceid = [this.state.selectValue];
        console.log(this.state.Deviceid);
        console.log(this.state.selectXAxisData.substring(0, 4));
        console.log(this.state.date);
        console.log(this.state.startTime);
        console.log(this.state.endTime);
        const { Storesensor } = this.state;
        Storesensor.push(this.state.addedProducts);
        this.setState({ Storesensor });
        Storesensor.map((ms) => {
          this.state.Storesensor = ms;
        });
        const ress = await axios.all(this.state.Storesensor.map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/${this.state.Deviceid}/sensors/${u.substring(1, 5)}/readings?start=${this.state.date}T${this.state.startTime}:00&end=${this.state.date}T${this.state.endTime}:00`)));
        const resss = await axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/${this.state.Deviceid}/sensors/${this.state.selectXAxisData.substring(0, 4)}/readings?start=${this.state.date}T${this.state.startTime}:00&end=${this.state.date}T${this.state.endTime}:00`);
        const ressss = await axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/${this.state.Deviceid}/sensors/${this.state.selectYAxisData.substring(0, 4)}/readings?start=${this.state.date}T${this.state.startTime}:00&end=${this.state.date}T${this.state.endTime}:00`);
        this.setState({
          selectedXsensorData: resss.data,
        });
        this.setState({ selectedYsensorData: ressss.data });
        for (let i = 0; i < ress.length; i++) {
          i; // i is the index

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
          const dec = converter.hexToDec('0xFA');

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
          const getdata11 = this.state.selectedXsensorData;
          const getdata12 = this.state.selectedYsensorData;

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
          const sid3 = [];
          const deci3 = [];

          const time4 = [];
          const sid4 = [];
          const deci4 = [];

          const time5 = [];
          const sid5 = [];
          const deci5 = [];

          const time6 = [];
          const sid6 = [];
          const deci6 = [];

          const time7 = [];
          const sid7 = [];
          const deci7 = [];

          const time8 = [];
          const sid8 = [];
          const deci8 = [];

          const time9 = [];
          const sid9 = [];
          const deci9 = [];

          const time10 = [];
          const sid10 = [];
          const deci10 = [];

          const time11 = [];
          const sid11 = [];
          const deci11 = [];

          const time12 = [];

          getdata1.forEach((record) => {
            time.push(record.timestamp.slice(record.timestamp.length - 14));
            sid.push(record.value);
            deci.push(converter.hexToDec(record.value));
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
            sid3.push(record.value);
            deci3.push(converter.hexToDec(record.value));
          });
          getdata5.forEach((record) => {
            time4.push(record.timestamp.slice(record.timestamp.length - 14));
            sid4.push(record.value);
            deci4.push(converter.hexToDec(record.value));
          });
          getdata6.forEach((record) => {
            time5.push(record.timestamp.slice(record.timestamp.length - 14));
            sid5.push(record.value);
            deci5.push(converter.hexToDec(record.value));
          });
          getdata7.forEach((record) => {
            time6.push(record.timestamp.slice(record.timestamp.length - 14));
            sid6.push(record.value);
            deci6.push(converter.hexToDec(record.value));
          });
          getdata8.forEach((record) => {
            time7.push(record.timestamp.slice(record.timestamp.length - 14));
            sid7.push(record.value);
            deci7.push(converter.hexToDec(record.value));
          });
          getdata9.forEach((record) => {
            time8.push(record.timestamp.slice(record.timestamp.length - 14));
            sid8.push(record.value);
            deci8.push(converter.hexToDec(record.value));
          });
          getdata10.forEach((record) => {
            time9.push(record.timestamp.slice(record.timestamp.length - 14));
            sid9.push(record.value);
            deci9.push(converter.hexToDec(record.value));
          });

          getdata11.forEach((record) => {
            time10.push(record.timestamp.slice(record.timestamp.length - 14));
            sid10.push(record.value);
            deci10.push(converter.hexToDec(record.value));
          });
          getdata12.forEach((record) => {
            time11.push(record.timestamp.slice(record.timestamp.length - 14));
            sid11.push(record.value);
            deci11.push(converter.hexToDec(record.value));
          });
          getdata11.forEach((record) => {
            time12.push(record.timestamp.slice(record.timestamp.length - 14));
          });

          this.state.result = time10.map((d) => d.slice(7, 9));
          this.state.result2 = time12.map((d) => d);
          this.state.xAxis = deci10;
          console.log(this.state.xAxis);
          this.state.yAxis = deci11;
          this.state.y1Axis = time12;
          this.state.colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#cddc39', '#4caf50'];
          this.setState({
            Data: {
              labels: this.state.y1Axis.map((it) => it),
              datasets: [
                {
                  label: `X Axis:- ${this.state.selectXAxisData.slice(4)} `,
                  data: this.state.xAxis.map((it) => it),
                  backgroundColor: 'red',
                  width: '50%',
                  yAxisID: 'y',
                },

                {
                  label: `Y Axis:- ${this.state.selectYAxisData.slice(4)} `,
                  data: this.state.yAxis.map((it) => it),
                  backgroundColor: 'blue',
                  width: '50%',
                  yAxisID: 'y1',
                },
              ],
            },
          });
        }
        this.setState({ loadingGraph: false });
        this.setState({ plotGraph: ` ${this.state.addedProducts} ${this.state.date}` });
      });
    }
  }

  handleButton(e) {
    this.setState({ selectButton: `${this.state.date}             ST        ${this.state.startTime}            ET         ${this.state.endTime}` });
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

  onDropDownChange = (e) => {
    this.setState({ selectXAxisData: e.target.value });
  }

  onDropDownChangeTwo = (e) => {
    this.setState({ selectYAxisData: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {

    }
  }

  onSubmitTwo = (e) => {
    e.preventDefault();
    // this.handlePlotdata();
    if (this.validate()) {
      // comment
    }
  }

  onSubmitThree = (e) => {
    e.preventDefault();
    this.handlePlotGraph();
    if (this.validate()) {
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

    if (!this.state.selectXAxisData) {
      isValid = false;
      errors.selectXAxisData = 'Please select X axis data';
    }

    if (!this.state.selectYAxisData) {
      isValid = false;
      errors.selectYAxisData = 'Please select Y axis data';
    }

    this.setState({
      errors,
    });

    return isValid;
  }

  handleError(error) {
    if (error.response && error.response.status === 409) {
      alert('Request conflicts');
    } else if (error.response && error.response.status === 400) {
      alert('Bad Request');
    } else if (error.response && error.response.status === 404) {
      alert('Data Not found');
    } else if (error.response && error.response.status === 500) {
      alert('Internal server error');
    } else if (error.response && error.response.status === 403) {
      alert('Request Forbidden');
    }
  }

  render() {
    const { selectValue } = this.state;
    const { loadingData } = this.state;
    const { loadingGraph } = this.state;

    const frequency = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500', '1600'];

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

    const rows = [];
    let columns = [];

    const values = {
      someDate: '2017-08-07',
      startTime: '12:30',
      endTime: '15:30',
    };

    const { date, startTime, endTime } = this.state;

    // start data grid table code

    if (this.state.isDataSplit) {
      columns = [
        {
          field: 'sensorId', headerName: 'Id', width: 100,
        },
        {
          field: 'timestamp', headerName: 'Timestamp', width: 300,
        },
        {
          field: 'frequency', headerName: 'Frequency', width: 200,
        },
        {
          field: 'amplitude', headerName: 'Amplitude', width: 200,
        },
      ];
      if (this.state.sensorData !== null) {
        this.state.sensorData?.map((it) => {
          rows.push(
            {
              id: uuid(),
              sensorId: it.sensorId,
              timestamp: it.timestamp,
              // eslint-disable-next-line radix
              frequency: (parseInt(it.value.slice(0, 2), 16) * 100),
              amplitude: parseInt(it.value.slice(2, 4), 16),
            },
          );
        });
      }
    } else {
      columns = [
        {
          field: 'sensorId', headerName: 'Id', width: 200,
        },
        {
          field: 'timestamp', headerName: 'Timestamp', width: 400,
        },
        {
          field: 'value', headerName: 'Value', width: 400,
        },
      ];

      this.state.sensorReadingOneTwo.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sensorReadOneTwo.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sReadingOneTwo.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sReadingTwo.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sReadingThree.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sReadingFour.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sReadingFive.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sReadingSix.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });

      this.state.sReadingSeven.map((it) => {
        rows.push(
          {
            id: uuid(),
            sensorId: it.sensorId,
            timestamp: it.timestamp,
            value: this.state.converterhd.hexToDec(it.value),
          },
        );
      });
    }
    console.log(rows);
    // end data grid table code

    return (

      <div style={{ marginTop: '8%', marginLeft: '5%' }}>

        <div>
          <Typography variant="h4" noWrap component="div">
            Equipment-Wise Calculated Dashboard
          </Typography>
        </div>
        <div>
          <form style={{ marginTop: '2%' }}>
            <div className="form-group col-4">
              <label htmlFor="device">Select Equipment</label>

              <select style={{ width: 300, height: 37 }} onChange={this.handleDropdownChange} onClick={this.fetchDevices} id="device">
                <option value="" />
                {this.state.sensorReadingOne.map((fid, i) => <option style={{ width: 300, height: 37 }} key={i} value={fid.id}>{fid.deviceName}</option>)}
              </select>

            </div>
          </form>
        </div>

        {' '}

        <div
          key={rows.id}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            paddingLeft: '5%',
            paddingTop: '0%',
          }}
        >

          {this.state.sensorReadingTwo.map((readings, i) => (

            (() => {
              if (readings.id.startsWith('R', 0)) {
                return <h1> </h1>;
              }
              return (

                <div
                  key={readings.id}
                  style={{
                    display: 'flex',
                    marginTop: '1%',
                    marginLeft: '1%',
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
                                height: 100,
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

                                    value={`${`${readings.id + readings.name} ${readings.unit}`}`}
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

                                  {(() => {
                                    if (readings.id.startsWith('R', 0)) {
                                      return <h1> </h1>;
                                    }
                                    return (

                                      <div key={readings.id}>

                                        <b className="text-wrap">
                                          {readings.name}
                                        </b>

                                        <br />

                                        <b>
                                          {readings.rawValue}
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

        <div>
          <form style={{ marginLeft: '1%', marginTop: '2%' }} onSubmit={this.onSubmit}>
            <div className="form-group row">

              <div className="form-group col">
                <TextField name="date" label="Date" id="time" InputLabelProps={{ shrink: true, required: true }} type="date" onChange={this.onChange} value={date} defaultValue={values.someDate} />
                <div className="text-danger">
                  {this.state.errors.date}
                </div>
              </div>

              <div className="form-group col">
                <TextField name="startTime" id="time" label="Start Time" type="time" onChange={this.onChange} value={startTime} defaultValue="12:30" InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} />
                <div className="text-danger">
                  {this.state.errors.startTime}
                </div>
              </div>

              <div className="form-group col">
                <TextField name="endTime" id="time" label="End Time " type="time" onChange={this.onChange} value={endTime} defaultValue="15:30" InputLabelProps={{ shrink: true }} inputProps={{ step: 300 }} />
                <div className="text-danger">
                  {this.state.errors.endTime}
                </div>
              </div>

              <div className="form-group col">
                <Button type="submit" variant="contained" color="primary" onClick={this.handleButton}>SetDateRange</Button>
              </div>

            </div>
          </form>
        </div>

        <div className="form-group col-4">
          <form onSubmit={this.onSubmitTwo}>
            <Button type="submit" variant="contained" color="primary" onClick={this.handlePlotdata} style={{ marginTop: '5%' }}>
              Plot Data
            </Button>
            {loadingData ? <LoadingSpinner /> : <h5 />}
            {
              this.state.isDataSplit ? <></> : (
                <div style={{ marginTop: '5%' }}>
                  <lable><h5><span>Select X and Y Axis Coordinates:-</span></h5></lable>
                  <lable>
                    <h6>
                      <span>
                        Select X axis Data:
                        {this.state.selectButton}
                      </span>
                    </h6>
                  </lable>

                  <select
                    name="selectXAxisData"
                    type="text"
                    className={`form-control
                ${this.state.errors.selectXAxisData ? 'is-invalid' : ''}`}
                    value={this.state.selectXAxisData}
                    onChange={this.onDropDownChange}
                  >
                    <option value="" />
                    {this.state.addedProducts.map((index, i) => (

                      <option key={i + 1} value={this.state.addedProducts[i].substring(1, 100)}>{this.state.addedProducts[i].substring(5, 100)}</option>
                    ))}
                  </select>
                  <div className="text-danger">
                    {this.state.errors.selectXAxisData}
                  </div>

                  <div style={{ marginTop: '5%' }}>
                    <lable><h6><span>Select Y axis data:</span></h6></lable>

                    <select
                      name="selectYAxisData"
                      type="text"
                      className={`form-control
                ${this.state.errors.selectYAxisData ? 'is-invalid' : ''}`}
                      value={this.state.selectYAxisData}
                      onChange={this.onDropDownChangeTwo}
                    >
                      <option value="" />
                      {this.state.addedProducts.map((index, i) => (

                        <option key={i + 1} value={this.state.addedProducts[i].substring(1, 100)}>{this.state.addedProducts[i].substring(5, 100)}</option>
                      ))}
                    </select>
                    <div className="text-danger">
                      {this.state.errors.selectYAxisData}
                    </div>

                  </div>
                </div>
              )
            }

          </form>
        </div>

        <div className="form-group row-4">
          <form onSubmit={this.onSubmitThree}>
            <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '1%' }} onClick={this.handlePlotGraph}>Plot Graph</Button>
            {loadingGraph ? <LoadingSpinner /> : <h5 />}
          </form>
        </div>

        {(() => {
          if (this.state.plotGraph === '') {
            return <h1> </h1>;
          }
          if (this.state.isDataSplit) {
            return (

              <div className="col-md-12 col-sm-12  redemption-container pd-30-0 bg-gray">
                <h3 className="roboto paragraph mgb-60">Live Sensor Monitoring</h3>
                <div className="row pd-0-30">
                  <div className="col-md-11  default-shadow bg-white pd-30-0 border-radius-10 align-center">

                    <Scatter
                      data={{
                        labels: frequency,
                        datasets: this.state.Data,
                      }}
                      width={200}
                      height={500}
                      options={{
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: ' Frequency',
                            },
                          },
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: ' Amplitude',
                            },
                          },
                        },
                      }}
                    />
                  </div>

                </div>
              </div>

            );
          }
          return (
            <div className="col-md-12 col-sm-12  redemption-container pd-30-0 bg-gray">
              <h3 className="roboto paragraph mgb-60">Live Sensor Monitoring</h3>
              <div className="row pd-0-30">
                <div className="col-md-11  default-shadow bg-white pd-30-0 border-radius-10 align-center">

                  <Line
                    data={this.state.Data}
                    options={{
                      responsive: true,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      stacked: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Selected sensors monitoring chart',
                        },
                      },
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: ` ${this.state.selectXAxisData.slice(4)}`,
                          },

                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: ` ${this.state.selectYAxisData.slice(4)}`,
                          },
                        },
                      },
                      animation: {
                        duration: 0,
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
                <lable><h5><span>Detailed Info Table</span></h5></lable>
                selectXAxisData
                <div key={rows.sensorId}>
                  <div style={{ height: 1000, width: '80%' }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={20}
                      components={{ Toolbar: GridToolbarExport }}
                      icon
                      SettingsApplicationsOutlinedIcon
                    />

                    <br />
                  </div>
                </div>

              </form>
            </div>
          );
        })()}

      </div>

    );
  }
}
export default EquipmentWise;
