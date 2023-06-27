/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default */
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@mui/material';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryDashboard from '../dash_summary/SummaryDashboard';
import AlertLineCharts from './AlertLineCharts';
import ConditionAlertDonut from './ConditionAlertDonut';
import ProductionAlertDonut from './ProductionAlertDonut';
import ServiceAlertDonut from './ServiceAlertDonut';
import Speedometer from './Speedometer';

const useStyles = makeStyles({

  alertsDonutChart: {
    // paddingLeft: '5%',
    margin: '8px 0px 0px 25px',
    border: '1px solid transparent',
    background: '#f0f0f01c',
    boxShadow: '2px 7px 15px 5px #80808033',
    paddingTop: '1%',
    borderRadius: '20px',
  },
});

const AlertsDonutChart = () => {
  const [alertData, setAlertData] = useState(null);
  useEffect(() => {
    try {
      const getAlerts = async () => {
        const date = new Date();
        const locDate = date.toISOString().split('T')[0];

        const last24Date = new Date(new Date().setDate(date.getDate()));
        const dateback24 = last24Date.toISOString().split('T')[0];
        const companyName = window.localStorage.getItem('CompanyName');

        if (companyName !== null) {
          const result = await axios.get(`http://192.168.0.194:5005/api/1.0/alert/alertType/company/${companyName}/countInBetween?start=${dateback24}T00:00:00Z&end=${locDate}T23:59:59Z`);
          const data = await result.data;
          setAlertData(data);
        }
      };
      getAlerts();
    } catch (error) {
      console.warn('error:', error);
    }
  }, []);

  const classes = useStyles();
  return (

    <div style={{ marginTop: '5%' }}>

      <Grid container direction="row">
        <Grid className={classes.alertsDonutChart} container direction="row">

          <Grid item md={2.4} sm={4}>

            <SummaryDashboard />
          </Grid>

          <Grid item md={2.4} sm={4}>
            <Speedometer />
          </Grid>
          {alertData.length > 0
            ? (
              <Grid item md={2.4} sm={4}>
                <ServiceAlertDonut data={alertData} />
              </Grid>
            ) : ''}

          {alertData.length > 0
            ? (
              <Grid item md={2.4} sm={4}>
                <ConditionAlertDonut data={alertData} />
              </Grid>
            )
            : ''}

          {alertData.length > 0
            ? (
              <Grid item md={2.4} sm={4}>
                <ProductionAlertDonut data={alertData} />
              </Grid>
            )

            : ''}

        </Grid>

      </Grid>

      <AlertLineCharts />
    </div>
  );
};

export default AlertsDonutChart;
