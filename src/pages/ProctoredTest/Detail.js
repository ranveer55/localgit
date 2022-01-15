import moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ReactPaginate from "react-paginate";
import paginationFactory from "react-bootstrap-table2-paginator";

class ProctoredTestDetail extends Component {
  constructor(props) {
    super(props);

    this.cohortId = props.match.params.cohortId;
    this.quizId = props.match.params.quizId;
    this.state = {
      dateLoaded: false,
      cohort: null,
      dateLoaded: false,
      startDate: new Date(moment().subtract(1, "week")),
      endDate: new Date(moment()),
      data: [],
      totalRecords:0
    };
  }

  componentDidMount() {
    this.loadData(this.state.startDate, this.state.endDate,1);
  }
  downloadCSV(data) {
    //define the heading for each row of the data
    let csv = [
      "Email",
      "First Name",
      "Last Name",
      "ATTEMPTS",
      "COMPLETE",
      // "EXAM ATTEMPT",
      "Reason Incomplete",
      "UFM SCORE",
      "PERCENT",
      "LOCATION",
      "WHATSAPP",
      "Right Answers","Wrong Answer ","Looking Sideways ","Looking Up/Down ","Total time of test ","Time stepped away ","> 1 person ",
      "jee Rank", "location", "company Name", "state Exam Rank", "work Experience", "are You Working YN", "branch Or Department", "class10GPAor Percent", "college Entrance Name", "plans To Work Full Time","graduation College Name","graduation GPAor Percent","final Exam Start If Student","graduation Date If Student"
    ]
    
    //merge the data with CSV
    csv =[...csv,"\n"].join(",");
    
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
  unlockRenderStatus= (a) => {
    if (a == 2) {
      return 'Unblocked';
    }
     else if (a == 1) {
        return 'Complete';
    }else if (a == 0) {
        return 'Incomplete';
    }
  }

  loadData(startDate, endDate,page) {
    this.setState({
      dateLoaded: false,
    });

    global.api
      .getProctoredTestDetail(this.cohortId, this.quizId,page)
      .then((data) => {
        console.log('getProctoredTestDetail--',data.data.total)
        this.setState({
          dataLoaded: true,
          data: data.data.data,
          cohort: data.cohort,
          totalRecords:data.data.total
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }
  downloadExcel=() =>{
      this.setState({
        downloading:true
      });

      global.api
        .getProctoredTestDetailDownloadExcel(this.cohortId, this.quizId)
        .then(() => {
          alert('Email Sent')
          this.setState({
            downloading:false
          });
          // this.setState({ batchData: data });
        })
        .catch((err) => {
          this.setState({
            downloading:false
          });
        });
    }

  score = (data) => {
    try {
      data = JSON.parse(data);
      return data && data.processed && data.processed.finalResult ? data.processed.finalResult:'' 
    } catch (e) {
      return "";
    }
  };
  lock = (id, status) => {
    this.setState({
      dateLoaded: false,
    });

    global.api
      .unlockProctoredTest({ id, status })
      .then((data) => {
        this.loadData();
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  };
  
 
  
  
  unlockRender = (datum) => {
    const s ={ 
        color:'blue',
        cursor:'pointer'
    }
  if (datum?.allowedReattempt == 1) {
    return <span style={s} onClick={(e) => this.lock(datum.id, 0)}>Unblocked</span>
  } else {
      return <span style={s} onClick={(e) => this.lock(datum.id, 1)}>Blocked </span>;
  }
};

 handlePageClick = (event, val) => {
  const newPage = event.selected;
  // handlePagination(newPage)
};

onPageChange = (page)  => {
  this.setState({page: page})
  console.log('onPageChange--',page)
  this.loadData(1,1,page)

}
  render() {
    const defaultSorted = [{
      dataField: 'name',
      order: 'desc'
    }];
    const pagination = paginationFactory({
      sizePerPage: 5,
      lastPageText: '>>',
      firstPageText: '<<',
      nextPageText: '>',
      prePageText: '<',
      showTotal: true,
      alwaysShowAllBtns: true,
      // page: this.state.page,
      custom:false,
      // dataSize:5,
      // paginationSize:5,
      // alwaysShowAllBtns:true, 
      // totalSize:180,
      // showTotal:true,
      // sizePerPage:5,
      onPageChange: this.onPageChange,

      // sizePerPageRenderer,
      totalSize: this.state.totalRecords,
  });

    const { data, cohort, downloading } = this.state;
    const columns = [
      {
        dataField: "Email",
        text: "Email",
        width: 250,
        formatter: (e, row) => (
          <span
            style={{
              wordBreak: "break-all",
              color: "#408BF9",
            }}
          >
            <a href={`/proctored-test/user/${row?.id}`}>{row?.userId}</a>
          </span>
        ),
      },

      {
        dataField: "employee.FirstName",
        text: "First Name",
      },
      {
        dataField: "employee.LastName",
        text: "Last Name",
      },
      {
        dataField: "attemptNumber",
        text: "Attempts",
      },
      {
        dataField: "attemptStatus",
        text: "Complete",
        formatter: (e, row) => (e == 1 ? "Y" : e == 0 ? "N" : ""),
      },
       
      {
        dataField: "attemptStatus",
        text: "Exam Attempt",
        formatter: (e, row) => this.unlockRender(row),
      },
      {
        dataField: "reasonIncomplete",
        text: "reason Incomplete",
        formatter: (e, row) => (e == 1 ? "User Cancel" : e == 2 ? "Alt tab" : ""),
      },
      {
        dataField: "ai_result",
        text: "UFM Score",
        formatter: (e, row) => this.score(e),
      },
      {
        dataField: "percent",
        text: "Percentage",
      },
      {
        dataField: "employee.Location",
        text: "Location",
      },
      // {
      //   dataField: "resumeContent.basicInfo.address",
      //   text: "Current Address",
      // },
      {
        dataField: "resumeContent.basicInfo.phone",
        text: "WhatsApp",
      },
      // {
      //   dataField: "resumeContent.education[0].institution",
      //   text: "College",
      // },
    ];
    let dataSource =[];
    if(data && Object.keys(data) && Object.keys(data).length > 0){
      dataSource = Object.values(data);
    }
    
    return (
      <main className="offset" id="content">
        <div className="row">
          <div className="">
            <h4 className="title4 mb40">Procotored Tests</h4>
            <br />
          </div>
        </div>

        <section className="section_box">
          <div className="row">
            
            <div className="col-md-12">
              {downloading && <h3>Generating Report ...</h3>}
            <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                  <button
                      onClick={e => {
                          this.downloadCSV(dataSource.map(u => {
                            const rc =u.resumeContent && Object.keys(u.resumeContent).length > 0 ?
                            Object.keys(u.resumeContent).map((k) => u.resumeContent[k] ?  u.resumeContent[k].replaceAll(',',' ').replaceAll('\n',' '):'' ):[]
                            
                            if(u && u.employee && u.employee ){
                              rc.push(u.employee.Location)
                              
                            }
                            let aiResult =null;
                            try{
                              aiResult = u.ai_result ? JSON.parse(u.ai_result) :null
                              aiResult =aiResult && aiResult.processed ? aiResult.processed :null
                            } catch (e){
                             
                            }
                            if(u && u.employee && u.employee ){
                              rc.push(u.employee.Location)
                              
                            }
                              return [
                                  u.userId,
                                  u.employee.FirstName ,
                                  u.employee.LastName,
                                  u.attemptNumber,
                                  u.attemptStatus ? 'Y':'N',
                                  u.reasonIncomplete  == 1 ? "User Cancel" : u.reasonIncomplete == 2 ? "Alt tab" : "",
                                  this.score(u.ai_result),
                                  u.percent,
                                  u?.employee?.Location,
                                  u?.resumeContent?.basicInfo?.phone,
                                  u.right,
                                  u.wrong,
                                  aiResult ? aiResult.away_looking_percent:'',
                                  aiResult ? aiResult.up_looking_percent:'',
                                  aiResult ? aiResult.total_time:'',
                                  aiResult ? aiResult.zero_candidate_time:'',
                                  aiResult ? aiResult.multi_user_percent:'',

                                  ...rc
                              ];
                          }));
                      }}
                      className="btn btn-size3 btn-blue btn-radius export">
                      <span>Download CSV</span>
                  </button>
                  <button style={{marginLeft:10}} onClick={this.downloadExcel} className="btn btn-size3 btn-blue btn-radius export">
                      <span>Email Report</span>
                  </button> 
              </div>
              <h1 className="title1 mb25">Cohorts: {cohort?.name}</h1>
              <h4 className="title4 mb40">
                {dataSource && dataSource.length > 0 ? (
                  <>
                  <BootstrapTable
                  remote={true}
                   keyField="id" 
                   data={dataSource}
                  columns={columns} 
                  pagination={pagination}
                  defaultSorted={defaultSorted} 
                  />
              {/* <ReactPaginate
                  className="pagination react-bootstrap-table-page-btns-ul"
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={(e) => this.handlePageClick(e)}
                  pageRangeDisplayed={5}
                  // pageCount={100}
                  pageCount={10}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                /> */}
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

export default ProctoredTestDetail;
