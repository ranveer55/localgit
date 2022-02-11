import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import ReactDatePicker from "react-datepicker";
import endpoints from "../config/endpoints";
import Loader from '../components/Loader/Loader'
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
            users:[],
            dataSets: null,
            loading:false,
            currentValue:''
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }

    componentDidMount() {

      
       this.setState({currentValue : localStorage.getItem("mytime")})
        // getCompanyRegistrationReport 
        switch (localStorage.getItem("mytime")) {
            case "1": // today
                this.loadData(new Date(moment().startOf("day")), new Date(moment().endOf("day")));
                this.setState({
                    startDate: new Date(moment().startOf("day")),
                    endDate: new Date(moment().endOf("day")),
                });
                //localStorage.setItem('mytime',1)
                break;
            case "4": // yesterday
                this.loadData(new Date(moment().subtract(1, 'day').startOf("day")), new Date(moment().subtract(1, 'day').endOf("day")));
                this.setState({
                    startDate: new Date(moment().startOf("day")),
                    endDate: new Date(moment().endOf("day")),
                });
                // localStorage.setItem('mytime',4);
                break;
            case "2": // last week
                this.loadData(new Date(moment().subtract(1, "week").startOf('day')), new Date(moment().endOf("day")));
                // localStorage.setItem('mytime-',2);
                break;
            case "3": // last month
                // localStorage.setItem('mytime',3);
                this.loadData(new Date(moment().subtract(1, "month").startOf('day')), new Date(moment().endOf("day")));
                break;
                case "5": // all
                // localStorage.setItem('mytime',5);
                this.loadData(new Date(moment().subtract(1, "year").startOf('day')), new Date(moment().endOf("day")));
                break;

            default:
                this.setState({currentValue : 5})
                this.loadData(new Date(moment().subtract(1, "year").startOf('day')), new Date(moment().endOf("day")));
                break;
        }
       // this.loadData(this.state.startDate, this.state.endDate);


    }
    downloadCSV(data) {

        //define the heading for each row of the data  
        var csv = ['Email', 'First Name','Last Name', 'Questions Answered', 'Attempts', 'Asked for Review', 'Reviews Completed', '\n'].join(",");

        //merge the data with CSV  
        data.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = `${this.state.cohort.name}.csv`;
        hiddenElement.click();
    }

    loadData(startDate, endDate) {
        this.setState({
            dateLoaded: false,
            loading:true
        });
        global.api.getCompanyCohortSingleReport(
            this.cohortId,
            moment(startDate).format("YYYY-MM-DD"),
            moment(endDate).format("YYYY-MM-DD")
        )
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        startDate: startDate,
                        endDate: endDate,
                        cohort: data.program,
                        users: data.users,
                        dataSets: data.dataSets,
                        loading:false
                    });
                    // this.setState({ batchData: data });
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true,
                    loading:false
                });
            });
    }

     showCertificateButton = (row)=> {
        return (
          <div className="">
            <label className="certificate-button" onClick={() => {
                this.setState({loading:true})
              global.api.createACertificate({
                courseNo: row.courseNumber,
                userId: row.userId,
                interviewSimulator:true
              }).then(response => {
                  this.setState({loading:false})
                // certificate created, refresh the page
                if(response && response.error){
                    alert(response.message)
                } else {
                     window.location.reload();
                }
               
              })
            }}>
              <input className="checkbox" type="checkbox" defaultChecked={row.certificate ? true : false} />
              {
                row.certificate ? (
                  <a target="_blank" rel="noopener noreferrer" href={endpoints.base + "/certificate/" + row.certificate.certificateId}>View</a>
                ) : (
                  <span>Create</span>
                )
              }
            </label>
          </div>
        );
      }


      handleRating = (e,userVal) => {
        global.api.vpiManualRating({
            manual_rating: e.target.value,
            courseNumber: userVal?.courseNumber,
            email: userVal?.userId

          }).then(response => {
              this.setState({loading:false})
            // certificate created, refresh the page
            alert(response.message)

            if(response && response.error){
                alert(response.message)
            } else {
                // window.location.reload();
            }
           
          })
      }

    render() {

        const cohort = this.state.cohort;
        const {loading} =this.state;

        return (
            <main className="offset" id="content">
                {loading && <Loader />}
                <div className="row">
                    <div className="">
                       
                        <h4 className="title4 mb40">
                            For {this.state?.cohort?.name} ({moment(this.state.startDate).format("DD-MM-YYYY")} - {moment(this.state.endDate).format("DD-MM-YYYY")})
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
                            {/* date range drop down */}
                            <div style={{
                                padding: "2px 8px",
                                margin: "0px 8px",
                                fontWeight: "500"
                            }}>
                                <select onChange={e => {
                                    switch (e.target.value) {
                                        case "1": // today
                                            this.loadData(new Date(moment().startOf("day")), new Date(moment().endOf("day")));
                                            this.setState({
                                                startDate: new Date(moment().startOf("day")),
                                                endDate: new Date(moment().endOf("day")),
                                            });
                                            localStorage.setItem('mytime',1)
                                            break;
                                        case "4": // yesterday
                                            this.loadData(new Date(moment().subtract(1, 'day').startOf("day")), new Date(moment().subtract(1, 'day').endOf("day")));
                                            this.setState({
                                                startDate: new Date(moment().startOf("day")),
                                                endDate: new Date(moment().endOf("day")),
                                            });
                                            localStorage.setItem('mytime',4);
                                            break;
                                        case "2": // last week
                                            this.loadData(new Date(moment().subtract(1, "week").startOf('day')), new Date(moment().endOf("day")));
                                            localStorage.setItem('mytime',2);
                                            break;
                                        case "3": // last month
                                            localStorage.setItem('mytime',3);
                                            this.loadData(new Date(moment().subtract(1, "month").startOf('day')), new Date(moment().endOf("day")));
                                            break;
                                            case "5": // all
                                            localStorage.setItem('mytime',5);
                                            this.loadData(new Date(moment().subtract(1, "year").startOf('day')), new Date(moment().endOf("day")));
                                            break;

                                        default:
                                            this.loadData(new Date(moment().subtract(1, "year").startOf('day')), new Date(moment().endOf("day")));
                                            localStorage.setItem('mytime',5);
                                            break;
                                    }
                                }} defaultValue="">
                                    <option value="" disabled>Select Timespan</option>
                                    <option selected={this.state.currentValue == 1} value="1">Today</option>
                                    <option selected={this.state.currentValue == 4} value="4">Yesterday</option>
                                    <option selected={this.state.currentValue == 2} value="2">Last Week</option>
                                    <option selected={this.state.currentValue == 3} value="3">Last Month</option>
                                    <option selected={this.state.currentValue == 5} value="5">Last Year</option>
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
                                {
                                    cohort ? (
                                        <>
                                            <div><b>Cohort:</b> {this.state.cohort.name}</div>
                                            <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                                                <button
                                                    onClick={e => {
                                                        this.downloadCSV(this.state.users.map(u => {
                                                            return [
                                                                u.userId,
                                                                u.FirstName ,
                                                                u.LastName,
                                                                u.distinctAttempts,
                                                                u.totalAttempts,
                                                                u.Asked_for_Review,
                                                                u.Reviews_Completed,
                                                            ];
                                                        }));
                                                    }}
                                                    className="btn btn-size3 btn-blue btn-radius export">
                                                    <span>Download CSV</span>
                                                </button>
                                            </div>
                                            <table className="table" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{width:'250px'}}>Email</th>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Questions Answered</th>
                                                        <th>Attempts</th>
                                                        <th>Asked for Review</th>
                                                        <th>Reviews Completed</th>
                                                        <th>Practice Answer</th>
                                                        <th>Manual Rating</th>
                                                        <th>Certificate</th>
                                                        <th> </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                    this.state.users.map((user) => (
                                                            <tr>
                                                                <td style={{ wordBreak: "break-all" }}>{user.userId}</td>
                                                                <td>{user.FirstName}</td>
                                                                <td>{user.LastName}</td>
                                                                <td>{user.distinctAttempts}</td>
                                                                <td>{user.totalAttempts}</td>
                                                                <td>{user.Asked_for_Review}</td>
                                                                <td>{user.Reviews_Completed}</td>
                                                                <td>{user.Practice_Answer}</td>
                                                                <td>
                                                                    <select onChange={(e)=>{this.handleRating(e,user)}}>
                                                                        <option>Select</option>
                                                                        <option selected={user.manual_rating == 'red'} value="red">Red</option>
                                                                        <option selected={user.manual_rating == 'yellow'} value="yellow">Yellow</option>
                                                                        <option selected={user.manual_rating == 'green'} value="green">Green</option>

                                                                    </select>
                                                                </td>
                                                                <td>{this.showCertificateButton(user)}</td>
                                                                <td><a href={"/interview-simulator/" + this.cohortId + "/user-attempts/" + user.userId}>Show Activity</a></td>
                                                                </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </>
                                    ) : <>No Data</>
                                }
                            </h4>
                        </div>
                    </div>
                    <div>
                    </div>
                </section>
            </main>
        );
    }
}

