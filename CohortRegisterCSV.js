import React, { Component } from "react";

class CohortRegisterCSV extends Component {

  constructor(props) {
    super(props);

    this.cohortId = props.match.params.cohortId;

    this.companyCode = global.companyCode;

    this.state = {
      processing: false,
      dateLoaded: false,
      csv: null,
      cohort: null,
      output: null
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

    console.log({ csv: this.state.csv })


    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Register to cohort using CSV</h1>
            </div>
          </div>
          {
            this.state.cohort ? (
              <div className="row">
                {/* title */}
                <div className="col-12">
                  <h4 className="title4 mb40">
                    Cohort Id: {this.cohortId}
                  </h4>
                  <h4 className="title4 mb40">
                    Cohort Name: {this.state.cohort.cohort_name}
                  </h4>
                </div>
                {/* form */}
                <div className="col-12">
                  <input type="file" onChange={e => {
                    this.setState({
                      csv: e.target.files[0]
                    });
                  }} />
                  {/* upload button */}
                  <button className="btn btn-radius btn-size btn-blue btn-icon-right export"
                    onClick={() => {
                      // check if csv uploaded
                      if (!this.state.csv) {
                        return window.alert("Please select a file!");
                      }
                      // 
                      this.setState({
                        processing: true
                      });
                      global.api.registerUsersToCohortFromCSV(this.cohortId, this.state.csv)
                        .then(response => {
                          this.setState({
                            processing: false,
                            output: response
                          });
                          console.log({ response });
                        })
                        .catch(error => {
                          this.setState({
                            processing: false
                          });
                          console.log({ error });
                        });
                    }}>
                    <span>Upload CSV</span>
                  </button>
                </div>
                {/* loading */}
                <div className="col-12">
                  {this.state.processing ? "Processing... please wait." : <></>}
                </div>
                {/* output */}
                {
                  this.state.output ? (
                    <div className="col-12">
                      <div className="row" style={{fontWeight: "700"}}>Successful registrations: {this.state.output.successful}</div>
                      <div className="row">
                        <div className="col-12">More Details: </div>
                        {
                          this.state.output.results.map(result => (
                            <div className="col-12" style={{ color: result.status ? "green" : "red", display: "block" }}>
                              [{result.status ? "Success" : "Failed"}] {result.email} {result.message ? " - " + result.message : ""}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ) : <></>
                }
              </div>
            ) : <></>
          }
        </section>
      </main>
    );
  }
}

export default CohortRegisterCSV;
