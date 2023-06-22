/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable radix */
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

export default class Speedometer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [0],
      options: {
        responsive: [
          {
            breakpoint: 1360,
            options: {
              chart: {
                width: '84%',
                height: '84%',
              },
            },
          },
          {
            breakpoint: 1000,
            options: {
              chart: {
                width: '70%',
                height: '70%',
              },
            },
          },
        ],
        chart: {
          height: 270,
          type: 'radialBar',

        },
        title: { text: 'Utilization', align: 'centre' },
        plotOptions: {
          radialBar: {
            title: 'hii',
            startAngle: -135,
            endAngle: 225,
            offsetY: -4,
            hollow: {
              margin: 0,
              size: '70%',
              background: '#fff',
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: 'front',
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24,
              },
            },
            track: {
              background: '#fff',
              strokeWidth: '67%',
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35,
              },
            },

            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: '#888',
                fontSize: '17px',
              },
              value: {
                formatter(val) {
                  return parseInt(val);
                },
                color: '#111',
                fontSize: '36px',
                show: true,
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        labels: ['Percent'],
      },

    };
  }

  async componentDidMount() {
    try {
      setInterval(
        this.setState(async () => {
          const url = 'http://192.168.0.194:5005/api/1.0/dashboard/devices';
          const response = await axios.get(url);
          const { length } = response.data;
          // console.log(length);

          const ress = await axios.all(response.data.filter((r) => r.id).map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/devices/${u.id}/sensor/000F/latest/calculated`)));
          // console.log(ress[0].data);

          const values = ress.map((data) => (
            data.data.calculateSensorReading
          ));

          const result = values.map((dt) => (
            dt.rawValue
          ));

          const newval = result;

          const initialValue = 0;
          const sumWithInitial = newval.reduce(
            (accumulator, currentValue) =>
              // console.log(accumulator),
              parseFloat(accumulator) + parseFloat(currentValue), initialValue,
          );

          this.setState({ series: [sumWithInitial / length] });
          // console.log(this.state.series);
        }),
        1000,
      );
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (

      <div id="card">
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={260} />
        </div>
      </div>

    );
  }
}
