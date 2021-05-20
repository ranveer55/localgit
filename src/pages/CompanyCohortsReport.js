import React, { Component } from "react";
import { Link } from 'react-router-dom';

class CompanyCohortsReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohorts: [],
      selectedCohort: false
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    // getCompanyRegistrationReport 
    this.loadData();


  }

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



  render() {


    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Company Cohorts</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName}
              </h4>
              <div>
                <a href={`https://api2.taplingua.com/app/user-cohort-registration-dynamic/${this.state.selectedCompany}`} target="_blank" rel="noopener noreferrer">Open Dynamic Cohort Registration Form</a>
              </div>
            </div>
          </div>
          <div>
            <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Company Code</th>
                  <th>Cohort ID</th>
                  <th>Name</th>
                  <th>Registration Link</th>
                  <th>Start Date</th>
                  <th>Users</th>
                  <th>Register from CSV</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.dataLoaded ?
                    this.state.cohorts.length > 0 ?
                      this.state.cohorts.map(cohort => {
                        return (
                          <tr key={cohort.id}>
                            <td>{cohort.company_code}</td>
                            <td>{cohort.id}</td>
                            <td>
                              <a target="_blank" rel="noopener noreferrer" href={"/cohort-detail/" + cohort.id}>{cohort.name}</a>
                            </td>
                            <td> <a href={`https://api2.taplingua.com/app/user-cohort-registration/${cohort.id}`} target="_blank" rel="noopener noreferrer">Open Registration Form</a></td>
                            <td>{cohort.start_date}</td>
                            <td
                              style={{
                                color: "blue",
                                cursor: "pointer"
                              }}
                              onClick={e => {
                                this.setState({
                                  selectedCohort: cohort
                                });
                              }}>
                              <span
                                style={{
                                  color: "blue",
                                  cursor: "pointer"
                                }}>{cohort.users.length} User(s)</span>
                            </td>
                            <td
                              style={{
                                color: "blue",
                                cursor: "pointer"
                              }}>
                              <a href={"/cohort-csv-register/" + cohort.id}>Upload CSV</a>
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
          <div>
            {
              this.state.selectedCohort ? (
                <div>
                  <br />
                  <h4>{this.state.selectedCohort.name} - User Count</h4>
                  <div>
                    {
                      this.state.selectedCohort.users.map(user => (
                        <div>
                          <Link key={user.userId}
                            target="_blank"
                            to={"/user-cohort-detail/" + this.state.selectedCohort.id + "/" + user.userId}
                            style={{
                              color: "blue",
                              cursor: "pointer"
                            }}>{user.userId}</Link>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ) : <></>
            }
          </div>
        </section>
      </main>
    );
  }
}

export default CompanyCohortsReport;
