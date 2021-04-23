import React, { Component } from "react";


export const getUserCohortDetailLink = (cohort_id, userId) => "/user-cohort-detail/" + cohort_id + "/" + userId;

class UserCohortDetail extends Component {

  constructor(props) {
    super(props);

    this.cohortId = props.match.params.cohortId;
    this.userId = props.match.params.userId;

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohort: null,
      user: null,
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
    global.api.getUserCohortDetail(
      this.cohortId,
      this.userId
    )
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            cohort: data.cohort,
            user: data.user,
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
                For {this.state.selectedCompanyName} - {this.state.user.name} | {this.state.user.email}
              </h4>
            </div>
          </div>
          <div>
          </div>
          <div>
            <br />
            <h2>{this.state.cohort.name}</h2>
            {
              this.state.cohort.program.levels.map(level => {
                return (
                  <div style={{ padding: "1rem 0" }} key={level.level_number}>
                    <h3 className="level">Level {level.level_number}</h3>
                    {
                      level.modules.map(module => (
                        <div key={module.id} className="module row" style={{ padding: "6px", borderTop: '1px solid #888', marginTop: "1rem" }} key={module.id}>
                          <div className="col-md-6">
                            <div><b>Module Name - {module.description}</b></div>
                            <div><b>Module Number</b> - {module.module_number}</div>
                            <div><b>Course Number</b> - {module.course_number}</div>
                            <div><b>Course Start Date</b> - {module.startDate}</div>
                            <div><b>Course End Date</b> - {module.endDate}</div>
                            <div><b>Is Completed?</b> - {module.completed ? "Yes" : "No"}</div>
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

export default UserCohortDetail;
