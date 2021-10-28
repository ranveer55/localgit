import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ReactDatePicker from "react-datepicker";

class CompanyCohortCreate extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      programs: [],
      types: [],
      selectedProgram: "",
      cohortName: "",
      cohortStartDate: new Date(),
      errors: null,
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
    const {types } =this.state;
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
                      this.state.programs.filter(item=>item.id !==9999).map(program => (
                        <option key={program.id} value={program.id}>{program.id} - {program.name}</option>
                      ))
                    }
                  </select>
                </div>
                )}
                <div className="form-group">
                  <label>Cohort Start Date</label>
                  <ReactDatePicker
                    dateFormat="dd-MM-yyyy"
                    selected={this.state.cohortStartDate}
                    showMonthDropdown
                    showYearDropdown
                    className="form-control"
                    placeholderText="Cohort Start Date"
                    onChange={date => {
                      this.setState({
                        cohortStartDate: date
                      });
                    }} />
                </div>
                {/* submit button */}
                <button
                  className="btn btn-radius btn-blue btn-icon-right export"
                  onClick={e => {
                    e.preventDefault();
                    const payload = {
                      name: this.state.cohortName,
                      program_id: this.state.selectedProgram,
                      type_id: this.state.cohortType,
                      start_date: this.state.cohortStartDate,
                      company_code: this.companyCode
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
