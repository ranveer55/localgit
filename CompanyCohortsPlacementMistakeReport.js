import moment from "moment";
import React, { Component, useState } from "react";
import { Link } from 'react-router-dom';

class CompanyCohortsPlacementMistakeReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohorts: [],
      report: [],
      reportLoading: false,
      selectedCohort: null,
      selectedStartDate: moment().subtract(1, 'y'),
      selectedEndDate: moment(),
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    // Load list of cohorts
    this.loadData();
  }

  /**
   * Load list of cohorts
   */
  loadData() {
    this.setState({
      dateLoaded: false
    });
    global.api.getCompanyCohorts(
      this.companyCode
    )
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            cohorts: data.programs.filter(p => !p.is_dynamic),
          });
          // this.setState({ batchData: data });
        })
      .catch(err => {
        this.setState({
          dateLoaded: true
        });
      });
  }

  loadReport(selectedCohort = null) {

    if (!this.state.selectedStartDate) {
      return alert("Choose a date first!");
    }
    if (!selectedCohort && !this.state.selectedCohort) {
      return alert("Choose a cohort first!");
    }
    this.setState({
      reportLoading: true
    });
    global.api.getUserPlacementMistakesByCohort(
      selectedCohort ? selectedCohort : this.state.selectedCohort,
      this.state.selectedStartDate.format("YYYY-MM-DD")
    )
      .then(
        data => {
          this.setState({
            report: data.users,
            reportLoading: false
          });
          // this.setState({ batchData: data });
        })
      .catch(err => {
        this.setState({
          reportLoading: false
        });
      });
  }



  render() {


    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-12">
              <h1 className="title1 mb25">Cohorts Placement</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName}
              </h4>
              <div style={{ display: "flex" }}>
                {/* date selector */}
                {/* <label>&nbsp;<b>Date: </b>&nbsp;</label>
                <select
                  defaultValue={this.state.selectedStartDate}
                  onChange={e => {
                    let value = moment();
                    switch (e.target.value) {
                      case "0":
                        value = moment().subtract(1, "year");
                        break;
                      case "1":
                        break;
                      case "2":
                        value = moment().subtract(1, "day");
                        break;
                      case "3":
                        value = moment().subtract(7, "day");
                        break;
                      case "4":
                        value = moment().subtract(31, "day");
                        break;
                      default:
                        break;
                    }
                    this.setState({
                      selectedStartDate: value
                    });
                  }}
                  style={{ padding: "4px 10px", borderRadius: "3px" }}>
                  <option value={0}>No Filter</option>
                  <option value={1}>Today</option>
                  <option value={2}>Yesterday</option>
                  <option value={3}>Last 7 Days</option>
                  <option value={4}>Last 31 Days</option>
                </select> */}
                {/* cohort selector */}
                <label><b>Cohort: </b>&nbsp;</label>
                <select
                  defaultValue={this.state.selectedCohort}
                  onChange={e => {
                    this.setState({
                      selectedCohort: e.target.value
                    });
                    this.loadReport(e.target.value);
                  }}
                  style={{ padding: "4px 10px", borderRadius: "3px" }}>
                  <option value={""}>Select a cohort</option>
                  {
                    this.state.cohorts.map(cohort => (
                      <option key={cohort.id} value={cohort.id}>{cohort.id} - {cohort.name}</option>
                    ))
                  }
                </select>
                {/* submit button */}
                <button
                  className="btn btn-radius btn-size btn-blue btn-icon-right export"
                  onClick={e => {
                    this.loadReport();
                  }}
                  style={{ margin: "0 12px" }}>
                  <span>Generate Report</span>
                </button>

              </div>
              <br />
            </div>
          </div>
          {/* user reprots */}
          {
            this.state.reportLoading ? (
              <div>Loading...</div>
            ) :
              this.state.report.length > 0 ? (

                <div>
                  <table style={{ width: "100%" }}>
                    <thead style={{ textAlign: "left" }}>
                      <tr>
                        <th>Name</th>
                        {
                          Object.keys(this.state.report[0].statistics).map(name => (
                            <th key={name}>{name}</th>
                          ))
                        }
                        <th>Last Attempt At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.report.map((user, index) => (
                          <UserRow
                            user={user}
                            index={index}
                            key={user.userId}
                            selectedCohort={this.state.selectedCohort} />
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              ) : <div>No data to display!</div>
          }
        </section>
      </main>
    );
  }
}

function UserRow({ user, index, selectedCohort }) {

  const total = Object.values(user.total);

  const [isExpanded, setIsExpanded] = useState(false);

  const rowColor = "#D15FEE";

  return (
    <>
      {/* last round */}
      <tr style={{ backgroundColor: rowColor }}>
        <td>
          <a
            target="_blank" rel="noreferrer noopener"
            href={`/company-cohorts/placement-mistakes/${selectedCohort}/user/${user.userId}`}><b>{user.name}</b></a>
          <PlacementResultButton userId={user.userId} />
          {
            user.subsequentRounds.length > 0 ? (
              <span style={{ margin: "0px 6px", cursor: "pointer", color: "blue", fontSize: "smaller" }}
                onClick={e => {
                  setIsExpanded(!isExpanded);
                }}>expand</span>
            ) : <></>
          }
        </td>
        {
          Object.values(user.statistics).map((stat, index) => (
            <td key={index}>{stat}/{total[index]}</td>
          ))
        }
        <td style={{ textAlign: "right" }}>{moment(user.created_at).format("DD-MM-YYYY")}</td>
      </tr>
      {/* subsequent rounds */}
      {
        isExpanded && user.subsequentRounds.map((round, index) => (
          <UserSubsequentRow round={round} key={index} rowColor={rowColor + "33"} />
        ))
      }
    </>
  );
}


function UserSubsequentRow({ round, rowColor }) {
  try {
    const total = Object.values(round.total);

    return (
      <tr style={{ backgroundColor: rowColor }}>
        <td></td>
        {
          Object.values(round.mistakes).map((stat, index) => (
            <td key={index}>{stat}/{total[index]}</td>
          ))
        }
        <td style={{ textAlign: "right" }}>{moment(round.attempted_at).format("DD-MM-YYYY")}</td>
      </tr>
    );
  } catch (error) {
    console.log("round failed!");
    return <></>;
  }
}


function PlacementResultButton({ userId }) {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <span
      style={{ margin: "0px 5px", cursor: "pointer", color: "blue", fontSize: "smaller" }}
      onClick={() => {
        if (!isLoading) {
          setIsLoading(true);
          global.api.sendLastPlacementTestResultEmail(userId)
            .then(response => {
              setIsLoading(false);
              alert(response.message);
            })
            .catch(error => {
              setIsLoading(false);
              alert("Something went wrong!");
            });
        }
      }}
    >
      {
        isLoading ? "Loading..." : "Send Result Email"
      }
    </span>
  )
}

export default CompanyCohortsPlacementMistakeReport;
