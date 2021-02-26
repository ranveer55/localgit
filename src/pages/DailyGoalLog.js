import React, { Component } from "react";
import queryString from 'query-string';

class DailyGoalLog extends Component {

  constructor(props) {
    super(props);
    let params = queryString.parse(this.props.location.search)

    this.state = {};

    this.state.dailyGoalLogsLoaded = false;
    this.state.dailyGoalLogs = [];
    this.state.userId = params.userId;
    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }
  getDate() {
    var tempDate = new Date();
    var date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    return date;
  }

  componentDidMount() {

    // Get the daily goal log
    global.api.getDailyGoalLog(this.state.userId)
      .then(
        data => {
          console.log({ data })
          this.setState({
            dailyGoalLogs: data.dailyGoalLogs,
            dailyGoalLogsLoaded: true
          })
          // this.setState({ batchData: data });
        });
  }

  render() {

    return (
      <main className="offset" id="content">
        <section className="section_box">
          <h1 className="title1 mb25">Daily Goal Log</h1>
          <h4 className="title4 mb40">For {this.state.userId}</h4>
          <div id="reports" className="scrollmenu">
            <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Points</th>
                  <th>Module No</th>
                  <th>Route No</th>
                  <th>Lesson No</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.dailyGoalLogsLoaded ?
                    this.state.dailyGoalLogs.length > 0 ?
                      this.state.dailyGoalLogs.map(dailyGoalLog => {
                        return (
                          <tr key={dailyGoalLog.id}>
                            <td>{dailyGoalLog.dated}</td>
                            <td>{dailyGoalLog.time}</td>
                            <td>{dailyGoalLog.points}</td>
                            <td>{dailyGoalLog.moduleNo}</td>
                            <td>{dailyGoalLog.routeNo}</td>
                            <td>{dailyGoalLog.lessonNo}</td>
                          </tr>
                        )
                      }) : (
                        <tr>
                          <td colSpan="5">No Data Available</td>
                        </tr>
                      )
                    : (
                      <tr>
                        <td colSpan="5">Loading Data</td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>

        </section>
      </main>
    );
  }
}
export default DailyGoalLog;
