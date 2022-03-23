import moment from 'moment-timezone'
import React, { Component } from "react";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const timezone = 'Asia/Kolkata';
moment.tz.setDefault(timezone);

class CompanyCohortCreate extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      programs: [],
      types: [],
      selectedProgram: "",
      instructorEmails: "",
      cohortName: "",
      cohortStartDate: new Date(),
      exam_start_time: '',
      exam_end_time: '',
      allotted_time: '',
      senderEmail: '',
      errors: null,
      profile_questionnaire: false,
      vpi_value: 0,
      archived: false,
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
    const { types } = this.state;
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
                    value={this.state.cohortName}
                    onChange={e => {
                      this.setState({
                        cohortName: e.target.value
                      });
                    }} />
                  <ErrorDiv errors={this.state.errors} label="name" />
                </div>
                <div className="form-group">
                  <label>Email Sender Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cohort Name"
                    value={this.state.senderEmail ?? ''}
                    onChange={e => {
                      this.setState({ senderEmail: e.target.value });
                    }} />
                  <ErrorDiv errors={this.state.errors} label="senderEmail" />
                </div>
                <div className="form-group" style={{ display: 'flex' }}>
                  <label style={{ margin: 10 }}>Profile Required</label>
                  <input
                    style={{ margin: 10 }}
                    type="radio"
                    name="profile_questionnaire"
                    className=""
                    placeholder="Cohort Name"
                    checked={this.state.profile_questionnaire == true}
                    onChange={e => {
                      this.setState({ profile_questionnaire: true });
                    }} /><span style={{ margin: 10 }}> Yes</span>
                  <input
                    style={{ margin: 10 }}
                    type="radio"
                    name="profile_questionnaire"
                    className=""
                    placeholder="Cohort Name"
                    checked={this.state.profile_questionnaire != true}
                    onChange={e => {
                      this.setState({
                        profile_questionnaire: false
                      });
                    }} /><span style={{ margin: 10 }}> No</span>

                </div>
                <div className="form-group" style={{ display: 'flex' }}>
                  <label style={{ margin: 10 }}>Archived</label>
                  <input
                    style={{ margin: 10 }}
                    type="radio"
                    name="archived"
                    className=""
                    placeholder="Cohort Name"
                    checked={this.state.archived == true}
                    onChange={e => {
                      this.setState({ archived: true });
                    }} /><span style={{ margin: 10 }}> Yes</span>
                  <input
                    style={{ margin: 10 }}
                    type="radio"
                    name="archived"
                    className=""
                    placeholder="Cohort Name"
                    checked={this.state.archived != true}
                    onChange={e => {
                      this.setState({
                        archived: false
                      });
                    }} /><span style={{ margin: 10 }}> No</span>

                </div>

                <div className="form-group">
                  <label>Cohort Type</label>
                  <select
                    value={this.state.cohortType ?? ""}
                    onChange={e => {
                      this.setState({
                        cohortType: e.target.value
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

                {/* verbal proficiency index */}
                {this.state.cohortType == 3 && (
                  <div className="form-group" style={{ display: 'flex' }}>
                    <label style={{ margin: 10 }}>Verbal proficiency index(VPI)</label>
                    <input
                      style={{ margin: 10 }}
                      type="radio"
                      name="vpi_value"
                      className=""
                      checked={this.state.vpi_value == 1}
                      onChange={e => {
                        this.setState({ vpi_value: 1 });
                      }} />
                    <span style={{ margin: 10 }}> Yes</span>
                    <input
                      style={{ margin: 10 }}
                      type="radio"
                      name="vpi_value"
                      className=""
                      checked={this.state.vpi_value == 0}
                      onChange={e => {
                        this.setState({
                          vpi_value: 0
                        });
                      }} /><span style={{ margin: 10 }}> No</span>

                  </div>
                )}
                {/* end verbal proficiency index */}
                {this.state.cohortType == 2 && (
                  <>
                    <div className="form-group">
                      <label>Exam start time</label>
                      <Datetime value={moment(this.state.exam_start_time)}
                        placeholderText="Exam start time"
                        onChange={date => {
                          this.setState({
                            exam_start_time: moment(date).utcOffset(330).format()

                          });
                        }}
                      />

                    </div>
                    <div className="form-group">
                      <label>Exam End time</label>
                      <Datetime value={moment(this.state.exam_end_time)}
                        placeholderText="Exam end time"
                        onChange={date => {
                          this.setState({
                            exam_end_time: moment(date).utcOffset(330).format()

                          });
                        }}
                      />

                    </div>
                    <div className="form-group">
                      <label>Allotted time</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={this.state.allotted_time}
                        className="form-control"
                        placeholderText="Allotted time"
                        onChange={e => {
                          if (e.target.value) {
                            this.setState({
                              allotted_time: parseInt(e.target.value)
                            });
                          } else {
                            this.setState({
                              allotted_time: 0
                            });
                          }

                        }} />
                    </div>
                  </>
                )}
                {!this.state.vpi_value && this.state.cohortType == 3 && (
                  <>
                    <div className="form-group">
                      <label>start time</label>
                      <Datetime dateFormat={false} value={moment(this.state.exam_start_time)}
                        placeholderText="Exam start time"
                        onChange={date => {
                          this.setState({
                            exam_start_time: moment(date).utcOffset(330).format()

                          });
                        }}
                      />

                    </div>
                    <div className="form-group">
                      <label> End time</label>
                      <Datetime dateFormat={false} value={moment(this.state.exam_end_time)}
                        placeholderText="Exam end time"
                        onChange={date => {
                          this.setState({
                            exam_end_time: moment(date).utcOffset(330).format()

                          });
                        }}
                      />

                    </div>
                    <div className="form-group">
                      <label>Allotted time</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={this.state.allotted_time}
                        className="form-control"
                        placeholderText="Allotted time"
                        onChange={e => {
                          if (e.target.value) {
                            this.setState({
                              allotted_time: parseInt(e.target.value)
                            });
                          } else {
                            this.setState({
                              allotted_time: 0
                            });
                          }

                        }} />
                    </div>
                  </>
                )}
                {this.state.cohortType == 4 && (
                  <div className="form-group">
                    <label>Select Program</label>
                    <select
                      value={this.state.selectedProgram ?? ""}
                      onChange={e => {
                        this.setState({
                          selectedProgram: e.target.value
                        });
                      }}
                      className="form-control"
                      style={{ borderRadius: "3px" }}>
                      <option value={""}>Select a program</option>
                      {
                        this.state.programs.filter(item => item.id !== 9999).map(program => (
                          <option key={program.id} value={program.id}>{program.id} - {program.name}</option>
                        ))
                      }
                    </select>
                  </div>

                )}
                <div className="form-group">
                  <label>Cohort instructor support Email</label>
                  <input
                    value={this.state.instructorEmails ?? ""}
                    onChange={e => {
                      this.setState({
                        instructorEmails: e.target.value
                      });
                    }}
                    className="form-control"
                    style={{ borderRadius: "3px" }} />
                </div>
                <div className="form-group">
                  <label>Cohort Start Date</label>
                  <Datetime value={moment(this.state.cohortStartDate)}
                    placeholderText="Cohort Start Date"
                    onChange={date => {
                      this.setState({
                        cohortStartDate: moment(date).utcOffset(330).format()

                      });
                    }}
                  />

                </div>
                {/* submit button */}
                <button
                  className="btn btn-radius btn-blue btn-icon-right export"
                  onClick={e => {
                    e.preventDefault();
                    const payload = {
                      name: this.state.cohortName,
                      program_id: this.state.selectedProgram,
                      instructorEmails: this.state.instructorEmails,
                      type_id: this.state.cohortType,
                      start_date: this.state.cohortStartDate,
                      company_code: this.companyCode,
                      profile_questionnaire: this.state.profile_questionnaire,
                      senderEmail: this.state.senderEmail,
                      exam_end_time: this.state.exam_end_time,
                      exam_start_time: this.state.exam_start_time,
                      allotted_time: this.state.allotted_time,
                      vpi_value: this.state.vpi_value,
                      archived: this.state.archived,
                    };


                    global.api.saveCohort(payload)
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

                    console.log({ payload });
                  }}>
                  <span>Create Cohort</span>
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

export default CompanyCohortCreate;
