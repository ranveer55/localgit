import React, { Component } from "react";
import { Link } from "react-router-dom";

class CohortDetail extends Component {

  constructor(props) {
    super(props);

    this.cohortId = props.match.params.cohortId;

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohort: null,
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
    global.api.getCohortDetail(
      this.cohortId
    )
      .then(
        data => {
           this.setState({
            dataLoaded: true,
            cohort: data,
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

    if (!this.state.cohort) {
      return (

        <main className="offset" id="content">
          <section className="section_box">
            Loading...
          </section>
        </main>
      )
    }


    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Cohort Detail</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName}
              </h4>
              <a href={`https://api2.taplingua.com/app/user-cohort-registration/${this.cohortId}`} target="_blank" rel="noopener noreferrer">Open Registration Form</a>
            </div>
          </div>
          <div>
          </div>
          <div>
            <br />
            <h2>{this.state.cohort.cohort_name}</h2>
            {
              this.state.cohort.levels.map(level => {
                return (
                  <div style={{ padding: "1rem 0" }}>
                    <h3 className="level" key={level.level_number}>Level {level.level_number}</h3>
                    <Link to={`/cohort-detail/${this.cohortId}/quiz-set`} >Add Quiz Set</Link>
                    {
                      level.modules.map(module => (
                        <div className="module row" style={{ padding: "6px", borderTop: '1px solid #888', marginTop: "1rem" }} key={module.id}>
                          <div className="col-md-6">
                            <div><b>Module Name - {module.description}</b></div>
                            <div><b>Module Number</b> - {module.module_number}</div>
                            <div><b>Course Number</b> - {module.course_number}</div>
                            <div><b>Course Start Date</b> - {module.courseStartDate}</div>
                            <div><b>Course End Date</b> - {module.courseEndDate}</div>
                          </div>
                          <div className="col-md-6">
                            <div><b>Users</b></div>
                            {
                              module.users.map(user => (
                                <div className="user" key={user.userId}>
                                  <div>{user.userId} - {user.completed ? "Completed" : "Not Completed"}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )
              })
            }
          </div>
        </section>
      </main>
    );
  }
}

export default CohortDetail;
