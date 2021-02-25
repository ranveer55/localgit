import React, { Component } from "react";

class Leaderboard extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.state.leaderboardLoaded = false;
    this.state.leaderboard = [];
    this.state.leaderboardToday = [];
    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }
  getDate() {
    var tempDate = new Date();
    var date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    return date;
  }

  componentDidMount() {
    const companyCode = this.state.selectedCompany;

    // Get the leader board weekly
    global.api.getLeaderboard(companyCode)
      .then(
        data => {
          this.setState({
            leaderboardLoaded: true,
            leaderboard: data.leaderboard
          });
          // this.setState({ batchData: data });
        });

    // Get the leader board today
    global.api.getLeaderboardToday(companyCode)
      .then(
        data => {
          this.setState({
            leaderboardLoaded: true,
            leaderboardToday: data.leaderboard
          });
          // this.setState({ batchData: data });
        });
  }

  render() {

    return (
      <main className="offset" id="content">
        <section className="section_box">
          <h1 className="title1 mb25">Leaderboards Today</h1>
          <h4 className="title4 mb40">For {this.state.selectedCompanyName}</h4>
          <div id="reports" className="scrollmenu">
            <table style={{ width: "100%" }}>
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
            </table>
          </div>
          <br />
          <br />
          <br />
          <h1 className="title1 mb25">Leaderboards Weekly</h1>
          <h4 className="title4 mb40">For {this.state.selectedCompanyName}</h4>
          <div id="reports" className="scrollmenu">
            <table style={{ width: "100%" }}>
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
            </table>
          </div>

        </section>
      </main>
    );
  }
}
export default Leaderboard;
