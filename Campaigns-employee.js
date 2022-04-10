import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import $ from 'jquery';
import Loader from "react-loader-spinner";

class CampaignEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns:[],
      data:[]
    };
    
    
   }
   
  
  
  render(){
    
      return (
          
                <div id="campaign-employee" className="campaign-weekly-completion" style={{'display':'none'}} >
                  <ToolkitProvider
                  keyField="i_d"
                  data={this.state.data}
                  columns={this.state.columns}
                  className="table type2"
                >
                {props => (
                      <div  id="table_wraps" style={{'display':'none'}} >
                        <div className="">
                          {this.state.data.length !== 0? 
                          <PaginationProvider pagination={paginationFactory(options)}>
                            {({ paginationProps, paginationTableProps }) => (
                              <div className="campain-week-comple" id="campain-week-employee">
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
    )
  }
}
export default CampaignEmployee;


