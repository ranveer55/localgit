import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';

class CompanyCohortsMistakeReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohorts: [],
      report: [],
      selectedCohort: null,
      selectedDate: moment(),
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    // getCompanyRegistrationReport 
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
            cohorts: data.programs,
          });
          // this.setState({ batchData: data });
        })
      .catch(err => {
        this.setState({
          dateLoaded: true
        });
      });
  }

  loadReport() {

    if (!this.state.selectedDate) {
      return alert("Choose a date first!");
    }
    if (!this.state.selectedCohort) {
      return alert("Choose a cohort first!");
    }
    global.api.getUserMistakesByCohort(
      this.state.selectedCohort,
      this.state.selectedDate.format("YYYY-MM-DD")
    )
      .then(
        data => {
          this.setState({
            report: data.users,
          });
          // this.setState({ batchData: data });
        })
      .catch(err => {
        this.setState({
          dateLoaded: true
        });
      });
  }



  render() {


    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Cohorts Mistakes</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName}
              </h4>
              <div style={{ display: "flex" }}>
                {/* date selector */}
                <label>&nbsp;<b>Date: </b>&nbsp;</label>
                <select
                  defaultValue={this.state.selectedDate}
                  onChange={e => {
                    this.setState({
                      selectedDate: e.target.value
                    });
                  }}
                  style={{ padding: "4px 10px", borderRadius: "3px" }}>
                  <option value={moment()}>Today</option>
                  <option value={moment().subtract(1, "d")}>Yesterday</option>
                </select>
                {/* cohort selector */}
                <label><b>Cohort: </b>&nbsp;</label>
                <select
                  defaultValue={this.state.selectedCohort}
                  onChange={e => {
                    this.setState({
                      selectedCohort: e.target.value
                    });
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
            this.state.report.length > 0 ? (

              <div>
                <table style={{ width: "100%" }}>
                  <thead style={{ textAlign: "left" }}>
                    <tr>
                      <th></th>
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
                          <th>{user.name}</th>
                          {
                            Object.values(user.statistics).map((stat, index) => (
                              <td key={index}>{stat}</td>
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
