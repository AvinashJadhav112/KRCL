/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Skeleton from '@mui/material/Skeleton';

function summaryDashboard() {
  const history = useHistory();
  const [activityStatus, setActivityStatus] = useState([]);
  const [sum, setSum] = useState();
  const [buttonValueActive, setButtonValueActive] = useState(true);
  const [buttonValueInactive, setButtonValueInactive] = useState(true);

  useEffect(() => {
    getDeviceData();
  }, []);

  const getDeviceData = async () => {
    setInterval(async () => {
      let activeIndex = '';
      let active = 0;
      let inActive = 0;
      const currentdate = new Date();
      const datetime = `${currentdate.getFullYear()}-${(currentdate.getMonth() + 1).toString().padStart(2, '0')
      }-${currentdate.getDate()}T${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}.${currentdate.getMilliseconds()}Z`;
      const response = await axios.get('http://192.168.0.194:5005/api/1.0/dashboard/devices');
      // console.log(response);
      const responseDetail = await axios.all(response.data.map((u) => axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/devices/${u.id}/sensors/latest/calculated`)));
      // console.log(responseDetail);

      responseDetail.map((deviceData) => {
        deviceData.data.latestSensorData.map((latestSensorReading) => {
        // console.log(latestSensorReading);
          activeIndex = deviceData.data.latestSensorData.filter((sensor) => sensor.id === 'C000F');
        });
        // console.log(activeIndex);
        activeIndex.map((sd) => {
          currentdate.getDate() == sd.timestamp.substring(8, 10) && currentdate.getHours() == sd.timestamp.substring(11, 13) ? sd.timestamp.substring(14, 16) >= currentdate.getMinutes() - 2 ? active += 1 : inActive += 1 : inActive += 1;
        });
      });
      const arr = [];
      arr[0] = active;
      arr[1] = inActive;
      setActivityStatus(arr);
      setSum(arr[0] + arr[1]);
      // console.log(arr);
      if (arr[0] > 0) {
        setButtonValueActive(false);
      }

      if (arr[1] > 0) {
        setButtonValueInactive(false);
      }
    }, 3000);
  };

  return (
    <div>
      <div className="container-fluid ">
        {/* <h3>Device Activity Status</h3> */}
        {activityStatus.length === 0
          ? (
            <div style={{ marginTop: '11%' }}>
              <Skeleton variant="circular" width="90%" height={190} />
            </div>
          )
          : (
            <Chart
              type="donut"
              width={230}
              height={230}
              series={activityStatus}
              sum={sum}
              options={{
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
                legend: {
                  show: false,
                },
                chart: {
                  events: {
                    dataPointSelection(event, chartContext, config, selectedDataPoints) {
                      if (config.w.config.labels[config.dataPointIndex] === 'Inactive') {
                        history.push('/dash_summary/Inactivedevices.js');
                      } else {
                        history.push('/dash_summary/ActiveDevices.js');
                      }
                    },
                  },
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.8,
                    opacityTo: 0.9,
                    stops: [0, 90, 100],
                  },
                },
                colors: ['#3fff00', '#ff1900'],
                dataLabels: {
                  style: {
                    colors: ['black'],
                  },
                  enabled: true,
                },
                labels: ['Active', 'Inactive'],
                style: {
                  fontSize: '8px',
                },
                title: { text: 'Device Activity Status', align: 'center' },
                plotOptions: {

                  pie: {
                    expandOnClick: true,
                    donut: {
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          fontSize: 20,
                          // color: '#f90000',
                        },
                      },
                    },
                  },
                },

              }}
            />
          )}

      </div>

    </div>
  );
}

export default summaryDashboard;
