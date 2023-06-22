/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import axios from 'axios';
import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { withRouter } from 'react-router-dom';

export class ConditionAlertDonut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // conditionAlert: [],
      conditionAlertCount: 0,
    };
  }

  async componentDidMount() {
    this.filterDataOfAlerts();
  }

  filterDataOfAlerts = async () => {
    const date = new Date();
    const locDate = date.toISOString().split('T')[0];

    const last24Date = new Date(new Date().setDate(date.getDate()));
    const dateback24 = last24Date.toISOString().split('T')[0];
    const responseOfAlertAPI = await axios.get(
      `http://192.168.0.194:5005/api/1.0/alert/alertType/countInBetween?start=${dateback24}T00:00:00Z&end=${locDate}T23:59:59Z`,
    );

    const responseDataObject = await responseOfAlertAPI.data;
    this.setState({ conditionAlertCount: responseDataObject.Condition });
  };

  render() {
    const { history } = this.props;
    return (
      <>
        <Chart
          type="donut"
          width={230}
          height={230}
          series={[this.state.conditionAlertCount]}
          // series={[2]}
          // sum={sum}
          options={{
            responsive: [
              {
                breakpoint: 1360,
                options: {
                  chart: {
                    width: '78%',
                    height: '78%',
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
            legend: {
              show: false,
            },
            chart: {
              events: {
                dataPointSelection(event, chartContext, config) {
                  const type = config.w.config.labels[config.dataPointIndex];
                  history.push(`/alert_summary/ConditionAlertsDevices/${type}`);
                },
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
            dataLabels: {
              style: {
                colors: ['black'],
              },
              enabled: true,
            },
            labels: ['Condition', 'Alerts'],
            style: {
              fontSize: '4px',
              color: 'black',
            },
            title: { text: 'Condition Alerts', align: 'centre' },
            plotOptions: {
              pie: {
                donut: {
                  size: '65%',
                  expandOnClick: true,
                  labels: {
                    show: true,
                    // Service_Alerts: {
                    //   show: true,
                    //   fontSize: 30,
                    //   // color: '#f90000',
                    // },
                  },
                },
              },
            },
          }}
        />
      </>
    );
  }
}

export default withRouter(ConditionAlertDonut);
