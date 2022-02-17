import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Loader from "react-loader-spinner";

class CompanyCohortsReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dataLoaded: false,
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
      dataLoaded: true
    });
    global.api.getCompanyCohorts(
      this.companyCode
    )
      .then(
        data => {
          this.setState({
            dataLoaded: false,
            cohorts: data.programs,
          });
          // this.setState({ batchData: data });
        })
      .catch(err => {
        this.setState({
          dataLoaded: false
        });
      });
  }



  render() {
    const NoDataIndication = () => (
      <div className="table_wraps" id="spinner">
        <div className="spinner" >
          <Loader type="Grid" color="#4441E2" height={100} width={100} />
          Loading....
        </div>
      </div>
    );
    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Company Cohorts</h1>
              {/* <h4 className="title4 mb40">
                For {this?.state.selectedCompanyName}
              </h4> */}
              <div>
                {/* <a href={`https://api2.taplingua.com/app/user-cohort-registration-dynamic/${this.state.selectedCompany}`} target="_blank" rel="noopener noreferrer" style={{
                  margin: "0 4px"
                }}>Open Dynamic Cohort Registration Form</a> */}
                <a href={`/company-cohorts/new`} style={{
                  margin: "0 4px"
                }}>Create Cohort</a>
              </div>
            </div>
          </div>
          <div>
            <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Company Code</th>
                  <th>Cohort ID</th>
                  <th>Cohort Type</th>
                  <th>Name</th>
                  <th style={{width:'4%'}}>VPI</th>
                  <th>Registration Link</th>
                  <th>Start Date</th>
                  <th>Users</th>
                  <th>Register from CSV</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  !this.state.dataLoaded ?
                    this.state.cohorts.length > 0 ?
                      this.state.cohorts.filter(c => !c.is_dynamic).map(cohort => {
                        return (
                          <tr key={cohort.id}>
                            <td>{cohort.company_code}</td>
                            <td>{cohort.id}</td>
                            <td>{cohort.type_id == '2' ? 'Proctored Test': 
                            cohort.type_id == '3' ? 'Interview Simulator' :
                            cohort.type_id == '4' ? 'Business English' :
                            '-'
                            }</td>
                            <td>
                              <a target="_blank" rel="noopener noreferrer" href={"/cohort-detail/" + cohort.id}>{cohort.name}</a>
                            </td>
                            <td>{cohort?.vpi_value == 1 ? 'Yes' : 'No'}</td>
                            <td> <a href={`https://api2.taplingua.com/app/user-cohort-registration/${cohort.id}`} target="_blank" rel="noopener noreferrer">Open Registration Form</a></td>
                            <td>{moment(cohort.start_date).format("DD-MM-YYYY")}</td>
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
                            <td
                              style={{
                                color: "blue",
                                cursor: "pointer"
                              }}>
                              <Link to={"/company-cohorts/" + cohort.id}>Edit</Link>
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
                       <td colSpan="10"><NoDataIndication /> 
                       </td>
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
