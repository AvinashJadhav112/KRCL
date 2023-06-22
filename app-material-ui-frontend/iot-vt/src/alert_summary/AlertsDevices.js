/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-alert */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './alertdevices.css';
import axios from 'axios';

export class AlertsDevices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      filteredData: [],
      filteredIds: [],
      AlertFiltered: [],
      dateback24: '',
      currentDate: '',
      newData: [],
      type: '',
    };
  }

  async componentDidMount() {
    const AlertType = window.location.href.split('/')[6];
    const CompanyName = localStorage.getItem('CompanyName');
    this.setState({ type: AlertType });
    this.setState({ loading: true }, async () => {
      const url = 'http://192.168.0.194:5005/api/1.0/devices';
      const resp = await axios.get(url);
      const response = resp.data;
      // console.log(response)
      if (response.status === 500) {
        alert('Internal server error');
      }

      const filtered = response.filter((dt) => dt.companyName === `${CompanyName}`);
      this.setState({ filteredData: filtered });
      // console.log(this.state.filteredData);
      const result = this.state.filteredData.map((id) => id.id);
      this.setState({ filteredIds: result });

      const date = new Date();
      const locDate = date.toISOString().split('T')[0];
      this.setState({ currentDate: locDate });
      //  console.log(this.state.currentDate)

      const last24Date = new Date(new Date().setDate(date.getDate() - 1));
      this.setState({ dateback24: last24Date.toISOString().split('T')[0] });

      const AlertsResult = await axios.all(this.state.filteredIds.map((id) => axios.get(`http://192.168.0.194:5005/api/1.0/alert/alertCount/${id}?start=${this.state.dateback24}T00:00:00Z&end=${this.state.currentDate}T23:59:59Z`)));
      this.setState({ AlertFiltered: AlertsResult.map((data) => data.data) });
      // console.log(this.state.AlertFiltered)
    });
  }

  render() {
    return (
      <div style={{
        flexGrow: 4, marginTop: '8%', marginLeft: '5%',
      }}
      >
        <div>
          <h3 style={{ margin: '0 0 2% 2%' }}>Alert Counts in Last 24 hrs with respect to Devices:</h3>
          {/* {loadingData ? <LoadingSpinner /> : <h5 />} */}
        </div>
        <div className="row">

          {

                    this.state.AlertFiltered.map((devices) => (

                      <div className="col-md-4 col-xl-3">
                        <div className="solution_card">
                          <div className="hover_color_bubble" />

                          <div className="solu_title">
                            <h3>{devices.DeviceName}</h3>
                          </div>
                          <div className="solu_description">

                            {/* <h4>Alert Counts in Last 24 hrs</h4> */}

                            <h4>
                              {this.state.type}
                              {' '}
                              Alerts:
                              {devices[this.state.type]}
                            </h4>

                            <button type="button" className="read_more_bn"><Link style={{ textDecoration: 'none' }} className="link" to={`/alert_summary/AlertsDataTable/${devices.DeviceId}/${this.state.type}`}>More Details</Link></button>
                          </div>
                        </div>
                      </div>

                    ))

              }

        </div>
      </div>
    );
  }
}

export default withRouter(AlertsDevices);
