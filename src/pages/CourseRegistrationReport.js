import React, { Component } from "react";
import queryString from 'query-string';
import { Line } from "react-chartjs-2";
import moment from "moment";

class CourseRegistrationReport extends Component {

  constructor(props) {
    super(props);
    let params = queryString.parse(this.props.location.search);

    this.courseNo = params.courseNo;

    this.state = {};

    this.state.dataLoaded = false;
    this.state.report7Days = [];
    this.state.report30Days = [];
    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    const courseNo = this.courseNo;

    // getCourseRegistrationReport for last 7 days
    global.api.getCourseRegistrationReport(courseNo)
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            report7Days: data.report
          });
          // this.setState({ batchData: data });
        });

    // getCourseRegistrationReport for last 30 days
    global.api.getCourseRegistrationReport(courseNo, 30)
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
              <h1 className="title1 mb25">Course Registration Report</h1>
              <h4 className="title4 mb40">For {this.state.selectedCompanyName} (Last 7 Days)</h4>
              <div id="reports" className="scrollmenu">
                <LineChart
                  label="Course Registrations in Last 7 Days"
                  labels={this.state.report7Days.map(r => moment(r.date).format('DD MMM'))}
                  data={this.state.report7Days.map(r => r.userRegistered)} />
                {/* <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Name</th>
                  <th>UserId</th>
                  <th>Rank</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.leaderboardLoaded ?
                    this.state.leaderboardToday.length > 0 ?
                      this.state.leaderboardToday.map(leaderboard => {
                        return (
                          <tr key={leaderboard.userId}>
                            <td>{leaderboard.FirstName}</td>
                            <td>{leaderboard.userId}</td>
                            <td>{leaderboard.rank}</td>
                            <td>{leaderboard.total}</td>
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
            </table> */}
              </div>
              <br />
              <br />
              <br />
            </div>
            <div className="col-md-6">
              <h1 className="title1 mb25">Course Completion Report</h1>
              <h4 className="title4 mb40">For {this.state.selectedCompanyName} (Last 30 days)</h4>
              <div id="reports" className="scrollmenu">
                <LineChart
                  label="Course Registrations in Last 30 Days"
                  labels={this.state.report30Days.map(r => moment(r.date).format('DD MMM'))}
                  data={this.state.report30Days.map(r => r.userRegistered)} />
                {/* <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Name</th>
                  <th>UserId</th>
                  <th>Rank</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.leaderboardLoaded ?
                    this.state.leaderboard.length > 0 ?
                      this.state.leaderboard.map(leaderboard => {
                        return (
                          <tr key={leaderboard.userId}>
                            <td>{leaderboard.FirstName}</td>
                            <td>{leaderboard.userId}</td>
                            <td>{leaderboard.rank}</td>
                            <td>{leaderboard.total}</td>
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
            </table> */}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

function LineChart({
  label = '# of Votes',
  labels = ['1', '2', '3', '4', '5', '6'],
  data = [12, 19, 3, 5, 2, 3]
}) {
  return (
    <Line data={{
      labels,
      datasets: [
        {
          label,
          data,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    }} options={{
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    }} />
  );
}


export default CourseRegistrationReport;
