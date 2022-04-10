import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import Loader from "react-loader-spinner";
import $ from 'jquery';
import {Pie } from 'react-chartjs-2';
import Select from 'react-select';

class Reports extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      columns:[],
      data:[]
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
    this.state.courseStartDate = '';
    this.state.selectedRoute = [];
    this.state.selectedRouteText = [];
    this.state.routesForAvgArr = [];
    this.state.noDataIndication = 'none'
    this.state.noDataAvailable = 'none'
    this.state.avgVals = [];		
    this.state.avgPercentTable = "";		
    this.state.grp1Val = 0;		
    this.state.grp2Val = 0;		
    this.state.grp3Val = 0;		
    this.state.grp1PVal = 0;		
    this.state.grp2PVal = 0;		
    this.state.grp3PVal = 0;
    this.state.csvFileName = global.companyName +  "-" + this.getDate() +".csv";
    this.state.pieChartDisplay = false
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
  };
  
  onCourseChange = selectedCourse => {
    this.setState({ selectedCourse });
    console.log(`Option selected:`, selectedCourse);
    const selectedCourseId = selectedCourse.value;
    this.setState({courseStartDate:selectedCourse.courseStartDate});

    this.setState({selectedRouteText: ""});
    this.setState({selectedRoute: ""});

    global.api.getRouteList(selectedCourseId)
    .then(response => response)
    .then(
      data => {
        this.setState({ routeData: data});
        this.setState({selectedRouteText: []});
        let selRoute = [];
        let value = [];
        for (var i = 0; i < data.length; i++) {
          value.push(data[i]);
          selRoute.push(data[i].label);
        }
        this.setState({selectedRouteText: selRoute});
        this.setState({selectedRoute: value});
    });
    this.setState({data: []});
    this.setState({pieChartDisplay:false})
  };
  dateParse = inputDate => {
    var dateVals = inputDate.split('-');
    var outputDate = new Date(
      parseInt(dateVals[2]),
      parseInt(dateVals[1]) - 1,
      parseInt(dateVals[0])
    );
    return outputDate;
  }
  handleBtnClick = () => {
    const moment = require('moment-timezone');
    this.setState({noDataIndication:'block'});
    this.setState({noDataAvailable:'none'});
    $('#reports').show();
    $('#table_wraps').show();
    $('#attenPagination').hide();
    this.setState({data: []});
    this.forceUpdate();
    
    let colNames = [...this.state.baseColNames];
    
    var selectedRouteText = this.state.selectedRouteText;
    let routeStartDate = this.state.courseStartDate;
    var colCount = 0
    let routesForAvg = [];
    let index = 1;
    for (var row1 of selectedRouteText) {
      row1 = row1.replace("\r\n", " ");
      let routeNo = colCount*7;
      let routeDate =  moment(routeStartDate,"DD-MM-YYYY");
      routeDate = moment(routeDate).add(routeNo, 'day').format('DD-MM-YYYY'); 
      let routeEndDate =  moment(routeDate,"DD-MM-YYYY");
      routeEndDate = moment(routeEndDate).add(6, 'day').format('DD-MM-YYYY');
      
      var currDate = new Date();
      currDate = moment(currDate).format('DD-MM-YYYY');
      if (this.dateParse(currDate) > this.dateParse(routeEndDate)) {
        routesForAvg.push(row1);
      }
      var headingText = row1+" ("+routeDate+")";
      var routeCols = {
        text: headingText,
        dataField: row1,
        headerStyle: {
          width:'125px',
          whiteSpace: 'normal'
        }
      };
      colCount = colCount+1
      colNames.push(routeCols);

      // for time
      // for time end
      var routeCols = {
        text: 'Time ' + index,
        dataField: 'Time ' + index,
        headerStyle: {
          width:'100px',
          whiteSpace: 'normal'
        }
      };
      index++;
      colCount = colCount+1
      colNames.push(routeCols);
    }
    if(selectedRouteText.length > 0){
      var avg = {
        text: "Avg",
        dataField: "avg",
        sort:true,
        headerStyle: {
          cursor:'pointer',
          width:'100px',
        },
      }
      colCount = colCount+1
      colNames.push(avg);
    }
    this.setState({routesForAvgArr: routesForAvg});
    this.setState({columns: colNames});
    
    this.setState({avgVals: []});		
    let avgValsarr = [];

    const selectedCompany = this.state.selectedCompany;
    const selectedBatch = this.state.selectedBatch.value;
    var selectedCourse =  this.state.selectedCourse.value;
    
    let selectedRoute = this.state.selectedRoute;
    if(selectedRoute.length > 0){
      var value = [];
      for (var i = 0; i < selectedRoute.length; i++) {
          value.push(selectedRoute[i].value);
      }
      selectedRoute = value.toString();
    }else{
      selectedRoute = "";
      this.setState({pieChartDisplay:false})
    }
    global.api.getCompletionReports(selectedCompany,selectedCourse,selectedBatch,selectedRoute)
    .then(res => res)
    .then(
      result => {
        console.log('spinner hide')
        this.setState({noDataIndication:'none'});
        this.setState({noDataAvailable:'block'});
        $('#attenPagination').show();
        const items = [];
        for (const row of result) {
          let item = row;
          let totRoutes = 0;
          let avgRoutes = 0;
          
          if(selectedRouteText.length > 0){
            let index = 1;
            for (var row1 of selectedRouteText){
              row1 = row1.replace("\r\n", " ");
              if(row.Routes[row1] !== undefined){
                item[row1] = row.Routes[row1]['routePercent'];
                item['Time ' + index] = row.Routes[row1]['routeTime'];
                if(this.state.routesForAvgArr.indexOf(row1) > -1){
                  totRoutes = parseInt(totRoutes)+parseInt(row.Routes[row1]['routePercent']);
                }
              }
              index++;
              colCount = colCount+1
              colCount = colCount+1
            }
            if(totRoutes > 0){
              avgRoutes = Math.round(totRoutes/(this.state.routesForAvgArr.length));
            }
            item['avg'] = avgRoutes;
            avgValsarr.push(avgRoutes);
          }
          items.push(item);
        }
        this.setState({avgVals: avgValsarr});	
        if(selectedRoute.length > 0){	

          let grp1 = 0;		
          let grp2 = 0;		
          let grp3 = 0;		
          let grp1Percent = 0;		
          let grp2Percent = 0;		
          let grp3Percent = 0;		
          for (const avgData of avgValsarr){		
            if (avgData >= 61 && avgData <= 100) {		
              grp3 = grp3+1;		
            }else if(avgData >= 31 && avgData <= 60){		
              grp2 = grp2+1;		
            }else{		
              grp1 = grp1+1;		
            }		
          }		
          grp1Percent = Math.round((grp1/(avgValsarr.length))*100);		
          grp2Percent = Math.round((grp2/(avgValsarr.length))*100);		
          grp3Percent = Math.round((grp3/(avgValsarr.length))*100);		
          this.setState({grp1Val: grp1});		
          this.setState({grp2Val: grp2});		
          this.setState({grp3Val: grp3});		
          this.setState({grp1PVal: grp1Percent});		
          this.setState({grp2PVal: grp2Percent});		
          this.setState({grp3PVal: grp3Percent});
          this.setState({pieChartDisplay:true})
        }
        this.setState({data: items});
        
      }
    )
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
  
  render() {
    const pieChat = {		
      labels: ['0-30%', '30%-60%','60%-100%'],		
      datasets: [		
      {		
        label: 'Avg % Completion',		
        backgroundColor: [		
          '#B21F00',		
          '#2FDE00',		
          '#00A6B4',		
        ],		
        hoverBackgroundColor: [		
        '#501800',		
        '#175000',		
        '#003350'		
        ],		
        data: [this.state.grp1PVal, this.state.grp2PVal, this.state.grp3PVal]		
        }		
      ]		
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
    const ReportSummary = () =>(
      <div className="section_wrap">
            <div className="box w1">
             
              <div className="white_box type2" data-mh="white_box">
                <table className="activity_table">
                    <thead>
                        <tr>
                            <th className="percent-table-th"></th>
                            <th>
                                <span>Range</span>
                            </th>
                            <th className="percent-table-th-width">
                                <span>User</span>
                            </th>
                            <th className="percent-table-th-width">
                                <span>Percentage(%)</span>
                            </th>
                            <th className="percent-table-th"></th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                          <td className="percent-table-th"></td>
                          <td>
                              <div className="activity_name">
                                  <span>60-100%</span>
                              </div>
                          </td>
                          <td>
                              <div className="activity_couse">{this.state.grp3Val}</div>
                          </td>
                          <td>
                              <div className="activity_time">{this.state.grp3PVal}%</div>
                          </td>
                          <td className="percent-table-th"></td>
                      </tr>
                      <tr>
                          <td className="percent-table-th"></td>
                          <td>
                              <div className="activity_name">
                                  <span>30-60%</span>
                              </div>
                          </td>
                          <td>
                              <div className="activity_couse">{this.state.grp2Val}</div>
                          </td>
                          <td>
                              <div className="activity_time">{this.state.grp2PVal}%</div>
                          </td>
                          <td className="percent-table-th"></td>
                      </tr>
                      <tr>
                          <td className="percent-table-th"></td>
                          <td>
                              <div className="activity_name">
                                  <span>0-30%</span>
                              </div>
                          </td>
                          <td>
                              <div className="activity_couse">{this.state.grp1Val}</div>
                          </td>
                          <td>
                              <div className="activity_time">{this.state.grp1PVal}%</div>
                          </td>
                          <td className="percent-table-th"></td>
                      </tr>
                    </tbody>
                </table>
            </div>
          </div>
          <div className="box w2">
          
            <div className="white_box" data-mh="white_box">
            <Pie
          data={pieChat}
          options={{
            title:{
              display:true,
              text:'Average % Completion Reports',
              fontSize:15
            }
          }}
        />
            </div>
          </div>
          
        </div>
    );
    return (
      <main className="offset" id="content">
        <section className="section_box">
          <h1 className="title1 mb25">Completion Reports</h1>
          <h4 className="title4 mb40">For {this.state.selectedCompanyName}</h4>
          <div className="head_box type2 mb5" id="completion_reports">
            <div className="head_box type2 mb20" style={{ width: "100%" }}>
              <div className="head_box_l">
                <div className="activated_employee type2">
                  <div style={{ paddingRight: "20px" }}>
                    <h4 className="title4 mb15 fw500">Batch</h4>
                    <div style={{'width':'100px'}}>
                    <Select id="batch" value={this.state.selectedBatch}  onChange={this.onBatchChange} options={this.state.batchData} className="Select has-value is-clearable is-searchable Select--multi"
    classNamePrefix="batch"/>
                      
                    </div>
                  </div>
                  <div className="" style={{ paddingRight: "20px" }}>
                    <h4 className="title4 mb15 fw500">Course</h4>
                    <div style={{'width':'300px'}}>
                    <Select ref="course" name="course" value={this.state.selectedCourse}  onChange={this.onCourseChange} options={this.state.courseData} className="Select has-value is-clearable is-searchable Select--multi"
    classNamePrefix="course"/>
                      
                    </div>
                  </div>
                  {/*<div className="" style={{ paddingRight: "20px" }}>
                    <h4 className="title4 mb15 fw500">RouteNos</h4>
                    <div style={{'width':'400px'}}>
                    <Select  value={this.state.selectedRoute} isMulti onChange={this.onRouteSelect} options={this.state.routeData} className="Select has-value is-clearable is-searchable Select--multi"
    classNamePrefix="route " closeMenuOnSelect={false}/>
                     
                    </div>
                  </div> */}
                  <div className="head_box_r">
                  <h4 className="title4 mb10 fw500">&nbsp;</h4>
                    <span
                      className="btn btn-radius btn-size btn-blue btn-icon-right export"
                      onClick={this.handleBtnClick}
                    >
                      <i>
                        <img src="images/icons/arrow_next2.svg" alt="" />
                      </i>
                      <span>Submit</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="reports" className="scrollmenu" style={{'display':'none'}}>
          <ToolkitProvider
          keyField="i_d"
          data={this.state.data}
          columns={this.state.columns}
          className="table type2"
          exportCSV = {{ fileName: this.state.csvFileName }}
        >
        {props => (
              <div  id="table_wraps" style={{'display':'none'}} >
              {(this.state.pieChartDisplay === true && this.state.data.length !== 0) ?<ReportSummary />:''}
              <div className="head_box_c mb15"><MyExportCSV {...props.csvProps} /></div>	
              <div className="table_wraps">
                {this.state.data.length !== 0? 
                <PaginationProvider pagination={paginationFactory(options)}>
                  {({ paginationProps, paginationTableProps }) => (
                    <div className="attenPagination" id="attenPagination">
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
      
      </section>
          </main>
    );
  }
}
export default Reports;
