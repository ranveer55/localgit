import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {  Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import Loader from "react-loader-spinner";
import Select from 'react-select';
import $ from 'jquery';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Progress } from 'reactstrap';  
import ReactDatePicker from "react-datepicker";
const { SearchBar } = Search;

class Employees extends Component {
  
  constructor(props) {
    super(props);

    this.subscriptionExpiresFormatter = this.subscriptionExpiresFormatter.bind(this);
    
    function formatter(cell, row) {
      return (
        <div className="table_dots">
        <div className="table_dots_icon">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
        );
    }
    
   
    function courseFormater(cell, row,rowIndex) {
      const courseItems = [];
      
      if(row.courseRegistered.length !== 0){
        var moduleCompletionPercent = '0'
        for (var i=0; i < 1; i++) {
           moduleCompletionPercent = row.courseRegistered[i].moduleCompletion_percent
          if(moduleCompletionPercent===""){
            moduleCompletionPercent = '0';
          }
          let courseName = row.courseRegistered[i]['courseName'];
          let courseNumber = row.courseRegistered[i]['courseNumber'];
          courseItems.push(<div className="table_course_wrap" key={row.i_d +'_'+ i}><div className="table_course"><a href={`/coursedetail/?courseId=${courseNumber}&courseName=${courseName}`}>{row.courseRegistered[i]["courseName"]}</a></div><div className="progress_status_container hide"><div className="progress_bar"><Progress value={moduleCompletionPercent}>{moduleCompletionPercent}%</Progress></div></div><div className="table_number">{row.courseCount}</div></div>);
          
        }
        for (var j=1; j < row.courseRegistered.length; j++) {
           moduleCompletionPercent = row.courseRegistered[j].moduleCompletion_percent
          if(moduleCompletionPercent===""){
            moduleCompletionPercent = '0';
          }
          let courseName = row.courseRegistered[j]['courseName'];
          let courseNumber = row.courseRegistered[j]['courseNumber'];
          courseItems.push(<div className="table_course_wrap hide" key={row.i_d +'_'+ j}><div className="table_course" ><a href={`/coursedetail/?courseId=${courseNumber}&courseName=${courseName}`}>{row.courseRegistered[j]["courseName"]}</a></div><div className="progress_status_container"><div className="progress_bar"><Progress value={moduleCompletionPercent}>{moduleCompletionPercent}%</Progress></div></div></div>);
        }
      }
      var trId = "courses_"+rowIndex
      return (
        <div id={trId}>{courseItems}</div>
      )
    }
     
    function statusFormater(cell, row) {
      const status = []
      if(row.status === " "){
        status.push(<div key={row.i_d}><div className="status" >
        <i className="green"></i>
        <span>Status</span>
      </div><div className="session">
          <span>Last session</span>
          <time>{row.lastLoginDate}</time>
      </div></div>)
      }
      return (
        status
      )
    }
    function locationFormater(cell, row) {
      
      return (<div>
        <div className="table_location">{row.Location}</div>
        <div className="table_location_it">Department Name</div>
        </div>
      )
    }
    function addLink(cell, row) {
      return (<div><a href={`/add-student/?userId=${row.userId}`}>{row.userId}</a></div>);
      //return (<div><a href>{row.userId}</a></div>);
    }
    this.state = {
      columns:[{
        dataField: "i_d",
        text: "Id",
        hidden: true,
        csvExport: false
       },{
        text: '',
        dataField: "",
        formatter: formatter,
        headerStyle: {
          width:'10px'
        },
        events: {
         onClick: (e, column, columnIndex, row, rowIndex) => {
          
          var currentClass = e.target.className;
          var statusIndex = this.state.statusIndex
          var courseIndex = this.state.courseIndex
          var locationIndex = this.state.locationIndex
          if(currentClass === 'table_dots'){
            
            if(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children.length !== 0){
              var coursesClass = $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[0]).get( 0 ).className;
              var courseCount = $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0]).get(0).childNodes
              if(coursesClass !== 'table_course_wrap'){
                //status
                if(e.target.parentNode.parentNode.childNodes[statusIndex].children.length !== 0){
                  $(e.target.parentNode.parentNode.childNodes[statusIndex].children[0].children[1]).get( 0 ).className= 'session'
                }
                //courses
                $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[0]).get( 0 ).className= 'table_course_wrap'
                $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[0].children[1]).get( 0 ).className= 'progress_status_container hide'
                
                for(var i = 1 ; i < courseCount.length; i++){
                  $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[i]).get( 0 ).className= 'table_course_wrap hide'
                }
                
                //location
                if(e.target.parentNode.parentNode.childNodes[locationIndex].children.length !== 0){
                  $(e.target.parentNode.parentNode.childNodes[locationIndex].children[0].children[1]).get( 0 ).className= 'table_location_it'
                }
              }else{
                //status
                if(e.target.parentNode.parentNode.childNodes[statusIndex].children.length !== 0){
                  $(e.target.parentNode.parentNode.childNodes[statusIndex].children[0].children[1]).get( 0 ).className= 'session show'
                }
                //courses
                if(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children.length !== 0){
                  $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[0]).get( 0 ).className= 'table_course_wrap is-active height'
                  $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[0].children[1]).get( 0 ).className= 'progress_status_container'
                  for(var j = 1 ; j < courseCount.length; j++){
                    $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[j]).get( 0 ).className= 'table_course_wrap is-active height'
                  }
                  /* $(e.target.parentNode.parentNode.childNodes[4].children[0].children[1]).get( 0 ).className= 'table_course_wrap is-active height' */
                }
                //location
                if(e.target.parentNode.parentNode.childNodes[locationIndex].children.length !== 0){
                  $(e.target.parentNode.parentNode.childNodes[locationIndex].children[0].children[1]).get( 0 ).className= 'table_location_it show'
                }
              }
              $(e.target.parentNode.parentNode.childNodes[courseIndex].children[0].children[0]).get( 0 ).slideDown='400'
            }
          }
         }
       }
       
      },
       {
         text: 'EMAIL',
         dataField: 'userId',
         sort: true,
         csvExport: true,
         classes:'entry-text',
         formatter: addLink,
         headerStyle: {
          width:'25%'
        }
       },
       {
        dataField: "FirstName",
        text: "FirstName",
        sort: true,
        csvExport: true,
        headerStyle: {
          width:'12%'
        }
       },
       {
        dataField: "LastName",
        text: "LastName",
        csvExport: true,
        headerStyle: {
          width:'10%'
        }
       },
        {
          text: 'COURSES',
          dataField: 'courseRegistered',
         formatter: courseFormater,
          csvExport: false,
          headerStyle: {
            width: '10%'
          }
        },
        {
          text: 'Subscription Expires',
          dataField: 'subscriptionExpires',
          formatter: this.subscriptionExpiresFormatter,
          csvExport: true,
          headerStyle: {
            width: '15%'
          }
        },
        {
          text: 'Account Created',
          dataField: 'accountCreated',
          csvExport: true,
          headerStyle: {
            width: '10%'
          }
        },
        {
          text: 'Activation Date',
          dataField: 'activationDate',
          csvExport: true,
          headerStyle: {
            width: '10%'
          }
        },
        {
          text: 'Last Login Date',
          dataField: 'lastLoginDate',
          csvExport: true,
          headerStyle: {
            width: '10%'
          }
        },
       {
         text: 'PHONE',
         dataField: 'Mobile',
         sort: true,
         csvExport: true,
         headerStyle: {
          width:'10%'
        }
       },
       {
         text: 'device',
         dataField: 'deviceMake',
         sort: true,
         csvExport: false,
         headerStyle: {
          width:'10%'
        }
       },
       {
         text: 'deviceOS',
         dataField: 'deviceOsVersion',
         sort: true,
         csvExport: false,
         headerStyle: {
          width:'10%'
        }
       },
       {
         text: 'appVersion',
         dataField: 'versionNumber',
         sort: true,
         csvExport: false,
         headerStyle: {
          width:'10%'
        }
       },
       {
         text: 'LOCATION',
         dataField: 'Location',
         formatter:locationFormater,
         sort: true,
         csvExport: false,
         headerStyle: {
          width:'15%'
        }
       },
       {
        dataField: "status",
        text: "STATUS",
        csvExport: false,
        formatter:statusFormater,
        headerStyle: {
          width:'10%'
        }
       }],
      data : []
       
    }
    this.state.selected = []
    this.state.statusIndex = 4
    this.state.courseIndex = 5
    this.state.locationIndex = 12
    this.state.batchData = [];

    this.state.csvFileName = global.companyName + "-Student-" + this.getDate() +".csv";
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
    
  }
  gotoCourse = (courseNumber,courseName) =>{
    this.props.history.push({pathname: '/coursedetail',state: {courseId: courseNumber,courseName:courseName}});
  }
  getDate() {
    var tempDate = new Date();
    var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate() ;
    return date;
  }


  subscriptionExpiresFormatter(cell, row, index) {

    let expiringDate = null;
    try {
      expiringDate = new Date(row.subscriptionExpires);
    } catch (error) {
      
    }

    if (expiringDate.toString().startsWith("0000") || expiringDate.toString() === "Invalid Date") {
      expiringDate = null;
    }

    return (
      
      <div className="certificate-button-holder">
        <label className="certificate-button">
          <ReactDatePicker
            showMonthDropdown
            showYearDropdown
            className="border-bottom-black"
            onChange={date => {
              // save old date
              const oldDate = row.subscriptionExpires;
              const newRecord = { ...row, subscriptionExpires: date }
              console.log("data", this.state);
              const oldData = [...this.state.data];
              global.api.updateEmployee(newRecord)
                .then(response => {
                  // update the current state to incorporate the changes
                  const dataIndex = index;
                  oldData.splice(dataIndex, 1, newRecord);
                  this.setState({
                    data: oldData
                  });
                });
            }}
            selected={expiringDate}
              />
          </label>
      </div>
    )
  }

  updateEmployeeExpiryDate(date) {
    
  }
  
  componentDidMount() {
    global.api.getEmployeeList(global.companyCode)
    .then(res => res)
                .then(data => {$('#employee-content').show();this.setState({data});$('#spinner').hide(); })
                .catch(err =>{
                    alert(err);
                })
    //For Batch
    global.api.getBatch(global.companyCode)
    .then(
      data => {
        data.sort(function(a, b) {
          return a.batchNumber - b.batchNumber;
        });
        this.setState({ batchData: data });
    });
  }
  onBatchChange = selectedBatch => {
    this.setState({ selectedBatch });
    console.log(`Batch selected:`, selectedBatch.value);
    var batchNumber = selectedBatch.value;
    $("#gdpr").prop("checked", false);
    this.setState({checked: false});
    global.api.getEmployeeList(global.companyCode,batchNumber)
      .then(res => res)
      .then(data => {$('#employee-content').show();this.setState({data});$('#spinner').hide();})
      .catch(err =>{
          alert(err);
      })
  };
  onBatchChangeOld= (e) => {
    //List of Batches for selected Company
    this.setState({selectedBatch: e.target.value});
    var batchNumber = e.target.value;
    global.api.getEmployeeList(global.companyCode,batchNumber)
      .then(res => res)
      .then(data => {$('#employee-content').show();this.setState({data});$('#spinner').hide(); })
      .catch(err =>{
          alert(err);
      })
  }
  handleCheck = () => {
    var notification=this.state.notification;
    let batchNumber = "";
    if(this.state.selectedBatch === undefined){
      notification.type='danger'
      notification.title='Error';
      notification.message='Please select batch before GDPR'
            store.addNotification({
              ...notification
            });
      $("#gdpr").prop("checked", false);
      return false;
    }else{
      batchNumber = this.state.selectedBatch.value;
      this.setState({checked: !this.state.checked});
      let gdprCheck = "";
      if(!this.state.checked === true){
        gdprCheck = "Y";
      }
      global.api.getEmployeeList(global.companyCode,batchNumber,gdprCheck)
        .then(res => res)
        .then(data => {$('#employee-content').show();this.setState({data});$('#spinner').hide(); })
        .catch(err =>{
          alert(err);
      })
    }
  }
  handleBtnClick = () => {
    console.log(this.state.selected)
  }
  
  handleOnSelect = (row, isSelect, rowIndex, e) => {
    
    var columnCount = $(e.target.parentNode.parentNode).get(0).cells;
    
    if (isSelect) {
      
      for (var i=1; i < columnCount.length; i++) {
        if(i === 6){
          $(e.target.parentNode.parentNode.cells[i]).get(0).className='table_td entry-text is-active';
        }else{
          $(e.target.parentNode.parentNode.cells[i]).get(0).className='table_td is-active';
        }
      }
      
    } else {
      for (var j=1; j < columnCount.length; j++) {
        if(j === 6){
          $(e.target.parentNode.parentNode.cells[j]).get(0).className='table_td entry-text';
        }else{
          $(e.target.parentNode.parentNode.cells[j]).get(0).className='table_td';
        }
        
      }
    }
  }
  handleOnSelectAll = (isSelect, rows, e) => {
    
    var rowCount = $(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1]).get(0).childNodes;
    if (isSelect) {
      for (var i=0; i < rowCount.length; i++) {
        var colCount = $(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[i]).get(0).cells;
        for (var j=1; j < colCount.length; j++) {
          if(j === 6){
          $(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[i].cells[j]).get(0).className='table_td entry-text is-active';
          }else{
            $(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[i].cells[j]).get(0).className='table_td is-active';
          }
        }
      }
      
    } else {
      for (var ii=0; ii < rowCount.length; ii++) {
        var coldCount = $(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[ii]).get(0).cells;
        for (var jj=1; jj < coldCount.length; jj++) {
          if(jj === 6){
            $(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[ii].cells[jj]).get(0).className='table_td entry-text';
          }else{
            $(e.target.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[ii].cells[jj]).get(0).className='table_td';
          }
          
        }
      }
      /* this.setState(() => ({
        selected: []
      })); */
    }
  }
  render() {
    
    const options = {
      custom: true,
      /* page: 1, */
      /* totalSize: this.state.data.length */
      slected:[],
    };
    const MyExportCSV = props => {
      const handleClick = () => {
        props.onExport();
      };
      return (
        
        <span
          className="btn btn-radius btn-size btn-white export"
          onClick={handleClick} style={{marginTop:'20px'}}
        >
          <span>Export CSV</span>
        </span>
      );
    };
    function chkFormatter(cell, row) {
      return (
        <div class="table_check">
          <label class="form_checkbox">
            <input type="checkbox" hidden="hidden" />
            <span> </span>
            </label>
            </div>
        );
    }
    const selectRow = {
      mode: 'checkbox',
      formatter:chkFormatter,
      clickToSelect: false,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
      headerColumnStyle: {
        width:'45px',
        paddingLeft:'5px'
      }
      
    };
    const rowEvents = {onClick:(e, row, rowIndex) => {
          
      //console.log($(e.target.parentNode).get(0).tagName)
      var elementName = ''
      if($(e.target.parentNode).get(0).tagName === 'TR'){
        elementName = e.target.parentNode
      }else {
        elementName = e.target.parentNode.parentNode.parentNode.parentNode
      }
      
      if(elementName.tagName === 'TBODY'){
        
        elementName = elementName.childNodes[rowIndex]
      }
      var statusIndex = this.state.statusIndex
      var courseIndex = this.state.courseIndex
      var locationIndex = this.state.locationIndex
      /* console.log(elementName)
      console.log(rowIndex) */
      if(elementName.tagName === 'TR'){
        
        if(elementName.childNodes[courseIndex].children[0].children.length !== 0){
          /* $('#courses_'+rowIndex).css('height','')
          $('#courses_'+rowIndex).css('overflow','') */
          var coursesClass = elementName.childNodes[courseIndex].children[0].children[0].className;
          var courseCount = elementName.childNodes[courseIndex].children[0].childNodes
          if(coursesClass !== 'table_course_wrap'){
            //status
            if(elementName.childNodes[statusIndex].children.length !== 0){
              elementName.childNodes[statusIndex].children[0].children[1].className= 'session'
            }
            //courses
            elementName.childNodes[courseIndex].children[0].children[0].className= 'table_course_wrap'
            elementName.childNodes[courseIndex].children[0].children[0].children[1].className= 'progress_status_container hide'
            
            for(var i = 1 ; i < courseCount.length; i++){
              elementName.childNodes[courseIndex].children[0].children[i].className= 'table_course_wrap hide'
            }
            
            //location
            if(elementName.childNodes[locationIndex].children.length !== 0){
              elementName.childNodes[locationIndex].children[0].children[1].className= 'table_location_it'
            }
          }else{
            
            //status
            if(elementName.childNodes[statusIndex].children.length !== 0){
              elementName.childNodes[statusIndex].children[0].children[1].className= 'session show'
            }
            //courses
            if(elementName.childNodes[courseIndex].children[0].children.length !== 0){
              elementName.childNodes[courseIndex].children[0].children[0].className= 'table_course_wrap is-active height'
              elementName.childNodes[courseIndex].children[0].children[0].children[1].className= 'progress_status_container'
              for(var j = 1 ; j < courseCount.length; j++){
                elementName.childNodes[courseIndex].children[0].children[j].className= 'table_course_wrap is-active height'
              }
              if(courseCount.length>3){
                /* $('#courses_'+rowIndex).css('height','200px')
                $('#courses_'+rowIndex).css('overflow','auto') */
              }
             
            }
            //location
            if(elementName.childNodes[locationIndex].children.length !== 0){
              elementName.childNodes[locationIndex].children[0].children[1].className= 'table_location_it show'
            }
          }
          elementName.childNodes[courseIndex].children[0].children[0].slideDown='400'
        }
      }
      }
     };
    
    const NoDataIndication = () => (
      <div className="table_wraps" id="spinner">
        <div className="spinner" >
          <Loader type="Grid" color="#4441E2" height={100} width={100} />
                  Loading....
        </div>
        </div>
    );
    
    const NoDataAvailable = () => (
      <div className="spinner nodata-available">
       No Data Available...
      </div>
    );
    return (
      
          <ToolkitProvider
          keyField="i_d"
          data={ this.state.data }
          columns={ this.state.columns }
          classes="table"
          search
          exportCSV = {{ fileName: this.state.csvFileName }}
          >
          {
            props => (
              <main className="offset" id="content">
                    <section className="section_box">
                        <h1 className="title1 mb50">Students</h1>
                        <div className="head_box type2 mb50">
                            <div className="head_box_l">
                                <div className="activated_employee">
                                    <div className="activated_employee_it">
                                        <h4 className="title4 mb10">Activated Students</h4>
                                        <div className="color5 fz28 fw700">{this.state.data.length}</div>
                                    </div>
                                    <div className="activated_employee_it2">
                                        <span>Available Slots: 36</span>
                                        <img src="images/icons/twotone-people.svg" alt="" />
                                    </div>
                                </div>
                              <div className="batch-select-box">
                                <h4 className="title4 mb15 fw500">Batch</h4>
                                <div style={{'width':'100px'}}>
                                  <Select id="batch" value={this.state.selectedBatch}  onChange={this.onBatchChange} options={this.state.batchData} className="Select has-value is-clearable is-searchable Select--multi"
      classNamePrefix="batch"/>
                                </div>
                              </div>
                              <div className="gdpr-check-box title4">
                                  GDPR <input type="checkbox" name="gdpr" id="gdpr" onChange={this.handleCheck} defaultChecked={this.state.checked}/>
                              </div>
                            </div>
                            <div className="head_box_c">
                                <form className="form_search">
                                <SearchBar { ...props.searchProps } placeholder="Search for employee"/>
                                    <button>
                                        <img src="images/icons/search-icon.svg" alt="" />
                                    </button>
                                </form>
                            </div>
                            <div className="head_box_r">
                                <a className="btn btn-radius btn-size btn-white" href="/add-student">
                                    <i>
                                        <img src="images/icons/User.svg" alt="" />
                                    </i>
                                    <span>Add new</span>
                                </a>
                                <span className="btn btn-radius btn-size btn-blue btn-icon-right export" onClick={ this.handleBtnClick }>
                                    <i>
                                        <img src="images/icons/arrow_next2.svg" alt="" />
                                    </i>
                                    <span>Add to Course</span>
                                </span>
                            </div>
                        </div>
              <div id="employee-content" style={{'display':'none','width':'145%'}}>
                {(this.state.data.length !== 0) ?<div className="head_box_l mb15"><MyExportCSV {...props.csvProps} /></div>:''}
              
                {this.state.data.length !== 0? 
                <PaginationProvider pagination={ paginationFactory(options) }>
                {({ paginationProps, paginationTableProps}) => (
                  <div>
                    
                  <BootstrapTable
                    { ...props.baseProps }
                    selectRow={ selectRow } 
                    rowEvents={ rowEvents }
                    { ...paginationTableProps }
                    filter={ filterFactory() }
                    classes="table"
                    noDataIndication={ () => <NoDataAvailable /> }
                  />
                  <PaginationListStandalone
                    { ...paginationProps }
                  />
                  </div>
                  ) 
                }
                </PaginationProvider>
                 : <NoDataAvailable /> } 
               
              </div>
              <NoDataIndication />
              </section>
        </main>
            )
          }
        </ToolkitProvider>
        
    );
  }
}
export default Employees;
