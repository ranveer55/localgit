import moment from 'moment-timezone'
import React, { Component } from "react";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const timezone ='Asia/Kolkata';
moment.tz.setDefault(timezone);
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
                  <label>Email Sender Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cohort Name"
                    value={cohort.senderEmail ?? ''}
                    onChange={e => {
                      this.setState({
                         cohort:{
                             ...cohort,
                           senderEmail:e.target.value  
                         }
                      });
                    }} />
                  <ErrorDiv errors={this.state.errors} label="senderEmail" />
                </div>
                <div className="form-group" style={{display:'flex'}}>
                  <label style={{margin:10}}>Profile Required</label>
                  <input
                    style={{margin:10}}
                    type="radio"
                    name="profile_questionnaire"
                    className=""
                    placeholder="Cohort Name"
                    checked={cohort.profile_questionnaire ==true}
                    onChange={e => {
                      this.setState({
                         cohort:{
                             ...cohort,
                             profile_questionnaire:true
                         }
                      });
                    }} /><span style={{margin:10}}> Yes</span>
                    <input
                    style={{margin:10}}
                    type="radio"
                    name="profile_questionnaire"
                    className=""
                    placeholder="Cohort Name"
                    checked={cohort.profile_questionnaire !=true}
                    onChange={e => {
                      this.setState({
                         cohort:{
                             ...cohort,
                             profile_questionnaire:false 
                         }
                      });
                    }} /><span style={{margin:10}}> No</span>
                  
                </div>
                <div className="form-group" style={{display:'flex'}}>
                  <label style={{margin:10}}>Archived</label>
                  <input
                    style={{margin:10}}
                    type="radio"
                    name="archived"
                    className=""
                    placeholder="Cohort Name"
                    checked={cohort.archived ==true}
                    onChange={e => {
                      this.setState({
                         cohort:{
                             ...cohort,
                             archived:true
                         }
                      });
                    }} /><span style={{margin:10}}> Yes</span>
                    <input
                    style={{margin:10}}
                    type="radio"
                    name="archived"
                    className=""
                    placeholder="Cohort Name"
                    checked={cohort.archived !=true}
                    onChange={e => {
                      this.setState({
                         cohort:{
                             ...cohort,
                             archived:false 
                         }
                      });
                    }} /><span style={{margin:10}}> No</span>
                  
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
                 {/* verbal proficiency index */}
                 {cohort?.type_id == 3 && ( 
                   <div className="form-group" style={{display:'flex'}}>
                  <label style={{margin:10}}>Verbal proficiency index(VPI)</label>
                  <input
                    style={{margin:10}}
                    type="radio"
                    name="vpi_value"
                    className=""
                    checked={cohort?.vpi_value == '1'}
                    onChange={e => {
                      this.setState({
                        cohort:{
                          ...cohort,
                          vpi_value: '1' 
                      }
                      });
                    }} />
                    <span style={{margin:10}}> Yes</span>
                    <input
                    style={{margin:10}}
                    type="radio"
                    name="vpi_value"
                    className=""
                    checked={cohort?.vpi_value == '0' || cohort?.vpi_value == null}
                    onChange={e => {
                      this.setState({
                        cohort:{
                          ...cohort,
                          vpi_value: '0' 
                      }
                        });
                    }} /><span style={{margin:10}}> No</span>
                  
                </div>
                )}
                {/* end verbal proficiency index */}
                {cohort.type_id == 2 && ( 
                <>
                <div className="form-group">
                  <label>Exam start time</label>
                  <Datetime  value={moment(cohort.exam_start_time)} 
                   placeholderText="Exam start time"
                   onChange={date => {
                       this.setState({
                           cohort:{
                               ...cohort,
                             exam_start_time: moment(date).utcOffset(330).format()
                           }
                        });
                   }}
                  />
                 
                </div> 
                <div className="form-group">
                  <label>Exam End time</label>
                  <Datetime  value={moment(cohort.exam_end_time)} 
                   placeholderText="Exam End time"
                   onChange={date => {
                       this.setState({
                           cohort:{
                               ...cohort,
                               exam_end_time:  moment(date).utcOffset(330).format()
                           }
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
                    value={cohort.allotted_time}
                    className="form-control"
                    placeholderText="Allotted time"
                    onChange={e => {
                      if(e.target.value){
                        this.setState({
                          cohort:{
                            ...cohort,
                          allotted_time: parseInt(e.target.value)
                          }
                        });
                      } else {
                        this.setState({
                          cohort:{
                            ...cohort,
                          allotted_time: 0,
                          }
                        });
                      }
                      
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
                  <Datetime  value={moment(cohort.start_date)} 
                  timeFormat={false}
                   placeholderText="Cohort Start Date"
                   onChange={date => {
                       this.setState({
                           cohort:{
                               ...cohort,
                               start_date:  moment(date).utcOffset(330).format()
                           }
                        });
                   }}
                  />
                 
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
