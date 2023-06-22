/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default */
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@mui/material';

import React from 'react';
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

          <Grid item md={2.4} sm={4}>
            <ServiceAlertDonut />
          </Grid>

          <Grid item md={2.4} sm={4}>
            <ConditionAlertDonut />
          </Grid>

          <Grid item md={2.4} sm={4}>
            <ProductionAlertDonut />
          </Grid>

        </Grid>

      </Grid>

      <AlertLineCharts />
    </div>
  );
};

export default AlertsDonutChart;
