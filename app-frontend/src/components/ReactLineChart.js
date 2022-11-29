import React from 'react';
import LineChart from 'react-linechart';

class ReactLineChart extends React.Component {

    render() {
        const data = [
            {
                color: "steelblue",
                points: [{ x: 1, y: 2 }, { x: 3, y: 5 }, { x: 7, y: -3 }]
            }
        ];

        return (
            <div>
                <div className="react linechart">
                    <h1>React LineChart</h1>
                    <a href="https://www.npmjs.com/package/react-linechart">url</a>
                    <LineChart
                        width={600}
                        height={400}
                        data={data}
                    />
                </div>
            </div>
        );
    }
}

export default ReactLineChart