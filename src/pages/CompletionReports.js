import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
//import paginationFactory from 'react-bootstrap-table2-paginator';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

class CompletionReports extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      columns:[{
        dataField: "i_d",
        text: "Id",
        hidden: true
       },
       {
        text: 'FirstName',
        dataField: 'FirstName',
        headerStyle: {
          width:'10%'
        }
      },
      {
        text: 'LastName',
        dataField: 'LastName',
        headerStyle: {
          width:'15%'
        }
      },
       {
        text: "Email",
        dataField: "userId",
        headerStyle: {
          width:'20%'
        },
        classes:'entry-text'
       },
       {
         text: 'Mobile',
         dataField: 'Mobile',
         headerStyle: {
          width:'10%'
        }
       },
       {
         text: 'MobileOS',
         dataField: 'mobileOS',
         headerStyle: {
          width:'10%'
        }
       },
       {
         text: 'Location',
         dataField: 'Location',
         headerStyle: {
          width:'25%'
        },
        classes:'entry-text'
       },
       {
         text: 'DNI',
         dataField: 'DNI',
         headerStyle: {
          width:'10%'
        },
        columnStyle:{'textAlign':'center'}
       }],
      data : [],

    
    };
    this.state.selected = [];
    this.state.userData = [];
    this.state.companyData = [];
    this.state.selectedCompany = '133';
    this.state.batchData = [];
    this.state.selectedBatch = '';
    this.state.moduleData = [];
    this.state.selectedModule = '';
    this.state.routeData = [];
    this.state.selectedRoute = [];
    this.state.selectedRouteText = [];
  }
  
   componentDidMount() {
    fetch("https://api1.taplingua.com/v1/company.php")
    .then((res) => {return res.json();})
    .then(companyData => this.setState({companyData}));

    //For batch
    fetch('https://api1.taplingua.com/v1/batch.php?companyCode=133')
    .then(response => response.json())
    .then(data => this.setState({ batchData: data }));
  } 
  
  onCompanyChange= (e) => {
    //List of Batches for selected Company
    this.setState({selectedCompany: e.target.value});
    if(e.target.value === ""){
      alert("You must select company");
    }else{
      const batchApi = 'https://api1.taplingua.com/v1/batch.php?companyCode=';
      const defaultQuery = e.target.value;
      fetch(batchApi + defaultQuery)
      .then(response => response.json())
      .then(data => this.setState({ batchData: data }));
      //console.log(this.state.batchData);
    }
  }
   onBatchChange= (e) => {
    //List of Batches for selected Company
    this.setState({selectedBatch: e.target.value});
    if(e.target.value === ""){
      alert("You must select Batch");
    }else{
      const moduleApi = 'https://api1.taplingua.com/v1/moduleList.php?companyCode=';
      const defaultQuery = this.state.selectedCompany;
      fetch(moduleApi + defaultQuery)
      .then(response => response.json())
      .then(
        data => {
        //console.log("moduleData===>",data['0'].Modules);
        this.setState({ moduleData: data['0'].Modules });
      });
    }
  }
  onModuleChange= (e) => {
    //List of Batches for selected Company
    this.setState({selectedModule: e.target.selectedIndex});
    if(e.target.value === ""){
      alert("You must select Batch");
    }else{
      const routeApi = 'https://api1.taplingua.com/v1/routeList.php?moduleNo=';
      const defaultQuery = e.target.value;
      fetch(routeApi + defaultQuery)
      .then(response => response.json())
      .then(
        data => {
        //console.log("routeData===>",data);
        this.setState({ routeData: data});
      });
    }
  }
  onRouteSelect= (e) => {
    const cols = this.state.columns;
    const selRoute = [];
    //this.setState({selectedRouteText: selRoute});

    this.setState({selectedRoute: e.target.value});
    var options = e.target.options;
    
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);

        var selectedItem = options[i].text;
            
        let hasMatch =false;
        for (var index = 0; index < cols.length; ++index) {
          const columnData = cols[index];
          if(columnData.text === selectedItem){
              hasMatch = true;
              break;
          }
        }
        if(hasMatch === false){
          selRoute.push(selectedItem);
        }
      }
    }
    this.setState({selectedRouteText: selRoute});
    this.setState({selectedRoute: value});
  }
  handleDownloadCSV = () => {
    alert("Downloading...");
  }
  handleBtnClick = () => {
    //console.log(this.state);
    this.forceUpdate();
    const colNames = this.state.columns;
    
    const selectedRouteText = this.state.selectedRouteText;
    
    for (const row1 of selectedRouteText) {
     const routeCols = {
        text: row1,
        dataField: row1,
      };
      colNames.push(routeCols);
    }
    this.setState({columns: colNames});
    this.setState({selectedRouteText: []});
    //const queryString = routeApi1 + "?CompanyCode=" + selectedCompany + "&batchNo=" + selectedBatch + "&moduleNo=" + selectedModule + "&routes=" + selectedRoute;
    //console.log("queryString-->", queryString);
    const routeApi = 'https://api1.taplingua.com/v1/getEmployee.php?CompanyCode=133';
    fetch(routeApi)
    .then(res => res.json())
    .then(
      
      result => {
        const items = [];
        
        for (const row of result) {
          let userId = row.userId;
          let item = row;
          fetch("https://api1.taplingua.com/v1/employee_course_json_with_email.php?userId="+userId)
          .then(res1 => res1.json())
          .then(
            
            result1 => {
              
              for (const row1 of result1) {
                
                if(row1.moduleNumber === "5" && row1.Routes !== null){
                  //console.log(row1)
                  for (const row2 of selectedRouteText){
                    item[row2] = row1.Routes[row2];
                  }
                }
              }
            }
          )
          
          items.push(item);
        }
        //console.log("Data===>",items);
        this.setState({
          isLoaded: true,
          data: items
        });
      }
    )

  }
  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.i_d]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.i_d)
      }));
    }
  }
  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.i_d);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }
  render() {
    
    const options = {
      custom: true,
      totalSize: this.state.data.length
    };
    
    return (
      <main className="offset" id="content">
        <section className="section_box">
        <h1 className="title1 mr15">Completion Reports</h1>
        <div style={{'height':'50px'}}></div>
            <div className="head_box type2 mb55">
            <div className="head_box type2 mb20" style={{'width':'90%'}}>
                <div className="head_box_l" style={{'width':'30%', 'paddingLeft':'50px'}}>
                    <div className="activated_employee type2">
                        
                        <div className="activated_employee_it mr60" >
                        
                            <h4 className="title4 mb15 fw500">Company</h4>
                              <div className="select_box">
                                  <select className="select select_size" >
                                      <option key="0" value="0">Select Company</option>
                                      <option key="133" value="133">Accor Hotels</option>
                                  </select>
                              </div>
                            
                        </div>
                        <div className="activated_employee_it">
                          <h4 className="title4 mb15 fw500">Batch</h4>
                          <div className="select_box">
                            <select className="select select_size" value={this.state.selectedBatch} onChange={this.onBatchChange}>
                            {this.state.batchData.map((batch) => <option key={batch.Id} value={batch.Id}>{batch.batchNumber}</option>)}
                            </select>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="head_box_c" style={{'width':'auto'}}>
                    
                      <h4 className="title4 mb15 fw500">Module</h4>
                      <div className="select_box">
                        <select className="select select_size" style={{'width':'350px'}} value={this.state.selectedModule} onChange={this.onModuleChange}>
                        {this.state.moduleData.map((module) => <option key={module.moduleNo} value={module.moduleNo}>{module.moduleName}</option>)}
                        </select>
                      </div>
                    
                </div>
                <div className="head_box_r" style={{'paddingRight':'20px'}}>
                  <h4 className="title4 mb15 fw500">RouteNos</h4>
                      <div className="select_box">
                        <select className="select select_size" style={{'height':'60px','width':'200px'}} multiple={true} value={this.state.selectedRoute} onChange={this.onRouteSelect}>
                        {this.state.routeData.map((route) => <option key={route.routeNo} value={route.routeNo}>{route.description}</option>)}
                        </select>
                      </div>
                      
                </div>
                <div className="head_box_r">
                  <h4 className="title4 mb15 fw500">RouteNos</h4>
                      
                      <span className="btn btn-radius btn-size btn-blue btn-icon-right" onClick={ this.handleBtnClick }>
                        <i>
                            <img src="images/icons/arrow_next2.svg" alt="" />
                        </i>
                        <span>Submit</span>
                    </span>
                </div>
            </div>
            
            </div>
            <ToolkitProvider
          keyField="i_d"
          data={ this.state.data }
          columns={ this.state.columns }
          className="table type2"
          search>
          {
            props => (
                <div className="table_wraps">
            
            <PaginationProvider pagination={ paginationFactory(options) }>
                {({ paginationProps, paginationTableProps}) => (
                  <div className="attenPagination">
                  <BootstrapTable
                    { ...props.baseProps }
                    { ...paginationTableProps }
                  />
                  <PaginationListStandalone
                    { ...paginationProps }
                  />
                </div>
                ) 
               }
            </PaginationProvider>
          </div>
                  
            )
          }
        
        </ToolkitProvider>
        </section>
          </main>
    );
  }
}
export default CompletionReports;


