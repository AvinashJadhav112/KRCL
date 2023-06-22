/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Chart from 'react-apexcharts';
// install : npm install react-apexcharts apexcharts//
function UtilizationDynamicLineChart() {
  const [product, setProduct] = useState(
    [
      {
        data: [32, 45, 67, 12, 67, 45, 46, 15, 45, 12, 78, 45],
      },
      {
        data: [56, 14, 26, 97, 45, 15, 87, 32, 84, 96, 70, 20],
      },
      {
        data: [10, 34, 11, 97, 45, 56, 28, 32, 45, 46, 30, 12],
      },
    ],
  );

  const [option, setOption] = useState(
    {
      title: { text: 'Utilization in last 24 hrs' },
      xaxis: {

        categories: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24'],
      },
      grid: {
        show: false,
      },
      chart: {
        toolbar: {
          show: false,
        },

      },
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
  );

  return (
    <>
      <div className="container-fluid mt-3 mb-3" style={{ background: 'none' }}>
        {/* <h2>Line Chart- Using Apexcharts in React</h2>           */}
        <Chart
          type="area"
          width={560}
          height={250}
          series={product}
          options={option}
        />

      </div>
    </>
  );
}

export default UtilizationDynamicLineChart;
