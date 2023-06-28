/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { Component } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  Collapse, List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Select from 'react-select';
import CircularProgress from '@mui/material/CircularProgress';

export class AlertsDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      columns: [
        {
          field: 'id', headerName: 'Sensor Id', width: 300,
        },
        {
          field: 'sensorName', headerName: 'Sensor Name', width: 200,
        },
        {
          field: 'alertType', headerName: 'Alert Type', width: 200,
        },
        {
          field: 'alertDescription', headerName: 'Alert Description', width: 200,
        },
        {
          field: 'alertStatus', headerName: 'Alert Status', width: 200,
        },
        {
          field: 'alertCriticality', headerName: 'Alert Criticality', width: 200,
        },
      ],
      typeOfAlert: '',
      open: false,
      options: [{ value: 'seven', label: 'last 7 days' }, { value: 'fifteen', label: 'last 15 days' }],
      days: '',
      dateback: '',
      final: [],
      localdate: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleOption = this.handleOption.bind(this);
  }

  async componentDidMount() {
    const id = window.location.href.split('/')[6];
    const type = window.location.href.split('/')[7];
    const CompanyName = localStorage.getItem('CompanyName');

    this.setState({ typeOfAlert: type });

    const url = 'http://192.168.0.194:5005/api/1.0/devices';
    const resp = await axios.get(url);
    const response = resp.data;
    // console.log(response)
    if (response.status === 500) {
      alert('Internal server error');
    }

    const filtered = response.filter((dt) => dt.companyName === `${CompanyName}`);
    // console.log(filtered)
    const fil = filtered.filter((it) => (
      it.id === `${id}`
    ));

    const fe = fil.length > 0 && fil.map((at) => (
      at.iotModel.sensors
    ));

    // console.log(fe)
    const final = fe[0].filter((i) => (
      i
    ));
    this.setState({ final });

    // Dates
    const date = new Date();
    const locDate = date.toISOString().split('T')[0];
    this.setState({ localdate: locDate });

    const last24Date = new Date(new Date().setDate(date.getDate() - 1));
    this.setState({ dateback: last24Date.toISOString().split('T')[0] });

    const responseForAlerts = await axios.all(final.map((dat) => axios.get(`http://192.168.0.194:5005/api/1.0/alert/alertType/alertInBetween/${id}/sensor/${dat.id}/${type}?start=${this.state.dateback}T00:00:00Z&end=${locDate}T23:59:59Z`)));
    const res = responseForAlerts.map((it) => it.data);
    console.log(res);

    res.map((fil) => (
      fil[this.state.typeOfAlert].length > 0 && fil[this.state.typeOfAlert].map((i) => (
        this.setState({
          rows: [...this.state.rows,
            {
              id: i.sensorId,
              sensorName: i.sensorName,
              alertType: i.alertType.slice(1, -1),
              alertDescription: i.alertDescription,
              alertStatus: i.alertStatus,
              alertCriticality: i.alertCriticality,
            },
          ],
        }, () => { console.log(this.state.rows); })
      ))
    ));
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }

  async handleOption(event) {
    const id = window.location.href.split('/')[6];
    const type = window.location.href.split('/')[7];
    const value = await event.value;
    // this.setState({days:date})
    const date = new Date();
    if (value === 'seven') {
      this.setState({ rows: '' });
      const last24Date = new Date(new Date().setDate(date.getDate() - 7));
      this.setState({ dateback: last24Date.toISOString().split('T')[0] });
      //  console.log(this.state.dateback)

      const responseForAlerts = await axios.all(this.state.final.map((dat) => axios.get(`http://192.168.0.194:5005/api/1.0/alert/alertType/alertInBetween/${id}/sensor/${dat.id}/${type}?start=${this.state.dateback}T00:00:00Z&end=${this.state.localdate}T23:59:59Z`)));
      const res = responseForAlerts.map((it) => it.data);
      // console.log(res)

      res.map((fil) => (
        fil[this.state.typeOfAlert].length > 0 && fil[this.state.typeOfAlert].map((i) => (
          this.setState({
            rows: [...this.state.rows,
              {
                id: i.sensorId,
                sensorName: i.sensorName,
                alertType: i.alertType.slice(1, -1),
                alertDescription: i.alertDescription,
                alertStatus: i.alertStatus,
                alertCriticality: i.alertCriticality,
              },
            ],
          })
        ))
      ));
    } else {
      this.setState({ rows: '' });
      const last24Date = new Date(new Date().setDate(date.getDate() - 15));
      this.setState({ dateback: last24Date.toISOString().split('T')[0] });
      // console.log(this.state.dateback)

      const responseForAlerts = await axios.all(this.state.final.map((dat) => axios.get(`http://192.168.0.194:5005/api/1.0/alert/alertType/alertInBetween/${id}/sensor/${dat.id}/${type}?start=${this.state.dateback}T00:00:00Z&end=${this.state.localdate}T23:59:59Z`)));
      const res = responseForAlerts.map((it) => it.data);
      // console.log(res)

      res.map((fil) => (
        fil[this.state.typeOfAlert].length > 0 && fil[this.state.typeOfAlert].map((i) => (
          this.setState({
            rows: [...this.state.rows,
              {
                id: i.sensorId,
                sensorName: i.sensorName,
                alertType: i.alertType.slice(1, -1),
                alertDescription: i.alertDescription,
                alertStatus: i.alertStatus,
                alertCriticality: i.alertCriticality,
              },
            ],
          })

        ))
      ));
      console.log(this.state.rows);
    }
  }

  render() {
    return (
      <div style={{ margin: '8% 0 0 2%', height: 400, width: '100%' }}>
        <div style={{ marginLeft: '2%', display: 'flex' }}>
          <h2>Filter by Days:</h2>
          <div style={{ width: '30%', paddingLeft: '2%' }}>
            <Select
              options={this.state.options}
              onChange={this.handleOption}
            />
          </div>
        </div>

        {this.state.rows.length === 0
          ? (
            <Box sx={{ display: 'flex', margin: '15% 0 0 50%' }}>
              <CircularProgress />
            </Box>
          )
          : (
            <div style={{ margin: '2% 0 0 2%', height: 500, width: '100%' }}>
              <DataGrid
                rows={this.state.rows}
                columns={this.state.columns}
                pageSize={20}
                components={{ Toolbar: GridToolbar }}
              />
            </div>
          )}

      </div>
    );
  }
}

export default AlertsDataTable;
