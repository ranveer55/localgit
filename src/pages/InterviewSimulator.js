import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Loader from "react-loader-spinner";

class InterviewSimulatorPage extends Component {
  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohorts: [],
      selectedCohort: false,
      companyCode : this.companyCode
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    // getCompanyRegistrationReport
    this.loadData();
  }

  exportCohort(companyCode){
    // this.setState({
    //   dateLoaded: true,
    // });
    console.log('companyCode',companyCode)
    global.api
      .exportCohortData(companyCode)
      .then((data) => {
        let resData =  data.programs
        let filterData = resData.filter((item)=> item.type_id == '3')
        this.setState({
          dataLoaded: false,
          cohorts: filterData,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }

  loadData(status) {
    this.setState({
      dateLoaded: true,
    });
    global.api
      .getCompanyCohorts(this.companyCode,status)
      .then((data) => {
        let resData =  data.programs
        let filterData = resData.filter((item)=> item.type_id == '3')
        this.setState({
          dataLoaded: false,
          cohorts: filterData,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }

  onChangeStatus = (e) => {
    this.loadData(e.target.value)
    this.setState({
      dataLoaded: true,
      cohorts: [],
    });
    
  }

  formatter = (cell, row) => {
    return (
      <div className="interview-simulator-dropdown-holder">
      
      <Link
            to={"/interview-simulator/" + row.id + "/add-practice-set"}
            className="interview-simulator-dropdown-link"
            style={{
              color: "blue",
              cursor: "pointer",
            }}
          >
            Manage Practice Sets
          </Link>
        {/* <div className="interview-simulator-dropdown-content"> */}
        {/* </div> */}
      </div>
    );
  };

  render() {

    const NoDataIndication = () => (
      <div className="table_wraps" id="spinner">
        <div className="spinner" >
          <Loader type="Grid" color="#4441E2" height={100} width={100} />
          Loading....
        </div>
      </div>
    );

    const columns = [
      {
        dataField: "practiceSetQuestion",
        text: "Name",
        formatter: (id, row) => (
          <td
            style={{
              color: "blue",
              cursor: "pointer",
            }}
          >
            
            <Link
              to={"/interview-simulator/" + row.id}
              style={{
                color: "blue",
                cursor: "pointer",
              }}
            >
              {row.name} 
            </Link>
          </td>
        ),
      },

      {
        dataField: "created_at",
        text: "Start Date",
        formatter: (created_at) =>
          moment(created_at).format("DD/MM/YYYY").toString(),
      },
      {
        dataField: "id",
        text: "Users",
        formatter: (id, row) => (
          <td
            style={{
              color: "blue",
              cursor: "pointer",
            }}
          >
       <Link
              to={"/interview-simulator/" + row.id}
              style={{
                color: "blue",
                cursor: "pointer",
              }}
            >
              {row.users.length} User(s)
            </Link>
          </td>
        ),
      },
      // {
      //     dataField: 'created_at',
      //     text: 'Date Created',
      //     formatter: (created_at) =>'',
      // },
      {
        dataField: "id",
        text: "Registration Link",
        formatter: (id, row) => (
          <td>
            <a
              href={`https://api2.taplingua.com/app/user-cohort-registration/${row.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Registration Form
            </a>
          </td>
        ),
      },
      {
        dataField: "id",
        text: "Action",
        formatter: this.formatter,
      },
      // {
      //   dataField: "id",
      //   text: "Quiz proctored attempts",
      //   formatter: (id, row) =>
      //     row.quizAttempts ? (
      //       <td>
      //         <a
      //           href={
      //             "/interview-simulator/" + row.id + "/quiz-proctored-attempts"
      //           }
      //           target="_blank"
      //           rel="noopener noreferrer"
      //         >
      //           View
      //         </a>
      //       </td>
      //     ) : (
      //       <></>
      //     ),
      // },
      // {
      //   dataField: "id",
      //   text: "Quiz Attempts",
      //   formatter: (id, row) =>
      //     row.quizAttempts ? (
      //       <td>         <a
      //           href={"/interview-simulator/" + row.id + "/quiz-attempt-users"}
      //           target="_blank"
      //           rel="noopener noreferrer"
      //         >
      //           Show Users List
      //         </a>
      //       </td>
      //     ) : (
      //       <></>
      //     ),
      // },
      {
        dataField: "csv",
        text: "Register from CSV",
        formatter: (id, row) => (
          <td
            style={{
              color: "blue",
              cursor: "pointer",
            }}
          >
            <a href={"/cohort-csv-register/" + row.id}>Upload CSV</a>
          </td>
        ),
      },
    ];

    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-12">
              <h1 className="title1 mb25">
                Manage Interview Simulator Cohorts
              </h1>
              {/* <h4 className="title4 mb40">
                For{" "}
                {this.state.selectedCompanyName != "null"
                  ? this.state.selectedCompanyName
                  : ""}
              </h4> */}
}
              <div style={{
                                padding: "2px 8px",
                                margin: "0px 8px",
                                fontWeight: "500",
                                float: "right",
                                display:"flex",
                            }}>
                               <select style={{marginRight:'10px'}} onChange={this.onChangeStatus}
                                     defaultValue="">
                                    <option value="" disabled>Select Status</option>
                                    <option value="0">Active</option>
                                    <option value="1">InActive</option>
                                </select>
                              <div>
                              <button onClick={()=>{this.exportCohort(this.state.companyCode)}}
                              className="btn btn-size3 btn-blue btn-radius export"
                              >
                                <span>Download reports</span>
                              </button>
                       </div>

                               
                            </div>
              <div>
                {/* <a href={`https://api2.taplingua.com/app/user-cohort-registration-dynamic/${this.state.selectedCompany}`} target="_blank" rel="noopener noreferrer" style={{
                                    margin: "0 4px"
                                }}>Open Dynamic Cohort Registration Form</a> */}
                <a
                  href={`/company-cohorts/new`}
                  style={{
                    margin: "0 4px",
                  }}
                >
                  Create Cohort
                </a>
              </div>
            </div>
          </div>
          <div>
        {!this.state.dataLoaded ? (
              this.state.cohorts.length > 0 ? (
                <BootstrapTable
                  keyField="id"
                  data={this.state.cohorts.filter((c) => !c.is_dynamic)}
                  columns={columns}
                />
              ) : (
                <span colSpan="4">No cohorts were found for Interview Simulator</span>
              )
            ) : (
              // loader
                <NoDataIndication />
              
            )}
          </div>
        </section>
      </main>
    );
  }
}

export default InterviewSimulatorPage;
