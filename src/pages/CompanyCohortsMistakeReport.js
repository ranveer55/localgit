import moment from "moment";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from 'react-router-dom';

class CompanyCohortsMistakeReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohorts: [],
      report: [],
      reportLoading: false,
      selectedCohort: null,
      showPercentage: false,
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
    global.api.getUserMistakesByCohort(
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
    // calculate the ranges
    let range0to30 = 0;
    let range31to60 = 0;
    let range61to100 = 0;

    this.state.report.forEach(user => {
      const { Total } = user.incorrectPercentage;
      if (Total < 31) {
        range0to30++;
      } else if (Total < 61) {
        range31to60++;
      } else {
        range61to100++;
      }
    });

    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-12">
              <h1 className="title1 mb25">Cohorts Assessment</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName}
              </h4>
              <div style={{ display: "flex" }}>
                {/* date selector */}
                <label>&nbsp;<b>Date: </b>&nbsp;</label>
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
                </select>
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
              <div>
                <label><input type="checkbox" checked={this.state.showPercentage} onChange={e => {
                  this.setState({
                    showPercentage: e.target.checked
                  });
                }} /> Show percentage</label>
              </div>
            </div>
          </div>
          {/* user reprots */}
          {
            this.state.reportLoading ? (
              <div>Loading...</div>
            ) :
              this.state.report.length > 0 ? (

                <div>
                  {/* chart */}
                  <div className="row">
                    <div className="col-md-6">

                      <div className="zoom-restorer">
                        <div className="zoom-unrestorer">
                          <Bar
                            data={{
                              labels: ["0-30%", '31-60%', "61-100%"],
                              datasets: [{
                                label: "No of users",
                                data: [range0to30, range31to60, range61to100],
                                backgroundColor: [
                                  'rgba(255, 99, 132, 0.2)',
                                  'rgba(255, 159, 64, 0.2)',
                                  'rgba(255, 205, 86, 0.2)',
                                  'rgba(75, 192, 192, 0.2)',
                                  'rgba(54, 162, 235, 0.2)',
                                  'rgba(153, 102, 255, 0.2)',
                                  'rgba(201, 203, 207, 0.2)'
                                ],
                                borderColor: [
                                  'rgb(255, 99, 132)',
                                  'rgb(255, 159, 64)',
                                  'rgb(255, 205, 86)',
                                  'rgb(75, 192, 192)',
                                  'rgb(54, 162, 235)',
                                  'rgb(153, 102, 255)',
                                  'rgb(201, 203, 207)'
                                ],
                                borderWidth: 1,
                              }],
                            }}
                            options={{
                              responsive: true,
                              scales: {
                                yAxes: [{
                                  scaleLabel: {
                                    display: true
                                  },
                                  ticks: {
                                    beginAtZero: true,
                                    userCallback(label, index, labels) {
                                      // only show if whole number
                                      if (Math.floor(label) === label) {
                                        return label;
                                      }
                                    },
                                  },
                                }]
                              }
                            }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* table data */}
                  <table style={{ width: "100%" }}>
                    <thead style={{ textAlign: "left" }}>
                      <tr>
                        <th>Name</th>
                        {
                          Object.keys(this.state.report[0].statistics).map(name => (
                            <th key={name}>{name}</th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.report.map(user => (
                          <tr key={user.userId}>
                            <td>
                              <a
                                target="_blank" rel="noreferrer noopener"
                                href={`/company-cohorts/mistakes/${this.state.selectedCohort}/user/${user.userId}`}><b>{user.name}</b></a>
                            </td>
                            {
                              Object.values(this.state.showPercentage ? user.incorrectPercentage : user.statistics).map((stat, index) => (
                                <td key={index}>{stat} {this.state.showPercentage ? "%" : ""}</td>
                              ))
                            }
                          </tr>
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

export default CompanyCohortsMistakeReport;
