import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ReactDatePicker from "react-datepicker";

class CohortEdit extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;
    this.cohortId = props.match.params.id;
    this.state = {
      dateLoaded: false,
      programs: [],
      types: [],
      selectedProgram: "",
      instructorEmails: "",
      errors: null,
      cohort: null,
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    this.getCohortData();
    this.loadData();
  }
  getCohortData() {
    this.setState({
      dateLoaded: false
    });
    global.api.getCohort(
      this.cohortId
    )
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            cohort: data,
          });
        })
      .catch(err => {
        this.setState({
          dateLoaded: true
        });
      });
  }

  loadData() {
    this.setState({
      dateLoaded: false
    });
    global.api.getProgramsList(
      this.companyCode
    )
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            programs: data.programs,
            types: data.types,
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
    const {types,cohort } =this.state;
    if (!cohort) {
        return (
  
          <main className="offset" id="content">
            <section className="section_box">
              Loading...
            </section>
          </main>
        )
      }
    return (
      <main className="offset CreateCohortModal" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Company Cohorts</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName}
              </h4>
              <form action="">
                <div className="form-group">
                  <label>Cohort Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cohort Name"
                    value={cohort.name ?? ''}
                    onChange={e => {
                      this.setState({
                         cohort:{
                             ...cohort,
                           name:e.target.value  
                         }
                      });
                    }} />
                  <ErrorDiv errors={this.state.errors} label="name" />
                </div>
                <div className="form-group">
                  <label>Cohort Type</label>
                  <select
                    disabled
                    value={cohort.type_id ?? ""}
                    onChange={e => {
                        this.setState({
                            cohort:{
                                ...cohort,
                              type_id:e.target.value  
                            }
                         });
                    }}
                    className="form-control"
                    style={{ borderRadius: "3px" }}>
                    <option value={""}>Select a Type</option>
                    {
                      types.map(type => (
                        <option key={type.id} value={type.id}>{type.type}</option>
                      ))
                    }
                  </select>
                </div>
                {cohort.type_id == 2 && ( 
                <>
                <div className="form-group">
                  <label>Exam start time</label>
                  <ReactDatePicker
                    dateFormat="dd-MM-yyyy hh:mm:ss"
                    selected={new Date(cohort.exam_start_time)}
                    showMonthDropdown
                    showTimeSelect
                    showYearDropdown
                    className="form-control"
                    placeholderText="Cohort Start Date"
                    onChange={date => {
                        this.setState({
                            cohort:{
                                ...cohort,
                              exam_start_time: date
                            }
                         });
                    }} />
                </div> 
                <div className="form-group">
                  <label>Exam End time</label>
                  <ReactDatePicker
                    dateFormat="dd-MM-yyyy hh:mm:ss"
                    selected={new Date(cohort.exam_end_time)}
                    showMonthDropdown
                    showTimeSelect
                    showYearDropdown
                    className="form-control"
                    placeholderText="Cohort Start Date"
                    onChange={date => {
                        this.setState({
                            cohort:{
                                ...cohort,
                              exam_end_time:date
                            }
                         });
                    }} />
                </div>
                </>
                )}
                 {cohort.type_id == 4 && (
                <div className="form-group">
                  <label>Select Program</label>
                  <select
                    value={cohort.program_id ?? ""}
                    disabled
                    className="form-control"
                    style={{ borderRadius: "3px" }}>
                    <option value={""}>Select a program</option>
                    {
                      this.state.programs.filter(item=>item.id !==9999).map(program => (
                        <option key={program.id} value={program.id}>{program.id} - {program.name}</option>
                      ))
                    }
                  </select>
                </div>
               
                )}
                 <div className="form-group">
                <label>Cohort instructor support Email</label>
                <input
                  value={cohort.instructorEmails ?? ""}
                  onChange={e => {
                    this.setState({
                        cohort:{
                            ...cohort,
                          instructorEmails:e.target.value  
                        }
                     });
                  }}
                  className="form-control"
                  style={{ borderRadius: "3px" }}/>
              </div>
                <div className="form-group">
                  <label>Cohort Start Date</label>
                  <ReactDatePicker
                    dateFormat="dd-MM-yyyy"
                    selected={new Date(cohort.start_date)}
                    showMonthDropdown
                    showYearDropdown
                    className="form-control"
                    placeholderText="Cohort Start Date"
                    onChange={date => {
                        this.setState({
                            cohort:{
                                ...cohort,
                              start_date:date 
                            }
                         });
                    }} />
                </div>
                {/* submit button */}
                <button
                  className="btn btn-radius btn-blue btn-icon-right export"
                  onClick={e => {
                    e.preventDefault();
                    
                    global.api.updateCohort(cohort)
                      .then(response => {
                        window.location.href = "/company-cohorts";
                      })
                      .catch(error => {
                        if (error && error.response && error.response.data && error.response.data.errors) {
                          this.setState({
                            errors: error.response.data.errors
                          });
                        } else {
                          alert("Something went wrong!");
                          console.log({ error });
                        }
                      })

                   
                  }}>
                  <span>Update Cohort</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

function ErrorDiv({ errors = null, label = "red" }) {

  if (!errors || !errors[label]) {
    return <></>
  }

  return (
    <div style={{ color: "red" }}>
      {errors[label]}
    </div>
  )
}

export default CohortEdit;
