/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Inactivesensors.css';

import axios from 'axios';

const Inactivesensors = () => {
  const { id } = useParams();

  const [sensorData, setSensorData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [activityStatus, setActivityStatus] = useState(null);

  useEffect(async () => {
    const interval = setInterval(async () => {
      const { data } = await axios.get(`http://192.168.0.194:5005/api/1.0/dashboard/devices/${id}/sensors/latest/calculated`);
      console.log('hii');
      const { latestSensorData } = data;
      setDeviceData(data);
      setSensorData(latestSensorData);
      const sensorTime = await latestSensorData.filter((sensorValue) => sensorValue.id === 'C000F');
      setActivityStatus(sensorTime);
    }, 800);

    return () => clearInterval(interval);
  }, []);
  // console.log(activityStatus)
  return (
    <div style={{ marginTop: '100px', marginLeft: '100px' }}>
      {console.log(activityStatus)}
      <div>
        <h1>{deviceData.deviceName}</h1>
        <h4>Activity status</h4>
        <h4>
          {`Date & Time :
        ${activityStatus === null ? <></> : activityStatus[0].timestamp.slice(0, 10)}
        ${activityStatus === null ? <></> : activityStatus[0].timestamp.slice(11, 19)}`}
        </h4>
      </div>
      <div className="row">
        {
      sensorData.map((values) => {
        let className;

        if (
          Math.round(values.rawValue) >= values.max

         || Math.round(values.rawValue) <= values.min
        ) {
          className = 'cards bg-c-red order-card';
        } else {
          className = 'cards bg-c-green order-card';
        }
        return (
          <div className={className}>
            <div className="card-block">
              <div className="card-details">
                <h5 className="m-b-20">{values.name}</h5>
                <h6 className="m-b-15">{values.rawValue.slice(0, 8)}</h6>
                <h6 className="m-b-15">{values.unit}</h6>
              </div>
            </div>
          </div>
        );
      })
      }
      </div>
    </div>
  );
};

export default Inactivesensors;
