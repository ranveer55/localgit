import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import ReactDatePicker from "react-datepicker";

class CompanyRegActReport extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      startDate: new Date(moment().subtract(1, "week")),
      endDate: new Date(moment()),
      usersRegisteredCount: 0,
      usersActivatedCount: 0,
      allRegisteredUsers: [],
      report: []
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  downloadCSV(data) {

    //define the heading for each row of the data  
    var csv = ['Email', 'Name', 'Contact Number', 'Location', 'Registration Date', 'Activation Date', 'Points Scored', '% Completed', '\n'].join(",");

    //merge the data with CSV  
    data.forEach(function (row) {
      csv += row.join(',');
      csv += "\n";
    });
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'Registration and Activation report.csv';
    hiddenElement.click();
  }

  componentDidMount() {
    // getCompanyRegistrationReport 
    this.loadData(this.state.startDate, this.state.endDate);


  }

  loadData(startDate, endDate) {
    this.setState({
      dateLoaded: false
    });
    global.api.getCompanyRegActReport(
      this.companyCode,
      moment(startDate).format("YYYY-MM-DD"),
      moment(endDate).format("YYYY-MM-DD")
    )
      .then(
        data => {
          this.setState({
            dataLoaded: true,
            startDate: startDate,
            endDate: endDate,
            usersRegisteredCount: data.usersRegisteredCount,
            usersActivatedCount: data.usersActivatedCount,
            report: data.report,
            allRegisteredUsers: data.allRegisteredUsers,
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


    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Company Registration and Activation Report</h1>
              <h4 className="title4 mb40">
                For {this.state.selectedCompanyName} ({moment(this.state.startDate).format("DD-MM-YYYY")} - {moment(this.state.endDate).format("DD-MM-YYYY")})
                </h4>
              <div id="reports" className="scrollmenu">
                {/* The chard */}
                <LineChart
                  label="Company Registration and Activation"
                  labels={this.state.report.map(r => moment(r.date).format('DD MMM'))}
                  data={this.state.report.map(r => r.usersRegistered.length)} />
                {/* date range and register and activation count */}
                <div style={{ padding: "8px 0" }}>
                  <span style={{ padding: "2px 8px", margin: "0 8px", fontWeight: "500" }}>Date Range</span>
                  <ReactDatePicker
                    dateFormat="dd-MM-yyyy"
                    selected={this.state.startDate}
                    showMonthDropdown
                    showYearDropdown
                    onChange={date => {
                      this.loadData(date, new Date(moment(date).add(1, 'week')));
                    }}
                  />
                  <span style={{ padding: "2px 8px", margin: "0 8px" }}>to</span>
                  <ReactDatePicker
                    dateFormat="dd-MM-yyyy"
                    selected={this.state.endDate}
                    showMonthDropdown
                    showYearDropdown
                    onChange={date => {
                      this.loadData(this.state.startDate, date);
                    }}
                  />
                </div>
                <span style={{ padding: "2px 8px", margin: "0 8px", fontWeight: "700" }}>Students Registered: {this.state.usersRegisteredCount}</span>
                <span style={{ padding: "2px 8px", margin: "0 8px", fontWeight: "700" }}>Students Activated: {this.state.usersActivatedCount}</span>
              </div>
              <br />
              <br />
              <br />
            </div>
          </div>
          <div>
            <div style={{ textAlign: "right", marginBottom: "1rem" }}>
              <button
                onClick={e => {
                  this.downloadCSV(this.state.allRegisteredUsers.map(u => {
                    return [
                      u.userId,
                      u.FirstName + " " + u.LastName,
                      u.Mobile,
                      u.Location ? u.Location.replace(",", " ") : "",
                      u.accountCreationDate,
                      u.activationDate,
                      u.totalScore,
                      parseInt(u.courseCompleted).toFixed(2)
                    ];
                  }));
                }}
                className="btn btn-size3 btn-blue btn-radius export">
                <span>Download CSV</span>
              </button>
            </div>
            <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Location</th>
                  <th>Last Lesson</th>
                  <th>Registration Date</th>
                  <th>Activation Date</th>
                  <th>Points Scored</th>
                  <th>% Completed</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.dataLoaded ?
                    this.state.allRegisteredUsers.length > 0 ?
                      this.state.allRegisteredUsers.map(report => {
                        return (
                          <tr key={report.userId}>
                            <td>{report.FirstName} {report.LastName}</td>
                            <td>{report.userId}</td>
                            <td>{report.Mobile}</td>
                            <td>{report.Location}</td>
                            <td>{report.last_lesson ? report.last_lesson : 0}</td>
                            <td>{report.accountCreationDate ? moment(report.accountCreationDate).format('DD-MM-YYYY') : ""}</td>
                            <td>{report.activationDate ? moment(report.activationDate).format('DD-MM-YYYY') : ""}</td>
                            <td>{report.totalScore}</td>
                            <td>{parseInt(report.courseCompleted).toFixed(2)} %</td>
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
        </section>
      </main>
    );
  }
}

function LineChart({
  label = '# of Votes',
  labels = ['1', '2', '3', '4', '5', '6'],
  data = [12, 19, 3, 5, 2, 3]
}) {
  return (
    <Line data={{
      labels,
      datasets: [
        {
          label,
          data,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    }} options={{
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback(label, index, labels) {
                // only show if whole number
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            },
          },
        ],
      },
    }} />
  );
}


export default CompanyRegActReport;
