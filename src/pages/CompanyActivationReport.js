import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";

class CompanyActivationReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {};

    this.state.dataLoaded = false;
    this.state.report7Days = [];
    this.state.report30Days = [];
    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    const companyCode = this.companyCode;

    // getCompanyActivationReport for last 7 days
    global.api.getCompanyActivationReport(companyCode)
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            report7Days: data.report
          });
          // this.setState({ batchData: data });
        });

    // getCompanyActivationReport for last 30 days
    global.api.getCompanyActivationReport(companyCode, 30)
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            report30Days: data.report
          });
          // this.setState({ batchData: data });
        });


  }

  render() {

    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Company Registration Report</h1>
              <h4 className="title4 mb40">For {this.state.selectedCompanyName} (Last 7 Days)</h4>
              <div id="reports" className="scrollmenu">
                <LineChart
                  label1="Company Registrations in Last 7 Days"
                  label2="Company Activation in Last 7 Days"
                  labels={this.state.report7Days.map(r => moment(r.date).format('DD MMM'))}
                  data1={this.state.report7Days.map(r => r.usersRegistered.length)}
                  data2={this.state.report7Days.map(r => r.usersActivate.length)} />
                <table style={{ width: "100%" }}>
                  <thead style={{ textAlign: "left" }}>
                    <tr>
                      <th>Date</th>
                      <th>User Registered</th>
                      <th>User Activated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.dataLoaded ?
                        this.state.report7Days.length > 0 ?
                          this.state.report7Days.map(report => {
                            return (
                              <tr key={report.date}>
                                <td>{moment(report.date).format('DD MMM')}</td>
                                <td>
                                  <div className="registered-user-td">
                                    <span>{report.usersRegistered.length}</span>
                                    <span>
                                      {report.usersRegistered.map(user => (
                                        <span>
                                          {user.FirstName} {user.LastName}
                                        ({user.userId})
                                        </span>
                                      ))}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="registered-user-td">
                                    <span>{report.usersActivate.length}</span>
                                    <span>
                                      {report.usersActivate.map(user => (
                                        <span>
                                          {user.FirstName} {user.LastName}
                                        ({user.userId})
                                        </span>
                                      ))}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          }) : (
                            <tr>
                              <td colSpan="4">No Data Available</td>
                            </tr>
                          )
                        : (
                          <tr>
                            <td colSpan="4">Loading Data</td>
                          </tr>
                        )
                    }
                  </tbody>
                </table>
              </div>
              <br />
              <br />
              <br />
            </div>
            <div className="col-md-6">
              <h1 className="title1 mb25">Company Registration Report</h1>
              <h4 className="title4 mb40">For {this.state.selectedCompanyName} (Last 30 days)</h4>
              <div id="reports" className="scrollmenu">
                <LineChart
                  label1="Company Registrations in Last 30 Days"
                  label2="Company Activation in Last 30 Days"
                  labels={this.state.report30Days.map(r => moment(r.date).format('DD MMM'))}
                  data1={this.state.report30Days.map(r => r.usersRegistered.length)}
                  data2={this.state.report30Days.map(r => r.usersActivate.length)} />
                <table style={{ width: "100%" }}>
                  <thead style={{ textAlign: "left" }}>
                    <tr>
                      <th>Date</th>
                      <th>User Registered</th>
                      <th>User Activated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.dataLoaded ?
                        this.state.report30Days.length > 0 ?
                          this.state.report30Days.map(report => {
                            return (
                              <tr key={report.date}>
                                <td>{moment(report.date).format('DD MMM')}</td>
                                <td>
                                  <div className="registered-user-td">
                                    <span>{report.usersRegistered.length}</span>
                                    <span>
                                      {report.usersRegistered.map(user => (
                                        <span>
                                          {user.FirstName} {user.LastName}
                                        ({user.userId})
                                        </span>
                                      ))}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="registered-user-td">
                                    <span>{report.usersActivate.length}</span>
                                    <span>
                                      {report.usersActivate.map(user => (
                                        <span>
                                          {user.FirstName} {user.LastName}
                                        ({user.userId})
                                        </span>
                                      ))}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          }) : (
                            <tr>
                              <td colSpan="4">No Data Available</td>
                            </tr>
                          )
                        : (
                          <tr>
                            <td colSpan="4">Loading Data</td>
                          </tr>
                        )
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

function LineChart({
  label1 = '# of Votes',
  label2 = '# of Votes',
  labels = ['1', '2', '3', '4', '5', '6'],
  data1 = [12, 19, 3, 5, 2, 3],
  data2 = [12, 19, 3, 5, 2, 3]
}) {
  return (
    <Line data={{
      labels,
      datasets: [
        {
          label: label1,
          data: data1,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'dodgerblue',
        },
        {
          label: label2,
          data: data2,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'purple',
        },
      ],
    }} options={{
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback(label, index, labels) {
                // only show if whole number
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            },
          },
        ],
      },
    }} />
  );
}


export default CompanyActivationReport;
