import React from 'react';
import axios from 'axios';
import ReactTable from "react-table";
import 'react-table/react-table.css'

class Templates extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sensorReadings: [],
            loading: true,
        }
    }

    async getSensorReadings() {
        const res = await axios.get('/api/1.0/iotModels')
        // console.log(res.data)
        this.setState({
            loading: false,
            sensorReadings: res.data,
        })
        // console.log(this.state.sensorReadings)
    }

    componentDidMount() {
        this.getSensorReadings()
    }

    render() {
        const columns = [{
            Header: 'Sensor ID',
            accessor: 'sensorId',
        }, 
        {
            Header: 'Name',
            accessor: 'name',
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: 'Minimum',
            accessor: 'min',
        },
        {
            Header: 'Maximum',
            accessor: 'max',
        },
        {
            Header: 'Alert Time',
            accessor: 'alertTime',
        },
        {
            Header: 'Formula',
            accessor: 'formula',
            style: { 'whiteSpace': 'unset' }
        }
        ]
        return (
            <div className="container">
                <h1 className="text-center">Templates</h1>
                {this.state.sensorReadings.map((reading, index) => {
                    console.log(reading)
                    console.log(columns)
                    return (
                        //TODO find a good alternative to the key property
                        <div key={index}>
                            <h3>{reading.templateName}</h3>
                            <ReactTable
                                pageSize={reading.sensorTemplates.length}
                                showPagination={false}
                                data={reading.sensorTemplates}
                                columns={columns}
                            />
                            <br/>
                        </div>

                    )
                })

                }
                {/* <h2>{this.state.templateName}</h2>
                <ReactTable
                    pageSize={this.state.num}
                    showPagination={false}
                    data={this.state.sensorReadings}
                    columns={columns}
                /> */}
            </div>
        )
    }
}

export default Templates;
