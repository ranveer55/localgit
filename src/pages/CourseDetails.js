import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider, PaginationListStandalone } from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
//import Loader from "react-loader-spinner";
import filterFactory from 'react-bootstrap-table2-filter';
import { Progress } from 'reactstrap';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import * as moment from 'moment'
import queryString from 'query-string';
import endpoints from "../config/endpoints";

const { SearchBar } = Search;

class CourseDetails extends Component {

  constructor(props) {
    super(props);
    let params = queryString.parse(this.props.location.search)

    if (this.props.location.state === undefined && params.courseId === undefined && params.courseName === undefined) {
      window.location.href = '/courses';
    }
    let courseId = ''
    let courseName = ''
    if (this.props.location.state !== undefined) {
      if (this.props.location.state.courseId !== undefined && this.props.location.state.courseName !== undefined) {
        courseId = this.props.location.state.courseId;
        courseName = this.props.location.state.courseName;
      }
    }
    if (params.courseName !== undefined && params.courseId !== undefined) {
      courseId = params.courseId;
      courseName = params.courseName;
    }
    //Set attendance Table Settings
    this.state = {
      courseId: courseId,
      courseName: courseName,
      attendanceColumns: [
        { dataField: "Id", text: "Id", csvExport: false, hidden: true },
        {
          text: "Email",
          dataField: "userId",
          sort: true,
          classes: 'entry-text',
          headerStyle: {
            width: "25%"
          }
        },
        {
          dataField: "FirstName",
          text: "FirstName",
          sort: true,
          headerStyle: {
            width: "15%"
          }
        },
        {
          dataField: "LastName",
          text: "LastName",
          headerStyle: {
            width: "15%"
          }
        },
        {
          text: "Registered",
          dataField: "dateRegistered",
          headerStyle: {
            width: "10%"
          }
        },
        {
          text: "TimeSpent",
          dataField: "totalTimeSpent",
          headerStyle: {
            width: "10%"
          }
        },
        {
          text: "Total Lessons",
          dataField: "totalLessons",
          headerStyle: {
            width: "10%"
          }
        },
        {
          text: "Lessons Completed",
          dataField: "lessonsCompleted",
          headerStyle: {
            width: "10%"
          }
        },
        {
          text: "Current Milestone",
          dataField: "currentMilestone",
          headerStyle: {
            width: "10%"
          }
        },
        {
          text: "Score",
          dataField: "totalScore",
          headerStyle: {
            width: "10%"
          }
        },
        {
          text: "Is Certificate Available",
          formatter: showCertificateButton,
          dataField: "certificate",
          headerStyle: {
            width: "10%"
          }
        },
        {
          text: "Completion",
          dataField: "completionPercentage",
          formatter: completionFormater,
          headerStyle: {
            width: "20%"
          }
        },
      ],
      attendanceData: [{ 'message': 'nodata' }],
      empColumns: [

        {
          dataField: "FirstName",
          text: "FirstName",
          sort: true,
          headerStyle: {
            width: "15%"
          }
        },
        {
          dataField: "LastName",
          text: "LastName",
          headerStyle: {
            width: "15%"
          }
        },
        {
          text: "EMAIL",
          dataField: "userId",
          sort: true,
          classes: "entry-text",
          headerStyle: {
            width: "30%"
          }
        },
        {
          text: "PHONE",
          dataField: "Mobile",
          sort: true,
          headerStyle: {
            width: "20%"
          }
        },
        {
          text: "LOCATION",
          dataField: "Location",
          formatter: locationFormater,
          sort: true,
          headerStyle: {
            width: "20%"
          }
        }
      ],
      empData: []
    };
    this.state.attenSelected = [];
    this.state.empSelected = [];
    this.state.empNodata = false;
    this.state.totalData = [];
    this.state.notification = {
      title: '',
      message: '',
      type: 'default',                // 'default', 'success', 'info', 'warning'
      container: 'top-right',                // where to position the notifications
      animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
      animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    };

    //Column Formatter methods
    function completionFormater(cell, row) {
      const percentage = row.totalLessons > 0 ? ((row.lessonsCompleted / row.totalLessons) * 100).toFixed(2) : 0;
      return (
        <div className="table_progres_bar">
          <Progress value={percentage}>{percentage}%</Progress>
        </div>
      );
      // return (
      //   <div className="table_progres_bar">
      //     <Progress value={row.completionPercentage}>{row.completionPercentage}%</Progress>
      //   </div>
      // );
    }

    //Column Formatter methods
    function showCertificateButton(cell, row) {
      return (
        <div className="">
          <label className="certificate-button" onClick={() => {
            global.api.createACertificate({
              courseNo: row.courseNumber,
              userId: row.userId
            }).then(response => {
              // certificate created, refresh the page
              window.location.reload();
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
    function locationFormater(cell, row) {
      return (
        <div>
          <div className="table_location">{row.Location}</div>
          <div className="table_location_it">Department Name</div>
        </div>
      );
    }

  }
  //remote Data Load
  componentDidMount() {
    global.api.getCourseDetails(global.companyCode, this.state.courseId)
      .then(res => res)
      .then((json) => {
        this.setState({ attendanceData: json.registered.map(r => { r.courseNumber = json.courseNumber; return r; }) })
        this.setState({ empData: json.availableToRegister })
      })
      .catch(err => {
        alert(err);
      })
  }
  componentWillReceiveProps(newProps) {
    this.setState(() => ({
      attenSelected: []
    }));
    this.setState(() => ({
      empSelected: []
    }));
    this.setState({ attendanceData: [] })
    this.setState({ empData: [] })
    global.api.getCourseDetails(global.companyCode, this.state.courseId)
      .then(res => res)
      .then((json) => {
        this.setState({ attendanceData: json.registered.map(r => { r.courseNumber = json.courseNumber; return r; }) })
        this.setState({ empData: json.availableToRegister })
      })
      .catch(err => {
        alert(err);
      })
  }

  handleDeleteClick = e => {
    e.preventDefault();
    if (this.state.attenSelected.length === 0) {
      alert("please select one user");
      return false;
    } else {
      var userIds = this.state.attenSelected[0]
      var companyCode = global.companyCode;
      //var courseNumber = this.state.courseId
      global.api.deleteEmpCourse(userIds, companyCode, this.state.courseId)
        .then(res => res)
        .then((json) => {
          var notification = this.state.notification
          if (json.data.message === 'Employee is removed from this Course') {
            notification.type = 'success';
            notification.title = 'Success';
            notification.message = json.data.message
            store.addNotification({
              ...notification
            });
            this.setState(() => ({
              attenSelected: []
            }));
            this.setState(() => ({
              empSelected: []
            }));
            this.props.history.replace({ //browserHistory.push should also work here
              pathname: '/coursedetail',
              state: {
                courseId: this.state.courseId,
                courseName: this.state.courseName
              }
            });
          } else {
            notification.type = 'danger'
            notification.title = 'Error';
            notification.message = json.data.message
            store.addNotification({
              ...notification
            });
          }
        })
        .catch(err => {
          alert(err);
        })
    }
  };
  handleAddClick = e => {
    e.preventDefault();
    if (this.state.empSelected.length === 0) {
      alert("please select one user");
      return false;
    } else {
      var userIds = this.state.empSelected[0]
      var companyCode = global.companyCode;

      global.api.addEmpCourse(userIds, companyCode, this.state.courseId)
        .then(res => res)
        .then((json) => {
          var notification = this.state.notification
          if (json.data.message === 'Employee is successfully registered for this Course') {
            notification.type = 'success'
            notification.title = 'Success';
            notification.message = json.data.message
            store.addNotification({
              ...notification
            });
            this.setState(() => ({
              attenSelected: []
            }));
            this.setState(() => ({
              empSelected: []
            }));
            this.props.history.replace({ //browserHistory.push should also work here
              pathname: '/coursedetail',
              state: {
                courseId: this.state.courseId,
                courseName: this.state.courseName
              }
            });
          } else {
            notification.type = 'danger'
            notification.title = 'Error';
            notification.message = json.data.message
            store.addNotification({
              ...notification
            });
          }
        })
        .catch(err => {
          alert(err);
        })
    }
  };
  handleEmpOnSelect = (row, isSelect, rowIndex, e) => {
    if (isSelect) {
      this.setState(() => ({
        empSelected: [...this.state.empSelected, row.userId]
      }));
    } else {
      this.setState(() => ({
        empSelected: this.state.empSelected.filter(x => x !== row.userId)
      }));
    }
  }
  handleEmpOnSelectAll = (isSelect, rows, e) => {
    const ids = rows.map(r => r.userId);

    if (isSelect) {

      this.setState(() => ({
        empSelected: ids
      }));
    } else {
      this.setState(() => ({
        empSelected: []
      }));
    }
  }
  handleAttenOnSelect = (row, isSelect, rowIndex, e) => {

    if (isSelect) {
      this.setState(() => ({
        attenSelected: [...this.state.attenSelected, row.userId]
      }));
    } else {
      this.setState(() => ({
        attenSelected: this.state.attenSelected.filter(x => x !== row.userId)
      }));
    }
  }
  handleAttenOnSelectAll = (isSelect, rows, e) => {
    const ids = rows.map(r => r.userId);
    if (isSelect) {

      this.setState(() => ({
        attenSelected: ids
      }));
    } else {
      this.setState(() => ({
        attenSelected: []
      }));
    }
  }

  render() {
    const MyExportCSV = props => {
      const handleClick = () => {
        props.onExport();
      };
      return (
        <span className="btn btn-radius btn-size btn-blue export" onClick={handleClick}>
          <span>Export CSV</span>
        </span>
      );
    };
    const options = {
      custom: true,
      sizePerPage: 30,
      selected: [],
      /* totalSize: this.state.attendanceData.length, */
      noDataText: 'Your_custom_text',
      withoutNoDataText: true
    };
    const empOptions = {
      custom: true,
      sizePerPage: 30,
      selected: [],
      /* totalSize: this.state.empData.length */
    };
    const selectRow = {
      mode: "radio",
      clickToSelect: false,
      onSelect: this.handleAttenOnSelect,
      //onSelectAll: this.handleAttenOnSelectAll,
      headerColumnStyle: {
        width: "25px",
        paddingLeft: "5px"
      }
    };

    const empSelectRow = {
      mode: "radio",
      clickToSelect: false,
      onSelect: this.handleEmpOnSelect,
      /* onSelectAll: this.handleEmpOnSelectAll, */
      headerColumnStyle: {
        width: "25px",
        paddingLeft: "5px"
      }
    };

    const NoDataAvailable = () => (
      <div className="spinner nodata-available">
        No Data Available....
      </div>
    );
    const toDate = moment().format("DD-MM-YYYY");

    return (
      <main className="offset CourseDetailPage" id="content">
        <section className="section_box">
          <h4 className="title4 mb15 fw500">Courses</h4>
          <div className="head_box type2 mb55">
            <div className="head_box_l">
              <h1 className="title1 mr15">
                {this.state.courseName}
              </h1>
            </div>
          </div>

          <ToolkitProvider
            keyField="i_d"
            data={this.state.attendanceData}
            columns={this.state.attendanceColumns}
            classes="table-atten type2"
            exportCSV={{ fileName: `employeeperformace_for_${global.companyName}_${this.state.courseName}_${toDate}.csv` }}
            search
          >
            {props => (
              <div>
                <div className="head_box type2 mb20">
                  <div className="head_box_l">
                    <h2 className="title2 fw400 mr12">
                      Attendance / Performance
                    </h2>
                  </div>
                  <div className="head_box_c">
                    <div className="form_search">
                      <SearchBar {...props.searchProps} placeholder="Search for employee" />
                      <button>
                        <img src="images/icons/search-icon.svg" alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="head_box_r">
                    <MyExportCSV {...props.csvProps} />
                    <span className="btn btn-radius btn-size btn-blue delete" onClick={this.handleDeleteClick}>
                      <span>Delete</span>
                    </span>
                  </div>
                </div>
                <div className="table_wraps">
                  <PaginationProvider pagination={paginationFactory(options)}>
                    {({ paginationProps, paginationTableProps }) => (
                      <div className="attenPagination">
                        <BootstrapTable
                          {...props.baseProps}
                          selectRow={selectRow}
                          {...paginationTableProps}
                          filter={filterFactory()}
                          classes="table-atten"
                          noDataIndication={() => <NoDataAvailable />}
                        />
                        <PaginationListStandalone {...paginationProps} />
                      </div>
                    )}
                  </PaginationProvider>
                </div>
                <div className="table_after"></div>
              </div>
            )}
          </ToolkitProvider>
          <ToolkitProvider
            keyField="userId"
            data={this.state.empData}
            columns={this.state.empColumns}
            classes="table-atten type2"
            search>
            {props => (
              <div>
                <div className="head_box type2 mb20">
                  <div className="head_box_l">
                    <h2 className="title2 fw400 mr12">
                      Available Employees for Enrollment
                    </h2>
                  </div>
                  <div className="head_box_c">
                    <div className="form_search">
                      <SearchBar {...props.searchProps} placeholder="Search for employee" />
                      <button>
                        <img src="images/icons/search-icon.svg" alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="head_box_r al_itc">
                    <span className="btn btn-radius btn-size btn-blue delete" onClick={this.handleAddClick}>
                      <i>
                        <img src="images/icons/User.svg" alt="" />
                      </i>
                      <span> Add new</span>
                    </span>
                  </div>
                </div>
                <div className="table_wraps">
                  <PaginationProvider
                    pagination={paginationFactory(empOptions)}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <div className="attenPagination">
                        <BootstrapTable
                          {...props.baseProps}
                          selectRow={empSelectRow}
                          {...paginationTableProps}
                          classes="table-atten"
                          noDataIndication={() => <NoDataAvailable />}
                        />
                        <PaginationListStandalone {...paginationProps} />
                      </div>
                    )}
                  </PaginationProvider>
                </div>
              </div>
            )}
          </ToolkitProvider>
        </section>
      </main>
    );
  }
}
export default CourseDetails;
