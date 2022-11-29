import React from 'react';
import { LineChart } from 'react-chartkick';
import 'chart.js'

class ReactChartKick extends React.Component {
    render() {
        return (
            <div className="reactchartkick">
                <h1>React Chart Kick</h1>
                <a href="https://github.com/ankane/react-chartkick">url</a>
                <LineChart data={{ "2017-01-01": 11, "2017-01-02": 6 }} />                
            </div>
        )
    }

}

export default ReactChartKick