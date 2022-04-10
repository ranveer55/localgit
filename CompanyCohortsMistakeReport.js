import moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Bar } from "react-chartjs-2";
import { Link } from 'react-router-dom';
const { SearchBar } = Search;

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
    // structure table
    const columns = this.state.report.length > 0 ? [{
      dataField: "userId",
      text: "Name",
      formatter: (cell, row) => {
        return <a href={`/time-log/${this.state.selectedCohort}/user/${cell}`} target="_blank" rel="noreferrer noopener">{cell}</a>
      },
      // hidden: true,
      sort: true,
    }, ...Object.keys(this.state.report[0].statistics).map(name => ({
      dataField: name,
      text: name,
      formatter: (cell, row) => {
        if (this.state.showPercentage) {
          return <span className="numeric">{cell + " %"}</span>;
        } else {
          return <span className="numeric">{cell}</span>;
        }
      },
      sort: true
    })), {
      dataField: "totalScore",
      text: "Score",
      sort: true,
      formatter: (cell, row) => {
        return <span className="numeric">{cell}</span>;
      },
    }, {
      dataField: "lastLesson",
      text: "Last Lesson",
      sort: true,
      formatter: (cell, row) => {
        return <span className="numeric">{cell}</span>;
      }
    }, {
      dataField: "totalPercentage",
      text: "Total Percentage",
      sort: true,
      formatter: (cell, row) => {
        return <span className="numeric">{cell + " %"}</span>;
      }
    }] : [];

    return (
      <main className="CompanyCohortsMistakeReport offset" id="content">
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
                  {/* toolkit */}
                  <ToolkitProvider
                    keyField="userId"
                    columns={columns}
                    data={
                      this.state.report.map(user => ({
                        userId: user.userId,
                        ...(this.state.showPercentage ? user.incorrectPercentage : user.statistics),
                        totalScore: user.totalScore,
                        lastLesson: user.lastLesson,
                        totalPercentage: user.incorrectPercentage.Total,
                      }))
                    }
                    classes="table"
                    search
                  >
                    {
                      props => (
                        <>

                          <div style={{ width: "300px", margin: "1rem 0" }}><SearchBar {...props.searchProps} placeholder="Search..." /></div>
                          <PaginationProvider pagination={paginationFactory({ custom: true })} >
                            {({ paginationProps, paginationTableProps }) => (
                              <>
                                <BootstrapTable
                                  {...props.baseProps}
                                  classes="table"
                                  {...paginationTableProps}
                                  noDataIndication={() => <div>No data</div>} />
                                <PaginationListStandalone
                                  {...paginationProps}
                                />
                              </>
                            )}
                          </PaginationProvider>
                        </>
                      )
                    }
                  </ToolkitProvider>
                  <br />
                  {/* chart */}
                  <h3>Visualizations</h3>
                  <div className="row" style={{ border: "1px solid #232323", marginBottom: "1rem" }}>
                    {/* success charts */}
                    {
                      Object.keys(this.state.report[0].statistics).map(name => (
                        <div className="col-md-6 col-lg-4 col-xl-3" key={name}>
                          {/* chart */}
                          <CreateBarChart showSuccess category={name} title={"Success Rate " + name} report={this.state.report} />
                        </div>
                      ))
                    }
                  </div>
                  <div className="row" style={{ border: "1px solid #232323" }}>
                    {/* failure charts */}
                    {
                      Object.keys(this.state.report[0].statistics).map(name => (
                        <div className="col-md-6 col-lg-4 col-xl-3" key={name}>
                          {/* chart */}
                          <CreateBarChart category={name} title={"Failure Rate " + name} report={this.state.report} />
                        </div>
                      ))
                    }
                  </div>
                  <br />
                </div>
              ) : <div>No data to display!</div>
          }
        </section>
      </main>
    );
  }
}


function CreateBarChart({ category, title = "", report = [], showSuccess = false }) {
  // calculate the ranges
  let range0to10 = 0;
  let range11to20 = 0;
  let range21to30 = 0;
  let range31to40 = 0;
  let range41to50 = 0;
  let range51to60 = 0;
  let range61to70 = 0;
  let range71to80 = 0;
  let range81to90 = 0;
  let range91to100 = 0;

  report.forEach(user => {
    let Total = user.incorrectPercentage[category];
    if (showSuccess) {
      Total = 100 - Total; // to get correct percentage for success
    }
    if (Total < 11) {
      range0to10++;
    } else if (Total < 21) {
      range11to20++;
    } else if (Total < 31) {
      range21to30++;
    } else if (Total < 41) {
      range31to40++;
    } else if (Total < 51) {
      range41to50++;
    } else if (Total < 61) {
      range51to60++;
    } else if (Total < 71) {
      range61to70++;
    } else if (Total < 81) {
      range71to80++;
    } else if (Total < 91) {
      range81to90++;
    } else {
      range91to100++;
    }
  });

  const labels = [
    "0-10%",
    '11-20%',
    '21-30%',
    '31-40%',
    '41-50%',
    '51-60%',
    '61-70%',
    '71-80%',
    '81-90%',
    "91-100%"
  ];

  const data = [
    range0to10,
    range11to20,
    range21to30,
    range31to40,
    range41to50,
    range51to60,
    range61to70,
    range71to80,
    range81to90,
    range91to100
  ];

  return (

    <div className="zoom-restorer" style={{ marginBottom: "1rem" }}>
      <div className="zoom-unrestorer">
        <Bar
          data={{
            labels,
            datasets: [{
              label: "No of users",
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
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
        <h3 className="text-center">{title}</h3>
      </div>
    </div>
  )
}

export default CompanyCohortsMistakeReport;
