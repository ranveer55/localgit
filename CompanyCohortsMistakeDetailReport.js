import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';

class CompanyCohortsMistakeDetailReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;
    this.cohortId = props.match.params.cohortId;
    this.userId = props.match.params.userId;

    this.state = {
      report: [],
      reportLoading: false,
      selectedCohort: this.cohortId,
      selectedStartDate: moment().subtract(1, 'y'),
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
    global.api.getUserMistakesDetailByCohort(
      this.state.selectedCohort,
      selectedDate ? selectedDate.format("YYYY-MM-DD") : this.state.selectedStartDate.format("YYYY-MM-DD"),
      this.userId
    )
      .then(
        data => {
          this.setState({
            report: data.user,
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
          {/* user reprots */}
          {
            this.state.reportLoading ? (
              <div>Loading...</div>
            ) :
              Object.values(this.state.report).length > 0 && !Array.isArray(this.state.report.statistics) ? (
                <div>
                  <div><b>Name:</b> {this.state.report.name}</div>
                  <div><b>Cohort:</b> {this.state.report.cohort_name}</div>
                  <hr />
                  <table style={{ width: "100%" }}>
                    <thead style={{ textAlign: "left" }}>
                      <tr>
                        {
                          Object.keys(Object.values(this.state.report.statistics)[0]).map(name => (
                            <th key={name}>{name}</th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Object.entries(this.state.report.statistics).map(([key, stat]) => (
                          <tr key={key}>
                            {
                              Object.values(stat).map((stat, index) => (
                                <td key={index}>
                                  {
                                    index === 0 ? (
                                      <b>{stat}</b>
                                    ) : stat
                                  }
                                </td>
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

export default CompanyCohortsMistakeDetailReport;
