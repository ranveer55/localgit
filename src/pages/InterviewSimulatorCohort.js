import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import ReactDatePicker from "react-datepicker";
import endpoints from "../config/endpoints";
import Loader from "../components/Loader/Loader";
import "./index.css";
class InterviewSimulatorCohortPage extends Component {
  constructor(props) {
    super(props);

    this.cohortId = props.match.params.cohortId;

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      cohort: null,
      dateLoaded: false,
      startDate: new Date(moment().subtract(1, "week")),
      endDate: new Date(moment()),
      users: [],
      dataSets: null,
      loading: false,
      currentValue: "",
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    this.setState({ currentValue: localStorage.getItem("mytime") });
    // getCompanyRegistrationReport
    switch (localStorage.getItem("mytime")) {
      case "1": // today
        this.loadData(
          new Date(moment().startOf("day")),
          new Date(moment().endOf("day"))
        );
        this.setState({
          startDate: new Date(moment().startOf("day")),
          endDate: new Date(moment().endOf("day")),
        });
        //localStorage.setItem('mytime',1)
        break;
      case "4": // yesterday
        this.loadData(
          new Date(moment().subtract(1, "day").startOf("day")),
          new Date(moment().subtract(1, "day").endOf("day"))
        );
        this.setState({
          startDate: new Date(moment().startOf("day")),
          endDate: new Date(moment().endOf("day")),
        });
        // localStorage.setItem('mytime',4);
        break;
      case "2": // last week
        this.loadData(
          new Date(moment().subtract(1, "week").startOf("day")),
          new Date(moment().endOf("day"))
        );
        // localStorage.setItem('mytime-',2);
        break;
      case "3": // last month
        // localStorage.setItem('mytime',3);
        this.loadData(
          new Date(moment().subtract(1, "month").startOf("day")),
          new Date(moment().endOf("day"))
        );
        break;
      case "5": // all
        // localStorage.setItem('mytime',5);
        this.loadData(
          new Date(moment().subtract(1, "year").startOf("day")),
          new Date(moment().endOf("day"))
        );
        break;

      default:
        this.setState({ currentValue: 5 });
        this.loadData(
          new Date(moment().subtract(1, "year").startOf("day")),
          new Date(moment().endOf("day"))
        );
        break;
    }
    // this.loadData(this.state.startDate, this.state.endDate);
  }
  
  downloadCSV(data) {
    //define the heading for each row of the data
    var csv = [
      "Email",
      "First Name",
      "Last Name",
      "Questions Answered",
      "% OF QUESTIONS ANSWERED",
      "Attempts",
      "ATTEMPTS PER QUESTION",
      "Asked for Review",
      "% REVIEWS REQUESTED",
      "Reviews Completed",
      "%REVIEWS COMPLETED",
      "NOTES",
      "% QUESTIONS WITH NOTES",
      "Manual Rating",
      "VPI Score(Max & Min)",
      "\n",
    ].join(",");

    //merge the data with CSV
    data.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = `${this.state.cohort.name}.csv`;
    hiddenElement.click();
  }

  loadData(startDate, endDate) {
    this.setState({
      dateLoaded: false,
      loading: true,
    });
    global.api
      .getCompanyCohortSingleReport(
        this.cohortId,
        moment(startDate).format("YYYY-MM-DD"),
        moment(endDate).format("YYYY-MM-DD")
      )
      .then((data) => {
        this.setState({
          dataLoaded: true,
          startDate: startDate,
          endDate: endDate,
          cohort: data.program,
          users: data.users,
          dataSets: data.dataSets,
          loading: false,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
          loading: false,
        });
      });
  }