export default InterviewSimulatorCohortPage;
function LineChart({data, cohort, startDate, endDate}) {
let labels =[];
let distinctAttempts =[];
let totalAttempts =[];
let Asked_for_Review =[];
let Reviews_Completed =[];
if(data && data.Asked_for_Review){
    for (const label of Object.keys(data.Asked_for_Review)) {
        labels.push(label);
        distinctAttempts.push(data.distinctAttempts[label]);
        totalAttempts.push(data.totalAttempts[label]);
        Asked_for_Review.push(data.Asked_for_Review[label]);
        Reviews_Completed.push(data.Reviews_Completed[label]);
    }
}
labels = labels.map(l=> moment(l).format('DD-MM-YYYY'))
 

const datasets = [
    {
      label: 'Questions Answered',
      data: distinctAttempts,
      borderColor: 'red',
      backgroundColor: 'red',
      fill: false,
    },
    {
      label: 'Attempts',
      data: totalAttempts,
      borderColor: '#4E024E',
      backgroundColor: '#4E024E',
      fill: false,
    },
    {
      label: 'Asked for Review',
      data: Asked_for_Review,
      borderColor: 'green',
      backgroundColor: 'green',
      fill: false,
    },
    {
      label: 'Reviews Completed',
      data:Reviews_Completed,
      borderColor: 'blue',
      backgroundColor: 'blue',
      fill: false,
    },
    
  ]
    return (
        <Line data={{
            labels,
            datasets,
        }}
            options={{
                responsive: true,
                hover: true,
                tooltips: {
                    mode: "x",
                    intersect: false
                },
                scales: {
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true
                            },
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
                    ]
                },
            }} />
    );
}
