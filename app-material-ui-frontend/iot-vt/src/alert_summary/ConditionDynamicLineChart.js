/* eslint-disable react/prop-types */
/* eslint-disable vars-on-top */
/* eslint-disable func-names */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from 'react-apexcharts';

export class ConditionDynamicLineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [
        {
          name: 'Condition Alerts',
          data: [],
        },
      ],
      option: {
        title: { text: 'Condition alerts in last 30 days' },

        xaxis: {

        },
        yaxis: {

        },
        grid: {
          show: false,
        },

        chart: {
          toolbar: {
            show: false,
          },

        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },

      },
      xaxislabel: [],

    };
  }

  async componentDidMount() {
    const data = this.props.AlertData.map((conditionAlert) => conditionAlert.data.Condition);
    this.setState({ product: [{ name: 'Condition', data }] });
    this.setState({ xaxislabel: this.props.dates });
    this.setState({
      option: {
        title: { text: 'Condition alerts in last 30 days' },
        xaxis: {

          categories: this.state.xaxislabel,
        },
        yaxis: {
          // title:{text:"Product in K"}
        },
        grid: {
          show: false,
        },
        chart: {
          toolbar: {
            show: false,
          },

        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
        colors: ['#FFA500'],
        responsive: [
          {
            breakpoint: 1360,
            options: {
              chart: {
                width: '90%',

              },
            },

          },
        ],
      },
    });
  }

  cli() {
    const date = new Date();

    const last30Date = new Date(new Date().setDate(date.getDate() - 29));
    const back30Date = last30Date.toISOString().slice(0, 10);
    const last30Time = new Date(new Date().setHours(0, 0, 0, 0));
    const back30Time = last30Time.toString().slice(16, 21);

    const locDate = date.toISOString().split('T')[0];

    const loctime = new Date(new Date().setHours(23, 59, 59, 999)).toString().slice(16, 21);

    const getDaysArray = function (start, end) {
      for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
      }
      return arr;
    };
    const daylist = getDaysArray(new Date(`${back30Date}`), new Date());
    const datelist = daylist.map((v) => v.toISOString().slice(0, 10));
    const backdate = daylist.map((v) => v);
    const trimmed = backdate.map((resp) => resp.toString().slice(4, 11));

    // console.log(trimmed)
    // console.log(backdat)
    const values = {
      back30Date,
      back30Time,
      locDate,
      loctime,
      datelist,
      trimmed,
    };

    return values;
  }

  render() {
    return (
      <>
        <div className="container-fluid mt-3 mb-3" style={{ background: 'none' }}>

          <Chart
            type="area"
            width={560}
            height={250}
            series={this.state.product}
            options={this.state.option}
          />

        </div>
      </>
    );
  }
}

export default ConditionDynamicLineChart;
