import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {PaginationProvider,PaginationListStandalone} from "react-bootstrap-table2-paginator";
import ToolkitProvider, {  Search } from "react-bootstrap-table2-toolkit";
import Loader from "react-loader-spinner";
import filterFactory from 'react-bootstrap-table2-filter';
import axios from 'axios'

const { SearchBar } = Search;

class CourseDetails extends Component {
  constructor(props) {
    super(props);
    if(this.props.location.state===undefined){
      window.location.href = '/courses';
    }
    this.handleAttenOnSelectAll = this.handleAttenOnSelectAll.bind(this)
    this.handleEmpOnSelectAll = this.handleEmpOnSelectAll.bind(this)
    //Set attendance Table Settings
    this.state = {
      courseId:this.props.location.state.courseId,
      courseName:this.props.location.state.courseName,
      attendanceColumns: [
        { dataField: "Id", text: "Id", hidden: true },
        { 
          text: "Email",
          dataField: "userId",
          sort: true,
          classes:'entry-text',
          headerStyle: {
            width: "25%"
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
          text: "Completion",
          dataField: "completedStatus",
          headerStyle: {
            width: "20%"
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
        {
          text: "Current Score",
          dataField: "evaluationCompleted",
          sort: true,
          headerStyle: {
            width: "15%"
          }
        }
      ],
      attendanceData: [{'message':'nodata'}],
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
    this.state.totalData=[];
    
    //Column Formatter methods
    function completionFormater(cell, row) {
      return (
        <div className="table_progres_bar" data-text={row.completedStatus}>
          <span style={{ width: row.completedStatus+"%" }}></span>
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
    global.api.getCourseDetails ('133',this.state.courseId)
                .then(res => res)
                .then((json)=>{
                  this.setState({attendanceData:json.registered})
                  this.setState({empData:json.availableToRegister})
                })
                .catch(err =>{
                    alert(err);
                })
  }
  /* handleDeleteClick () {
    
    axios.post('https://api1.taplingua.com/v1/add-employee-course.php', JSON.stringify({
      userId: "xarlyxarly@gmai.com",
      courseNumber: "98764345"
    }))
      .then(response => console.log(response))
  } */
  handleDeleteClick = e => {
    e.preventDefault();
    console.log(this.state.attenSelected);
    if (this.state.attenSelected.length === 0) {
      alert("please select one user");
      return false;
    } else {
      /* var userIds = [];
      for(var i =0; i< this.state.attenSelected.length; i++){
        userIds.push(this.state.attenSelected[i]['userId'])
      } */
      var userIds = this.state.attenSelected[0]['userId']
      var companyCode = '133';
      var courseNumber = this.state.courseId
      
      global.api.deleteEmpCourse(userIds, companyCode, courseNumber)
      .then(res => res)
                .then((json)=>{
                  alert(json.data.message)
                  if(json.data.message==='Employee is removed from this Course'){
                    /* this.handleAttenOnSelectAll()
                    this.handleEmpOnSelectAll() */
                    global.api.getCourseDetails ('133',this.state.courseId)
                    .then(res => res)
                    .then((json)=>{
                      this.setState({attendanceData:json.registered})
                      this.setState({empData:json.availableToRegister})
                    })
                    .catch(err =>{
                        alert(err);
                    })
                  }
                  
                })
                .catch(err =>{
                    alert(err);
                })
    }
  };
  handleAddClick = e => {
    e.preventDefault();
    console.log(this.state.empSelected);
    if (this.state.empSelected.length === 0) {
      alert("please select one user");
      return false;
    } else {
      /* var userIds = [];
      for(var i =0; i< this.state.empSelected.length; i++){
        userIds.push(this.state.empSelected[i]['userId'])
      } */
      var userIds = this.state.empSelected[0]['userId']
      var companyCode = '133';
      var courseNumber = this.state.courseId
      
      global.api.addEmpCourse(userIds, companyCode, courseNumber)
      .then(res => res)
                .then((json)=>{
                  alert(json.data.message)
                  if(json.data.message==='Employee is successfully registered for this Course'){
                    /* this.handleAttenOnSelectAll()
                    this.handleEmpOnSelectAll() */

                    global.api.getCourseDetails ('133',this.state.courseId)
                    .then(res => res)
                    .then((json)=>{
                      this.setState({attendanceData:json.registered})
                      this.setState({empData:json.availableToRegister})
                    })
                    
                    .catch(err =>{
                        alert(err);
                    })
                  }
                  
                })
                .catch(err =>{
                    alert(err);
                })
        
    }
  };
  handleEmpOnSelect = (key, shift, row) => {
    let empSelected = [...this.state.empSelected];
        const keyIndex = empSelected.indexOf(key);
        if (keyIndex >= 0) {
          empSelected = [
            ...empSelected.slice(0, keyIndex),
            ...empSelected.slice(keyIndex + 1)
          ];
        } else {
          empSelected.push(key);
        }
        this.setState({ empSelected });
        console.log(this.state.empSelected)
    
  };
  handleEmpOnSelectAll = (isSelect, rows, e) => {
    if (isSelect) {
      this.setState(() => ({
        empSelected: rows
      }));
    } else {
      this.setState(() => ({
        empSelected: []
      }));
    }
  };
  handleAttenOnSelect = (key, shift, row) => {
    let attenSelected = [...this.state.attenSelected];
        const keyIndex = attenSelected.indexOf(key);
        if (keyIndex >= 0) {
          attenSelected = [
            ...attenSelected.slice(0, keyIndex),
            ...attenSelected.slice(keyIndex + 1)
          ];
        } else {
          attenSelected.push(key);
        }
        this.setState({ attenSelected });
        console.log(this.state.attenSelected)
  };
  handleAttenOnSelectAll = (isSelect, rows, e) => {
    console.log(isSelect)
    console.log(rows)
    //const ids = rows.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        attenSelected: rows
      }));
    } else {
      this.setState(() => ({
        attenSelected: []
      }));
    }
  };
  render() {
    const MyExportCSV = props => {
      const handleClick = () => {
        props.onExport();
      };
      return (
        <span className="btn btn-radius btn-size btn-blue export"  onClick={handleClick}>
          <span>Export CSV</span>
        </span>
      );
    };
    const options = {
      custom: true,
      sizePerPage: 5,
      totalSize: this.state.attendanceData.length,
      noDataText: 'Your_custom_text',
      withoutNoDataText: true
    };
    const selectRow = {
      mode: "checkbox",
      clickToSelect: false,
      onSelect: this.handleAttenOnSelect,
      onSelectAll: this.handleAttenOnSelectAll,
      headerColumnStyle: {
        width: "25px",
        paddingLeft: "5px"
      }
    };
    const empOptions = {
      custom: true,
      sizePerPage: 5,
      totalSize: this.state.attendanceData.length
    };
    const empSelectRow = {
      mode: "checkbox",
      clickToSelect: false,
      onSelect: this.handleEmpOnSelect,
      onSelectAll: this.handleEmpOnSelectAll,
      headerColumnStyle: {
        width: "25px",
        paddingLeft: "5px"
      }
    };
    
    const NoDataIndication = () => (
      <div className="spinner">
        <Loader type="Grid" color="#4441E2" height={100} width={100} />
                Lodding....
      </div>
     
    );
    const NoDataAvailable = () => (
      <div className="spinner nodata-available">
       No Data Available....
      </div>
    );
    
    return (
      <main className="offset" id="content">
        <section className="section_box">
          <h4 className="title4 mb15 fw500">Courses</h4>
          <div className="head_box type2 mb55">
            <div className="head_box_l">
              <h1 className="title1 mr15">
                {this.state.courseName}
              </h1>
              <div className="select_box">
                <select className="select select_size">
                  <option value="Last 1 days">Last 1 days</option>
                  <option value="Last 5 days">Last 5 days</option>
                  <option value="Last 7 days">Last 7 days</option>
                </select>
              </div>
            </div>
            <div className="head_box_r">
              <a className="btn btn-radius btn-size btn-blue btn-icon-right" href="/completionreports">
                <i>
                  <img src="images/icons/arrow_next2.svg" alt="" />
                </i>
                <span>Print Report</span>
              </a>
            </div>
          </div>
          <div className="grafic_wrapper">
            <div className="grafic_box">
              <div className="grafic_head">
                <h5 className="title5 grafic_title">Enrollments</h5>
                <div className="grafic_descr">4 Aug 2018 - 11 Aug 2018</div>
              </div>
              <div className="grafic_content">
                <div className="grafic_left">
                  <div className="grafic_percent">8</div>
                  <div className="grafic_info red">
                    <i>
                      <img src="images/icons/arrow-red.png" alt="" />
                    </i>
                    <span>1.8%</span>
                  </div>
                </div>
                <div className="grafic_right">
                
                  <canvas className="myChart" id="myChart"></canvas>
                </div>
              </div>
            </div>
            <div className="grafic_box">
              <div className="grafic_head">
                <h5 className="title5 grafic_title">Course Activity</h5>
                <div className="grafic_descr">4 Aug 2018 - 11 Aug 2018</div>
              </div>
              <div className="grafic_content">
                <div className="grafic_left">
                  <div className="grafic_percent">30</div>
                  <div className="grafic_info green">
                    <i>
                      <img src="images/icons/arrow-green.png" alt="" />
                    </i>
                    <span>13.8%</span>
                  </div>
                </div>
                <div className="grafic_right">
                  <canvas className="myChart" id="myChart2"></canvas>
                </div>
              </div>
            </div>
            <div className="grafic_box">
              <div className="grafic_head">
                <h5 className="title5 grafic_title">Average Progress</h5>
                <div className="grafic_descr">
                  Compared with estimated progress
                </div>
              </div>
              <div className="grafic_content">
                <div className="grafic_left">
                  <div className="grafic_percent">60.3%</div>
                  <div className="grafic_info red">
                    <i>
                      <img src="images/icons/arrow-red.png" alt="" />
                    </i>
                    <span>13.8%</span>
                  </div>
                </div>
                <div className="grafic_right">
                  <canvas className="myChart" id="myChart3"></canvas>
                </div>
              </div>
            </div>
          </div>
          
          <ToolkitProvider
            keyField="i_d"
            data={this.state.attendanceData}
            columns={this.state.attendanceColumns}
            classes="table-atten type2"
            exportCSV={{ fileName: "all-services.csv" }}
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
                      <SearchBar { ...props.searchProps } placeholder="Search for employee"/>
                      <button>
                          <img src="images/icons/search-icon.svg" alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="head_box_r">
                  
                    <MyExportCSV {...props.csvProps} />
                    <span className="btn btn-radius btn-size4 btn-blue delete" onClick={this.handleDeleteClick}>
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
                          filter={ filterFactory() }
                          classes="table-atten"
                          noDataIndication={ () => <NoDataAvailable /> }
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
                      <SearchBar { ...props.searchProps } placeholder="Search for employee"/>
                      <button>
                          <img src="images/icons/search-icon.svg" alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="head_box_r al_itc">
                    <span className="btn btn-radius btn-size btn-white delete" onClick={this.handleAddClick}>
                      <i>
                        <img src="images/icons/User.svg" alt="" />
                      </i>
                      <span>Add new</span>
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
                          noDataIndication="No Interfaces available"
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
