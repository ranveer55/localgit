import React, { Component } from "react";

class Program extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.state.dataLoaded = false;
    this.state.userDataLoading = false;
    this.state.userData = null;
    this.state.program = null;
    this.state.employees = [];
    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }
  getDate() {
    var tempDate = new Date();
    var date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    return date;
  }

  componentDidMount() {
    const companyCode = this.state.selectedCompany;

    // Get program data
    global.api.getProgramData(companyCode, 1)
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            program: data.program,
            employees: data.employees
          });
          // this.setState({ batchData: data });
        });
  }

  getUserData(userId) {
    this.setState({
      userData: null,
      userDataLoading: true
    });
    global.api.getProgramForUserId(1, userId)
      .then(
        data => {
          this.setState({
            userData: data,
            userDataLoading: false
          });
          // this.setState({ batchData: data });
        });

  }

  render() {

    if (!this.state.program) {
      return <></>;
    }

    return (
      <main className="offset" id="content">
        <section className="section_box">
          <h1 className="title1 mb25">Program Data</h1>
          <h4 className="title4 mb40">For {this.state.selectedCompanyName}</h4>
          <div className="row">
            <div className="col-6">
              <h4 className="title4" style={{
                marginBottom: "10px"
              }}>For {this.state.program.name}</h4>
              {
                Object.entries(this.state.program.levels).map(([index, level]) => (
                  <div key={index}>
                    <div style={{
                      backgroundColor: "dodgerblue",
                      padding: "2px 12px",
                      color: "white"
                    }}>Level: {index}</div>
                    {
                      level.map((module, moduleIndex) => (
                        <div style={{
                          padding: "12px",
                          display: "flex",
                          alignItems: "center"
                        }} key={moduleIndex}>
                          <img src={'/images/icons/icon_module_' + module.module_number + '.svg'} width="52px" alt={module.module_number} />
                          <b>Module {module.module_number}:</b> {module.moduleName}
                        </div>
                      ))
                    }
                  </div>
                ))
              }
              <div style={{ borderBottom: "1px solid #232323", padding: "10px" }}></div>
            </div>
            <div className="col-6">
              {
                this.state.userDataLoading ? (
                  <div>Loading...</div>
                ) : <></>
              }
              {
                this.state.userData ? (
                  <div>
                    <h4 className="title4 mb40" style={{
                      marginTop: "10px"
                    }}>User Details</h4>
                    {
                      Object.entries(this.state.userData.levels).map(([index, level]) => (
                        <div key={index}>
                          <div style={{
                            backgroundColor: "dodgerblue",
                            padding: "2px 12px",
                            color: "white"
                          }}>Level: {index}</div>
                          {
                            level.map((module, moduleIndex) => (
                              <div style={{
                                backgroundColor: module.completed ? "#00FF0011" : "#FF000011",
                                padding: "2px 12px"
                              }} key={moduleIndex}>
                                {module.moduleName}
                              </div>
                            ))
                          }
                        </div>
                      ))
                    }
                  </div>
                ) : <></>
              }
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div id="reports" className="scrollmenu">
                <table style={{ width: "100%" }}>
                  <thead style={{ textAlign: "left" }}>
                    <tr>
                      <th>UserId</th>
                      <th>Name</th>
                      <th>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.dataLoaded ?
                        this.state.employees.length > 0 ?
                          this.state.employees.map(employee => {
                            return (
                              <tr key={employee.userId}>
                                <td
                                  style={{
                                    cursor: "pointer",
                                    color: "dodgerblue",
                                    textDecoration: "underline"
                                  }}
                                  onClick={e => {
                                    this.getUserData(employee.userId);
                                  }}>{employee.userId}</td>
                                <td>{employee.FirstName} {employee.LastName}</td>
                                <td>{employee.level}</td>
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
            </div>
            <div className="col-6">
            </div>
          </div>
        </section>
      </main >
    );
  }
}
export default Program;
