/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import axios from 'axios';
import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { withRouter } from 'react-router-dom';

export class ProductionAlertDonut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // productionAlert: [],
      productionAlertCount: 0,
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
    this.setState({ productionAlertCount: responseDataObject.Production });
  };

  render() {
    const { history } = this.props;
    return (
      <>

        <Chart
          type="donut"
          width={230}
          height={230}
          series={[this.state.productionAlertCount]}
          // series={[1]}
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
            chart: {
              events: {
                dataPointSelection(event, chartContext, config) {
                  const type = config.w.config.labels[config.dataPointIndex];
                  history.push(`/alert_summary/ProductionAlertsDevices/${type}`);
                },
              },
            },
            legend: {
              show: false,
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
            dataLabels: {
              style: {
                fontSize: '8px',
                colors: ['black'],
              },
              enabled: true,
            },
            labels: ['Production', 'Alerts'],
            style: {
              fontSize: '4px',
              color: 'black',
            },
            title: { text: 'Production Alert', align: 'centre' },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    color: 'black',
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

export default withRouter(ProductionAlertDonut);