  showCertificateButton = (row) => {
    return (
      <div className="">
        <label
          className="certificate-button"
          onClick={() => {
            this.setState({ loading: true });
            global.api
              .createACertificate({
                courseNo: row.courseNumber,
                userId: row.userId,
                interviewSimulator: true,
              })
              .then((response) => {
                this.setState({ loading: false });
                // certificate created, refresh the page
                if (response && response.error) {
                  alert(response.message);
                } else {
                  window.location.reload();
                }
              });
          }}
        >
          <input
            className="checkbox"
            type="checkbox"
            defaultChecked={row.certificate ? true : false}
          />
          {row.certificate ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                endpoints.base + "/certificate/" + row.certificate.certificateId
              }
            >
              View
            </a>
          ) : (
            <span>Create</span>
          )}
        </label>
      </div>
    );
  };

  exportVpiData  = () => {
    // this.setState({
    //   dateLoaded: false,
    //   loading: true,
    // });
    global.api
      .exportVpiData(
        this.cohortId,
        moment(this.state.startDate).format("YYYY-MM-DD"),
        moment(this.state.endDate).format("YYYY-MM-DD")
      )
      .then((data) => {
        this.setState({
          dataLoaded: true,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          cohort: data.program,
          users: data.users,
          dataSets: data.dataSets,
          loading: false,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
          loading: false,
        });
      });
  }

  handleRating = (e, userVal) => {
    global.api
      .vpiManualRating({
        cohort_id: this.cohortId,
        startDate: moment(this.state.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.state.endDate).format("YYYY-MM-DD"),
        manual_rating: e.target.value,
        courseNumber: userVal?.courseNumber,
        email: userVal?.userId,
      })
      .then((response) => {
        this.setState({ loading: false });
        // certificate created, refresh the page
        this.setState({
          dataLoaded: true,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          cohort: response.program,
          users: response.users,
          dataSets: response.dataSets,
          loading: false,
        });
        alert(response.message);

        if (response && response.error) {
          alert(response.message);
        } else {
          // window.location.reload();
        }
      });
  };

  render() {
    const cohort = this.state.cohort;
    const { loading } = this.state;

    return (
      <main className="offset" id="content">
        {loading && <Loader />}
        <div className="row">
          <div className="">
            <h4 className="title4 mb40">
              For {this.state?.cohort?.name} (
              {moment(this.state.startDate).format("DD-MM-YYYY")} -{" "}
              {moment(this.state.endDate).format("DD-MM-YYYY")})
            </h4>
            <div id="reports" className="scrollmenu">
              {/* The chart, zoom restorer helps with the stupid zoomout previous dev put in */}
              {/* <div className="zoom-restorer">
                                <div className="zoom-unrestorer">
                                    <LineChart
                                        cohort={cohort } 
                                        startDate={this.state.startDate} 
                                        endDate={this.state.endDate} 
                                        data={this.state.dataSets} 
                                       
                                         />
                                </div>
                            </div> */}
              {/* date range and register and activation count */}
              <div style={{ padding: "8px 0" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    margin: "0 8px",
                    fontWeight: "500",
                  }}
                >
                  Date Range
                </span>
                <ReactDatePicker
                  dateFormat="dd-MM-yyyy"
                  selected={this.state.startDate}
                  showMonthDropdown
                  showYearDropdown
                  onChange={(date) => {
                    this.loadData(date, new Date(moment(date).add(1, "week")));
                  }}
                />
                <span style={{ padding: "2px 8px", margin: "0 8px" }}>to</span>
                <ReactDatePicker
                  dateFormat="dd-MM-yyyy"
                  selected={this.state.endDate}
                  showMonthDropdown
                  showYearDropdown
                  onChange={(date) => {
                    this.loadData(this.state.startDate, date);
                  }}
                />
              </div>
              {/* date range drop down */}
              <div
                style={{
                  padding: "2px 8px",
                  margin: "0px 8px",
                  fontWeight: "500",
                }}
              >
                <select
                  onChange={(e) => {
                    switch (e.target.value) {
                      case "1": // today
                        this.loadData(
                          new Date(moment().startOf("day")),
                          new Date(moment().endOf("day"))
                        );
                        this.setState({
                          startDate: new Date(moment().startOf("day")),
                          endDate: new Date(moment().endOf("day")),
                        });
                        localStorage.setItem("mytime", 1);
                        break;
                      case "4": // yesterday
                        this.loadData(
                          new Date(moment().subtract(1, "day").startOf("day")),
                          new Date(moment().subtract(1, "day").endOf("day"))
                        );
                        this.setState({
                          startDate: new Date(moment().startOf("day")),
                          endDate: new Date(moment().endOf("day")),
                        });
                        localStorage.setItem("mytime", 4);
                        break;
                      case "2": // last week
                        this.loadData(
                          new Date(moment().subtract(1, "week").startOf("day")),
                          new Date(moment().endOf("day"))
                        );
                        localStorage.setItem("mytime", 2);
                        break;
                      case "3": // last month
                        localStorage.setItem("mytime", 3);
                        this.loadData(
                          new Date(
                            moment().subtract(1, "month").startOf("day")
                          ),
                          new Date(moment().endOf("day"))
                        );
                        break;
                      case "5": // all
                        localStorage.setItem("mytime", 5);
                        this.loadData(
                          new Date(moment().subtract(1, "year").startOf("day")),
                          new Date(moment().endOf("day"))
                        );
                        break;

                      default:
                        this.loadData(
                          new Date(moment().subtract(1, "year").startOf("day")),
                          new Date(moment().endOf("day"))
                        );
                        localStorage.setItem("mytime", 5);
                        break;
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Timespan
                  </option>
                  <option selected={this.state.currentValue == 1} value="1">
                    Today
                  </option>
                  <option selected={this.state.currentValue == 4} value="4">
                    Yesterday
                  </option>
                  <option selected={this.state.currentValue == 2} value="2">
                    Last 7 days
                  </option>
                  <option selected={this.state.currentValue == 3} value="3">
                    Last 30 days
                  </option>
                  <option selected={this.state.currentValue == 5} value="5">
                    Last 365 days
                  </option>
                </select>
              </div>
            </div>
            <br />
            <br />
            <br />
          </div>
        </div>

        <section className="section_box">
          <div className="row">
            <div className="col-md-12">
              <h1 className="title1 mb25">Company Cohorts</h1>
              <h4 className="title4 mb40">
                {cohort ? (
                  <>
                    <div>
                      <b>Cohort:</b> {this.state.cohort.name}
                    </div>
                    <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                      <button
                        onClick={(e) => {
                          this.downloadCSV(
                            this.state.users.map((u) => {
                              let vpiArray = [];
                              let vpi_scores =
                                !!u?.vpi_score &&
                                u?.vpi_score.length > 0 &&
                                u?.vpi_score.filter(
                                  (item, i) => item?.vpi_score != null
                                );

                              !!vpi_scores &&
                                vpi_scores.length > 0 &&
                                vpi_scores.forEach((item) => {
                                  let res = JSON.parse(item?.vpi_score);
                                  vpiArray.push(parseFloat(res?.fluency_score));
                                });

                              let maxVpiVal = Math.max(...vpiArray);
                              let minVpiVal = Math.min(...vpiArray);
                              let finalVpiScore =
                                vpiArray.length > 0
                                  ? vpiArray.length == 1
                                    ? maxVpiVal.toFixed(2)
                                    : vpiArray.length > 1
                                    ? maxVpiVal.toFixed(2) +
                                      " - " +
                                      minVpiVal.toFixed(2)
                                    : "-"
                                  : "-";

                                  let distinctAttemptsCount = 
                                  ((u.distinctAttempts * 100) / u.distinctAttemptsCount[0]).toFixed(2) + '%';
                                 
                                  let totalAttemptsCount = (
                                    u.totalAttempts /
                                    u.distinctAttemptsCount[0]
                                  ).toFixed(2) + '%';
                                  
                                 let Asked_for_Review_count = !!u.Asked_for_Review && u.Asked_for_Review.length > 0 ?  (
                                    u.Asked_for_Review[0].length /
                                    u.distinctAttemptsCount[0]
                                  ).toFixed(2) + '%' : '';

                                  let Reviews_Completed_count = !!u.Reviews_Completed && u.Reviews_Completed.length > 0 ? (
                                    u.Reviews_Completed[0].length /
                                    u.distinctAttemptsCount[0]
                                  ).toFixed(2) + '%' : '';

                                 let Practice_Answer_Count = !!u.Practice_Answer && u.Practice_Answer.length > 0 ?  (
                                    u.Practice_Answer[0] /
                                    u.distinctAttemptsCount[0]
                                  ).toFixed(2) + '%' : '';
                             
                                  let Asked_for_Review = !!u.Asked_for_Review && u.Asked_for_Review.length > 0 ? u.Asked_for_Review[0].length  : ''
                                  let Reviews_Completed =  !!u.Reviews_Completed && u.Reviews_Completed.length > 0 ? u.Reviews_Completed[0].length  : ''
                                  let Practice_Answer = !!u.Practice_Answer && u.Practice_Answer.length > 0 ? u.Practice_Answer[0].length  : ''

                                  if (cohort?.vpi_value == 1) {
                                return [
                                  u.userId,
                                  u.FirstName,
                                  u.LastName,
                                  u.distinctAttempts,
                                  distinctAttemptsCount,
                                  u.totalAttempts,
                                  totalAttemptsCount,
                                  Asked_for_Review,
                                  Asked_for_Review_count,
                                  Reviews_Completed,
                                  Reviews_Completed_count,
                                  Practice_Answer,
                                  Practice_Answer_Count,
                                  u.manual_rating,
                                  finalVpiScore,
                                ];
                              } else {
                                return [
                                  u.userId,
                                  u.FirstName,
                                  u.LastName,
                                  u.distinctAttempts,
                                  distinctAttemptsCount,
                                  u.totalAttempts,
                                  totalAttemptsCount,
                                  Asked_for_Review,
                                  Asked_for_Review_count,
                                  Reviews_Completed,
                                  Reviews_Completed_count,
                                  Practice_Answer,
                                  Practice_Answer_Count,
                                ];
                              }
                            })
                          );
                        }}
                        className="btn btn-size3 btn-blue btn-radius export"
                      >
                        <span>Download CSV</span>
                      </button>
                      <button onClick={this.exportVpiData}className="btn btn-size3 btn-blue btn-radius export">
                        <span>Email VPI Report</span>
                      </button>
                    </div>
                    <div id="table-wrapper">
                      <div id="table-scroll">
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "250px" }}>Email</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Questions Answered</th>
                              <th>% of questions answered</th>
                              <th>Attempts</th>
                              <th>Attempts per question</th>
                              <th>Asked for Review</th>
                              <th>% Reviews Requested</th>
                              <th>Reviews Completed</th>
                              <th>%Reviews Completed </th>
                              <th>Notes</th>
                              <th>% Questions with notes</th>
                              {cohort?.vpi_value == 1 && (
                                <>
                                  <th>Manual Rating</th>
                                  <th>Vpi Score(Max & Min value)</th>
                                </>
                              )}
                              {/* <th>Certificate</th> */}
                              <th> </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.users.map((user) => {
                              let vpiArray = [];
                              let vpi_scores =
                                !!user?.vpi_score &&
                                user?.vpi_score.length > 0 &&
                                user?.vpi_score.filter(
                                  (item, i) => item?.vpi_score != null
                                );

                              !!vpi_scores &&
                                vpi_scores.length > 0 &&
                                vpi_scores.forEach((item) => {
                                  let res = JSON.parse(item?.vpi_score);
                                  vpiArray.push(parseFloat(res?.fluency_score));
                                });

                              let maxVpiVal = Math.max(...vpiArray);
                              let minVpiVal = Math.min(...vpiArray);
                              return (
                                <tr>
                                  <td style={{ wordBreak: "break-all" }}>
                                    {user.userId}
                                  </td>
                                  <td>{user.FirstName}</td>
                                  <td>{user.LastName}</td>
                                  <td>{user.distinctAttempts}</td>
                                  <td>
                                    {!!user.distinctAttemptsCount && user.distinctAttemptsCount.length > 0 ?  (
                                      (user.distinctAttempts * 100) /
                                      user.distinctAttemptsCount[0]
                                    ).toFixed(2) +'%': ''}
                                   
                                  </td>
                                  <td>{user.totalAttempts}</td>
                                  <td>
                                    {!!user.distinctAttemptsCount && user.distinctAttemptsCount.length > 0 ? (
                                      user.totalAttempts /
                                      user.distinctAttemptsCount[0]
                                    ).toFixed(2): ''}
                                  
                                  </td>
                                  <td>{!!user?.Asked_for_Review && user?.Asked_for_Review.length > 0 && user?.Asked_for_Review[0].length}</td>
                                  <td>
                                    {
                                     user?.Asked_for_Review.length > 0 ? (user?.Asked_for_Review[0].length /
                                      user?.distinctAttemptsCount[0]
                                    ).toFixed(2)+'%'
                                  : ''}
                                    
                                  </td>
                                  <td>

                                      {user?.Reviews_Completed.length > 0 ?  user.Reviews_Completed[0].length : ''}
                                      </td>
                                  <td>
                                    {user?.Reviews_Completed.length > 0 ? (
                                      user.Reviews_Completed[0].length /
                                      user.distinctAttemptsCount[0]
                                    ).toFixed(2)+'%' : ''}
                                  </td>
                                  <td>
                                    {user?.Practice_Answer.length > 0 ? user.Practice_Answer[0] : ''}</td>
                                  <td>
                                    {user?.Practice_Answer.length > 0 ?(
                                      user.Practice_Answer[0] /
                                      user.distinctAttemptsCount[0]
                                    ).toFixed(2)+'%' : ''}
                                  </td>
                                  {cohort?.vpi_value == 1 && (
                                    <>
                                      {" "}
                                      <td>
                                        <span
                                          className={`manual_rating ${user.manual_rating}`}
                                        >
                                          {user.manual_rating}
                                        </span>
                                      </td>
                                      <td>
                                        {vpiArray.length > 0
                                          ? vpiArray.length == 1
                                            ? maxVpiVal.toFixed(2)
                                            : vpiArray.length > 1
                                            ? maxVpiVal.toFixed(2) +
                                              " - " +
                                              minVpiVal.toFixed(2)
                                            : "-"
                                          : "-"}
                                      </td>
                                    </>
                                  )}
                                  {/* <td>{this.showCertificateButton(user)}</td> */}
                                  <td>
                                    <a
                                      href={
                                        "/interview-simulator/" +
                                        this.cohortId +
                                        "/user-attempts/" +
                                        user.userId
                                      }
                                    >
                                      Show Activity
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <>No Data</>
                )}
              </h4>
            </div>
          </div>
          <div></div>
        </section>
      </main>
    );
  }
}

export default InterviewSimulatorCohortPage;
// function LineChart({ data, cohort, startDate, endDate }) {
//   let labels = [];
//   let distinctAttempts = [];
//   let totalAttempts = [];
//   let Asked_for_Review = [];
//   let Reviews_Completed = [];
//   if (data && data.Asked_for_Review) {
//     for (const label of Object.keys(data.Asked_for_Review)) {
//       labels.push(label);
//       distinctAttempts.push(data.distinctAttempts[label]);
//       totalAttempts.push(data.totalAttempts[label]);
//       Asked_for_Review.push(data.Asked_for_Review[label]);
//       Reviews_Completed.push(data.Reviews_Completed[label]);
//     }
//   }
//   labels = labels.map((l) => moment(l).format("DD-MM-YYYY"));

//   const datasets = [
//     {
//       label: "Questions Answered",
//       data: distinctAttempts,
//       borderColor: "red",
//       backgroundColor: "red",
//       fill: false,
//     },
//     {
//       label: "Attempts",
//       data: totalAttempts,
//       borderColor: "#4E024E",
//       backgroundColor: "#4E024E",
//       fill: false,
//     },
//     {
//       label: "Asked for Review",
//       data: Asked_for_Review,
//       borderColor: "green",
//       backgroundColor: "green",
//       fill: false,
//     },
//     {
//       label: "Reviews Completed",
//       data: Reviews_Completed,
//       borderColor: "blue",
//       backgroundColor: "blue",
//       fill: false,
//     },
//   ];
//   return (
//     <Line
//       data={{
//         labels,
//         datasets,
//       }}
//       options={{
//         responsive: true,
//         hover: true,
//         tooltips: {
//           mode: "x",
//           intersect: false,
//         },
//         scales: {
//           yAxes: [
//             {
//               scaleLabel: {
//                 display: true,
//               },
//               ticks: {
//                 beginAtZero: true,
//                 userCallback(label, index, labels) {
//                   // only show if whole number
//                   if (Math.floor(label) === label) {
//                     return label;
//                   }
//                 },
//               },
//             },
//           ],
//         },
//       }}
//     />
//   );
// }
