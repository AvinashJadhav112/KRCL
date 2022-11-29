import React from 'react';
import Chart from "react-google-charts";
import axios from 'axios';
// import * as apiCalls from '../api/apiCalls'


class ReactGoogleCharts extends React.Component {
    render() {
        let responseData = [['timestamp', 'reading']]
        // const response = apiCalls.getData()
        // console.log(response)
        // axios.get(`/api/sample`).then(function (response) {
        axios.get('/api/alpha/device/0102030405060708090A0B0C0D0E0F10/sensor/001C/day/2020-12-30/readings')
        .then(function (response) {
            var i;
            for (i = 0; i < response.data.length; i++) {
                const intval = parseInt(response.data[i].value, 16)
                
                const formattedTime = response.data[i].timestamp.match(/\d\d:\d\d:\d\d/) 
                const time = formattedTime[0]
                const hour = time.substring(0, 2) 
                const min = time.substring(3, 5)
                const sec = time.substring(6, 8)
                // console.log(time.substring(6, 8))
                // const newItem = {
                //     timestamp: response.data[i].timestamp,                   
                //     reading: intval,
                // }
                var newItem = [[hour, min, sec], intval]
                responseData.push(newItem)
                // console.log(time)
            }
            console.log(responseData)
        })
        .catch((error) => {
            
        }) ;   
        // const data=[
        //     [
        //         {type: "timeofday", label: "Time"},
        //         {type: "number", label: "Reading"}
        //     ],
        //     [[12,15,23], 3715],
        //     [[12,15,48], 3812],
        //     [[12,15,56], 3717],
        //     [[12,18,29], 3904],
        //     [[12,19,36], 3912],
        //   ]

        return (
            <div className="reactgooglecharts">
                <h1>React Google Chart</h1>
                <a href="https://react-google-charts.com/line-chart">url</a>
                <Chart
                    width={'1200px'}
                    height={'400px'}
                    chartType="ScatterChart"
                    loader={<div>Loading Chart</div>}
                    // rows={[[[12,15,23], 3715], [[12,15,48], 3812], [[12,15,56], 3717], [[12,18,29], 3904], [[12,19,36], 3912]]}
                    // columns={[
                    //   {
                    //     type: "timeofday",
                    //     label: "Time"
                    //   },
                    //   {
                    //     type: "number",
                    //     label: "Reading"
                    //   }
                    // ]}
                    data={responseData}
                    // data={data}
                    options={{
                        hAxis: {
                            title: 'Time',
                        },
                        vAxis: {
                            title: 'Value',
                        },
                        // series: {
                        //     1: { curveType: 'function' },
                        // },
                    }}
                    rootProps={{ 'data-testid': '2' }}
                />

            </div>
        )
    }
}

export default ReactGoogleCharts
