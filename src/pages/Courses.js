import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, {  Search } from "react-bootstrap-table2-toolkit";
const { SearchBar } = Search;

class Courses extends Component {
  constructor(props) {
    super(props);
    function formatter(cell, row) {
      return (
        <div className="course_child_it">
                  <span className="btn btn-size3 btn-blue btn-radius export" name={row.courseName} id={row.courseNumber}>
                      <span name={row.courseName} id={row.courseNumber}>Go to course</span>
                  </span>
              </div>
    
        );
    }
    
   
    function courseFormater(cell, row,rowIndex) {

      let imgPath = '/images/icons/icon_module_'+row.moduleNo+'.svg'      
      let trId = "courses_"+rowIndex
      return (
              <div id={trId} className="course_child_it">
                <div className="course_child_img">
                    <img src={imgPath} alt=""/>
                </div>                  
                <div className="course_child_text">
                    <div className="course_child_title">{row.courseName}</div>
                </div>
              </div>
              )
    }
    this.state = {
      columns:[{
        dataField: "i_d",
        text: "Id",
        hidden: true
       },
       {
         text: 'COURSE',
         dataField: 'courseName',
         formatter: courseFormater,
         headerStyle: {
          width:'38%'
        }
       },
       {
        text: 'course Number',
        dataField: "courseNumber",
        headerStyle: {
          width:'15%'
        },
      },
       {
        text: "Batch",
        dataField: "batchNumber",
        headerStyle: {
          width:'7%'
        }
       },
       {
        dataField: "moduleNo",
        text: "Module ",
        headerStyle: {
          width:'8%'
        }
       },
      
       {
        dataField: "courseStartDate",
        text: "Start Date",
        headerStyle: {
          width:'10%'
        }
       },
       {
         text: 'Enrolled',
         dataField: 'enrolled',
         headerStyle: {
          width:'10%'
        }
       },
       {
        text: '',
        dataField: "",
        formatter: formatter,
        headerStyle: {
          width:'12%'
        },
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            
            this.props.history.push({
              pathname: '/coursedetail',
              state: {courseId: row.courseNumber, courseName:row.courseName}
            });
          }
        }
       
      }],
      data : []
       
    }
    
  }
  componentDidMount() {

    global.api.getCourseList(global.companyCode)
                .then(res => res)
                .then(data => this.setState({data}))
                .catch(err =>{
                    alert(err);
                })
    //For Batch
    global.api.getBatch(global.companyCode)
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
    console.log(`Batch selected:`, selectedBatch.value);
    var batchNumber = selectedBatch.value;
    global.api.getCourseList(global.companyCode,batchNumber)
                .then(res => res)
                .then(data => this.setState({data}))
                .catch(err =>{
                    alert(err);
                })
    
  };

  render() {
    
    const NoDataIndication = () => (
      <div className="spinner">
        <Loader type="Grid" color="#4441E2" height={100} width={100} />
                Loading....
      </div>
    );
    const NoDataAvailable = () => (
      <div className="spinner nodata-available">
       No Data Available...
      </div>
    );
        
    return (<main className="offset" id="content" style={{'backgroundColor':'#f2f3f8'}}>
            <section className="section_box">
                <div className="head_box type2 mb25">
                    <div className="head_box_l">
                        <h1 className="title1 m_b_zero">Courses</h1>
                        <div className="batch-select-box">
                          <span className="title4 ">Batch</span>
                        </div>
                        <div className="batch-select-box">
                          <div style={{'width':'100px'}}>
                            <Select id="batch" value={this.state.selectedBatch}  onChange={this.onBatchChange} options={this.state.batchData} className="Select has-value is-clearable is-searchable Select--multi"
      classNamePrefix="batch"/>
                          </div>
                        </div>
                    </div>
                    
                </div>
                <div className="course_container">
                {this.state.data.length !== 0? 
                    
                        <ToolkitProvider
                        keyField="i_d"
                        data={ this.state.data }
                        columns={ this.state.columns }
                        classes="course_table"
                        search
                        >
                        {props => (
                            <div className="head_box type2 mb20">
                              <div className="head_box_c">
                                <div className="form_search">
                                  <SearchBar { ...props.searchProps } placeholder="Search for course "/>
                                  <button>
                                      <img src="images/icons/search-icon.svg" alt="" />
                                  </button>
                                </div>
                              </div>
                              <BootstrapTable
                                { ...props.baseProps }
                                filter={ filterFactory() }
                                classes="course_table"
                                noDataIndication={ () => <NoDataAvailable /> }
                              />
                              </div>
                        )}
                      </ToolkitProvider>
                    :<NoDataIndication />}
                </div>
            </section>
        </main>)
  }
}
export default Courses;
