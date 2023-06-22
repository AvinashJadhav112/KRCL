/* eslint-disable react/prop-types */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable block-scoped-var */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from 'react-apexcharts';

export class ProductionDynamicLineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: [
        {
          name: 'Production Alerts',
          data: [],
        },
      ],
      option: {
        title: { text: 'Production alerts in last 30 days' },

        xaxis: {

          // categories:[],
        },
        yaxis: {
          // title:{text:"Product in K"}
        },
        grid: {
          show: false,
        },
        // stroke: {
        //     curve: 'stepline',
        //   },
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
    const data = this.props.AlertData.map((productionAlert) => productionAlert.data.Production);
    this.setState({ product: [{ name: 'Production', data }] });
    this.setState({ xaxislabel: this.props.dates });
    this.setState({
      option: {
        title: { text: 'Production alerts in last 30 days' },
        xaxis: {

          categories: this.state.xaxislabel,
        },
        yaxis: {
          // title:{text:"Product in K"}
        },
        grid: {
          show: false,
        },
        // stroke: {
        //     curve: 'stepline',
        //   },
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
        colors: ['#9D00FF'],
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

export default ProductionDynamicLineChart;
