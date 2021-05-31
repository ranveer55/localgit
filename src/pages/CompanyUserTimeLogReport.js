import moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Bar, Line } from "react-chartjs-2";
import { Link } from 'react-router-dom';
const { SearchBar } = Search;

class CompanyUserTimeLogReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;
    this.cohortId = props.match.params.cohortId;
    this.userId = props.match.params.userId;

    this.state = {
      report: [],
      reportLoading: false,
      selectedCohort: this.cohortId,
      selectedStartDate: moment().subtract(1, 'w'),
      selectedEndDate: moment(),
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    // Load list of cohorts
    this.loadReport();
  }

  loadReport(selectedDate) {

    if (!selectedDate && !this.state.selectedStartDate) {
      return alert("Choose a date first!");
    }
    if (!this.state.selectedCohort) {
      return alert("Choose a cohort first!");
    }
    this.setState({
      reportLoading: true
    });
    global.api.getUserTimeLogReportByCohort(
      this.state.selectedCohort,
      selectedDate ? selectedDate.format("YYYY-MM-DD") : this.state.selectedStartDate.format("YYYY-MM-DD"),
      this.userId
    )
      .then(
        data => {
          this.setState({
            report: data.timeLogs,
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

    console.log("here!");

    return (
      <main className="CompanyCohortsMistakeReport offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-12">
              <h1 className="title1 mb25">User Time Log</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName} - {this.userId}
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
                    this.loadReport(value);
                  }}
                  style={{ padding: "4px 10px", borderRadius: "3px" }}>
                  <option value={0}>No Filter</option>
                  <option value={1}>Today</option>
                  <option value={2}>Yesterday</option>
                  <option value={3}>Last 7 Days</option>
                  <option value={4}>Last 31 Days</option>
                </select>
              </div>
              <br />
            </div>
          </div>
          {/* user time log reprots */}
          {
            this.state.reportLoading ? (
              <div>Loading...</div>
            ) :
              this.state.report.length > 0 ? (
                <div className="row">
                  {/* The chart, zoom restorer helps with the stupid zoomout previous dev put in */}
                  <div className="col-md-6">
                    <div className="zoom-restorer">
                      <div className="zoom-unrestorer">
                        <LineChart
                          label="Minutes Used"
                          labels={this.state.report.map(r => moment(r.date).format('DD MMM'))}
                          data={this.state.report.map(r => parseInt(r.time_spent / 60))} />
                      </div>
                    </div>
                    <h3 className="text-center">User Time Log (In Minutes)</h3>
                  </div>
                </div>
              ) : <div>No data to display!</div>
          }
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
  console.log({ data })
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
    }}
      options={{
        responsive: true,
        hover: true,
        tooltips: {
          mode: "x",
          intersect: false
        },
        scales: {
          yAxes: [
            {
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
            },
          ]
        },
      }} />
  );
}

export default CompanyUserTimeLogReport;
