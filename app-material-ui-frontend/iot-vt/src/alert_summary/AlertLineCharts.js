/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ConditionDynamicLineChart from './ConditionDynamicLineChart';
import ProductionDynamicLineChart from './ProductionDynamicLineChart';
import ServiceDynamicLineChart from './ServiceDynamicLineChart';
import UtilizationDynamicLineChart from './UtilizationDynamicLineChart';

const useStyles = makeStyles({
  LineChartCSS: {
    border: '1px solid transparent',
    background: '#f0f0f01c',
    boxShadow: '2px 7px 15px 5px #80808033',
    padding: '8px',
    borderRadius: '15px',
  },
});

const AlertLineCharts = () => {
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);
  const classes = useStyles();

  useEffect(async () => {
    const res = getDates();
    res ? setDates(res.trimmed) : '';
    const fetchData = async () => {
      try {
        const companyName = localStorage.getItem('CompanyName');
        const alartDataSet = await Promise.all(
          res.datelist.map(async (dateListData) => {
            const alertCount = await axios.get(`http://192.168.0.194:5005/api/1.0/alert/alertType/company/${companyName}/countInBetween?start=${dateListData}T00:00:00Z&end=${dateListData}T23:59:59Z`);
            const dataObject = {
              date: dateListData,
              data: alertCount.data,
            };
            return dataObject;
          }),
        );

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setData(alartDataSet);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getDates = () => {
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
  };
  return (
    <div>
      <Grid container style={{ margin: '8px 0px 0px 14px' }}>

        <Grid container spacing="6px" direction="row" justifyContent="center" alignItems="center">

          <Grid item md={6} sm={12} xs={12} lg={6} xl={6}>
            <div className={classes.LineChartCSS}>
              <UtilizationDynamicLineChart />
            </div>
          </Grid>

          <Grid item md={6} sm={12} xs={12} lg={6} xl={6}>
            <div className={classes.LineChartCSS}>
              { data.length === 0
                ? (
                  <div>

                    <Skeleton variant="rounded" width="100%" height={200} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />

                  </div>
                )
                : <ServiceDynamicLineChart AlertData={data} dates={dates} /> }
            </div>
          </Grid>

        </Grid>

        <Grid container spacing="6px" style={{ margin: '3px 0px 0px -5px' }} direction="row" justifyContent="center" alignItems="center">

          <Grid item md={6} sm={12} xs={12} lg={6} xl={6}>
            <div className={classes.LineChartCSS}>
              { data.length === 0
                ? (
                  <div>

                    <Skeleton variant="rounded" width="100%" height={200} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />

                  </div>
                )
                : <ConditionDynamicLineChart AlertData={data} dates={dates} /> }
            </div>

          </Grid>

          <Grid item md={6} sm={12} xs={12} lg={6} xl={6}>
            <div className={classes.LineChartCSS}>
              { data.length === 0
                ? (
                  <div>

                    <Skeleton variant="rounded" width="100%" height={200} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />

                  </div>
                )
                : <ProductionDynamicLineChart AlertData={data} dates={dates} /> }
            </div>

          </Grid>

        </Grid>

      </Grid>

    </div>
  );
};

export default AlertLineCharts;
