import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import Loader from "react-loader-spinner";
import $ from 'jquery';
import Select from 'react-select';
import LoadingOverlay from 'react-loading-overlay';
//import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
 
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

class CampaignsWeeklyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns:[],
      data:[],
      loading:false
    };
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
    this.state.selected = [];
    this.state.userData = [];
    this.state.companyData = [];
    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
    this.state.batchData = [];
    this.state.selectedBatch = '';
    this.state.courseData = [];
    this.state.selectedCourse = '';
    this.state.noDataIndication = 'none';
    this.state.noDataAvailable = 'none';
    this.state.baseColNames = [{
      dataField: "i_d",
      text: "Id",
      hidden: true
    },
    {
      dataField: "userId",
      text: "Employee",
      classes:'reports-text',
      sort: true,
       headerStyle: {
        width:'250px',
        textTransform: 'none',
        cursor:'pointer'
      }
    },
    {
      text: 'Name',
      dataField: 'Name',
      classes:'reports-text',
      headerStyle: {
        width:'200px',
        textTransform: 'none'
      }
    } ,
    {
      text: 'MobileOS',
      dataField: 'mobileOS',
      headerStyle: {
        width:'150px',
        textTransform: 'none'
      }
    }]
    this.state.langData = [{	
      label: "Español",	
      value: "ES"	
    },	
    {	
      label: "Portuguese",	
      value: "PT"	
    }]	
    this.state.mailModeData = [{	
      label: "Test Email",	
      value: "Test"	
    },	
    {	
      label: "Real Email",	
      value: "Real"	
    }]	
    
    this.state.selectedLang = { label: 'Español', value: 'ES' };	
    this.state.selectedMode = { label: 'Test Email', value: 'Test' };
    this.state.courseStartDate = '';
   }
   getDate() {

    var tempDate = new Date();
    var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate() ;
    
    return date;
  }
  
  componentDidMount() {
    const companyCode = this.state.selectedCompany;
   
    //For Batch
    global.api.getBatch(companyCode)
    
    .then(
      data => {
        data.sort(function(a, b) {
          return a.value - b.value;
        });
        this.setState({ batchData: data });
    });
  } 
  onBatchChange = selectedBatch => {
    this.setState({ selectedBatch });
    console.log(`Option selected:`, selectedBatch.value);
    var companyCode = this.state.selectedCompany;
      var batchNo = selectedBatch.value;
      global.api.getCourseBatch(companyCode,batchNo)
      .then(
        data => {
        this.setState({ courseData: data });
      });
      this.setState({ selectedCourse: ''});
      this.setState({data: []});
      this.setState({ courseStartDate: ''});
  };
  onCourseChange = selectedCourse => {
    this.setState({ selectedCourse });
    console.log(`Option selected:`, selectedCourse);
    this.setState({courseStartDate:'Course StartDate : '+selectedCourse.courseStartDate});
    this.setState({data: []});
        
    this.setState({noDataIndication:'block'});
    this.setState({noDataAvailable:'none'});
    $('#welcome-reports').show();
    $('#welcome-table_wraps').show();
    $('#campain-welcome-mail').hide();
    var colNames = this.state.baseColNames;
    this.setState({columns: colNames});
    const selectedCompany = this.state.selectedCompany;
    const selectedBatch = this.state.selectedBatch.value;
    var courseId =  selectedCourse.value;
    var selectedRoute = "";
    
    global.api.getCompletionReports(selectedCompany,courseId,selectedBatch,selectedRoute)
    .then(res => res)
    .then(
      result => {
        console.log('spinner hide')
        this.setState({noDataIndication:'none'});
        this.setState({noDataAvailable:'block'});
        $('#campain-welcome-mail').show();
        this.setState({data: result});
      }
    )
  };
  
  onLangSelect = selectedLang => {	
    this.setState({ selectedLang });	
    console.log(`Option selected:`, selectedLang);	
    const selValue = selectedLang.value;	
    const selLabel = selectedLang.label;	
    const selLangOption = { label: selLabel, value: selValue };	
    this.setState({selectedLang: selLangOption}); 	
  }	
  onModeSelect = selectedMode => {	
    this.setState({ selectedMode });	
    console.log(`Option selected:`, selectedMode);	
    const selValue = selectedMode.value;	
    const selLabel = selectedMode.label;	
    const selModeOption = { label: selLabel, value: selValue };	
    this.setState({selectedMode: selModeOption}); 	
  }
  handleOnSelect = (row, isSelect, rowIndex, e) => {
    var elementName = ''
    if($(e.target.parentNode.parentNode).get(0).tagName === 'TR'){
      elementName = e.target.parentNode.parentNode
    } 
    if($(e.target.parentNode.parentNode).get(0).tagName === 'TBODY'){
      
      elementName = e.target.parentNode
    }

    var columnCount = $(elementName).get(0).cells;
    if(columnCount !== undefined){
      if (isSelect) {
        for (var i=0; i < columnCount.length; i++) {
            $(elementName.cells[i]).get(0).className='reports-text reports-active';
        }
        this.setState(() => ({
          selected: [...this.state.selected, row]
        }));
      } else {
        for (var j=0; j < columnCount.length; j++) {
          
            $(elementName.cells[j]).get(0).className='reports-text';
        }
        this.setState(() => ({
          selected: this.state.selected.filter(x => x !== row)
        }));
      }
    }
  }
  handleOnSelectAll = (isSelect, rows, e) => {
    
    var elementName = ''
    if($(e.target.parentNode.parentNode).get(0).tagName === 'TR'){
      elementName = e.target.parentNode.parentNode
    }else{
      elementName = e.target.parentNode
    }
    var columnCount = $(elementName).get(0).cells;
    
    var rowCount = $(elementName.parentNode.parentNode.childNodes[1]).get(0).childNodes;
    //const ids = rows.map(r );
    if (isSelect) {
      for (var i=0; i < rowCount.length; i++) {
        for (var j=0; j < columnCount.length; j++) {
          
          $(elementName.parentNode.parentNode.childNodes[1].childNodes[i].cells[j]).get(0).className='reports-text reports-active';
        }
      }
      this.setState(() => ({
        selected: rows
      }));
    } else {
      for (var ii=0; ii < rowCount.length; ii++) {
        for (var jj=0; jj < columnCount.length; jj++) {
          $(elementName.parentNode.parentNode.childNodes[1].childNodes[ii].cells[jj]).get(0).className='reports-text';
        }
      }
      this.setState(() => ({
        selected: []
      }));
    }
    
  }
  handleSendEmail = (e) => {
    //const type = e.target.id
    var notification=this.state.notification
    
    //console.log(this.state.selected)
    if(this.state.selected.length === 0){
      notification.type='danger'
      notification.title='Error';
      notification.message='Please select One Employee'
            store.addNotification({
              ...notification
            });
      return false;
    }else{ 
      this.setState({loading:true});
      var selectedEmails = this.state.selected;
      let emails = [];
      for (var i = 0; i < selectedEmails.length; i++) {
        emails.push(selectedEmails[i].userId);
      } 
            
      const selectedCompany = this.state.selectedCompany;
      const selectedBatch = this.state.selectedBatch.value;
      var selectedCourse =  this.state.selectedCourse.value;
     
      var params = {
        "to":emails,
        "companyCode":selectedCompany,
        "courseNumber":selectedCourse,
        "batchNumber":selectedBatch,
        "lang":this.state.selectedLang.value,
        "mailMode":this.state.selectedMode.value
      }
      
      global.api.sendEmailAll(params)
      .then(res => res)
      .then((json)=>{
        // console.log(json.data)
        if(json.data.message==="Email Sent Successfully."){
          notification.type='success'
          notification.title='Success';
          notification.message=json.data.message
          store.addNotification({
            ...notification
          });
        }else{
          notification.type='danger'
          notification.title='Error';
          notification.message=json.data.message
                store.addNotification({
                  ...notification
                });
        }
        this.setState({loading:false});
      })
      .catch(err =>{
          alert(err);
      })
    }
    
  }
  sendEmailAll = (e) => {
    var notification=this.state.notification
    const selectedCompany = this.state.selectedCompany;
    const selectedBatch = this.state.selectedBatch.value;
    var selectedCourse =  this.state.selectedCourse.value;
    if(selectedCourse === undefined){
      notification.type='danger'
      notification.title='Error';
      notification.message='Please select One Course'
            store.addNotification({
              ...notification
            });
      return false;
    }else{ 
      
      this.setState({loading:true});
      var params = {
        "companyCode":selectedCompany,
        "courseNumber":selectedCourse,
        "batchNumber":selectedBatch,
        "lang":this.state.selectedLang.value,
        "mailMode":this.state.selectedMode.value
      }
      
      global.api.sendEmailAll(params)
      .then(res => res)
      .then((json)=>{
        // console.log(json.data)
        if(json.data.message==="Email Sent Successfully."){
          notification.type='success'
          notification.title='Success';
          notification.message=json.data.message
          store.addNotification({
            ...notification
          });
        }else{
          notification.type='danger'
          notification.title='Error';
          notification.message=json.data.message
                store.addNotification({
                  ...notification
                });
        }
        this.setState({loading:false});
      })
      .catch(err =>{
          alert(err);
      })
    } 
  }

  render(){
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: false,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
      headerColumnStyle: {
        width:'1px',
        paddingLeft:'5px'
      }
      
    };
    const options = {
      custom: true,
      totalSize: this.state.data.length,
      sizePerPage: 100,
    };
    const NoDataIndication = () => (
      <div className="spinner" id="spinner" style={{'display':this.state.noDataIndication}}>
        <Loader type="Grid" color="#4441E2" height={100} width={100} />
                Loading....
      </div>
    ); 
    const NoDataAvailable = () => (
      <div className="spinner nodata-available" style={{'display':this.state.noDataAvailable}}>
       No Data Available...
      </div>
    );
    const {loading} = this.state
      return ( <div><LoadingOverlay 
      active={loading}
      spinner
      text='Processing your content...'
      >
    </LoadingOverlay>
                    <div className="campaign-container">
                      <div className="campaign-container-left-div">
                        <div className="campaign-container-left-header">
                          Welcome Email
                        </div>
                        {/* <div className="campaign-container-left-text">
                          Send email and announcement every Friday until end of course
                        </div> */}
                      </div>
                      <div className="campaign-container-right-div">
                        
                        <div className="campaign-container-right-div-1">
                          <h4 className="title4 mb15 fw500">Channels</h4>
                        </div>
                        <div className="campaign-container-right-div-2">
                          <div className="head_box mb15">
                            <span style={{'width':'157px', paddingRight: "20px", paddingTop: "5px"}}>	
                            <span style={{fontWeight:'bold'}}>Language</span>
                              <Select id="lang" value = {this.state.selectedLang} options={this.state.langData} onChange={this.onLangSelect} className="Select has-value is-clearable is-searchable Select--multi" classNamePrefix="lang"/>	
                            </span>	
                            <span style={{'width':'150px', paddingRight: "20px", paddingTop: "5px"}}>	
                            <span style={{fontWeight:'bold'}}>Mail Type</span>  
                              <Select id="mailMode" value={this.state.selectedMode} options={this.state.mailModeData} onChange={this.onModeSelect} className="Select has-value is-clearable is-searchable Select--multi" classNamePrefix="mail"/>	
                            </span>
                            <span className="btn btn-radius btn-size btn-blue btn-icon-center export mr15" onClick={ this.handleSendEmail } id="send-email" style={{marginTop:'20px'}}><span id="send-email">SendEmail</span></span>
                            <span className="btn btn-radius btn-size btn-blue btn-icon-center export mr15" onClick={ this.sendEmailAll } id="send-email-all" style={{marginTop:'20px'}}><span id="send-email-all">SendEmail To All</span></span>
                          </div>
                        </div>
                        <div className="campaign-container-right-div-2">
                          <div className="head_box type2 mb20" style={{ width: "100%" }}>
                            <div className="head_box_l">
                              <div style={{ paddingRight: "20px", height: "170px" }}>
                                <h4 className="title4 mb15 fw500">Batch</h4>
                                <div style={{'width':'100px'}}>
                                  <Select id="batch" value={this.state.selectedBatch}  onChange={this.onBatchChange} options={this.state.batchData} className="Select has-value is-clearable is-searchable Select--multi" classNamePrefix="batch"/>
                                </div>
                              </div>
                              <div className="" style={{ paddingRight: "20px", height: "170px" }}>
                                <h4 className="title4 mb15 fw500">Course</h4>
                                <div style={{'width':'300px', 'marginBottom':'-20px'}}>
                                  <Select ref="course" name="course" value={this.state.selectedCourse}  onChange={this.onCourseChange} options={this.state.courseData} className="Select has-value is-clearable is-searchable Select--multi" classNamePrefix="course"/>
                                  <span style={{color: "green",fontWeight:'bold'}}>{this.state.courseStartDate}</span>
                                </div>
                              </div> 
                            </div>
                          </div>
                        </div>
                      </div>    
                    </div>
                <div id="welcome-reports" className="campaign-weekly-completion" style={{'display':'none'}} >
                  <ToolkitProvider
                  keyField="i_d"
                  data={this.state.data}
                  columns={this.state.columns}
                  className="table type2"
                >
                {props => (
                      <div  id="welcome-table_wraps" style={{'display':'none'}} >
                        <div className="">
                          {this.state.data.length !== 0? 
                          <PaginationProvider pagination={paginationFactory(options)}>
                            {({ paginationProps, paginationTableProps }) => (
                              <div className="campain-week-comple" id="campain-welcome-mail">
                                <BootstrapTable
                                selectRow={ selectRow } 
                                bootstrap4
                                  {...props.baseProps}
                                  {...paginationTableProps}
                                  classes="reports_table"
                                  noDataIndication={ () => <NoDataAvailable /> }
                                />
                                <PaginationListStandalone {...paginationProps} />
                              </div>
                            )}
                          </PaginationProvider>
                          :  <NoDataAvailable />}
                          <NoDataIndication />
                        </div>
                      </div>
                )}
              </ToolkitProvider>
              
              </div>
                
              </div>
    )
  }
}
export default CampaignsWeeklyEmail;


