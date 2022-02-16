import moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import Loader from "react-loader-spinner";
import { up_looking, away_looking, multi_user, zero_candidate } from "../../constant";
import Popup from "../../components/Popup/Popup";

const { SearchBar } = Search;

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
      totalRecords: 0,
      isUpdatingTable: false,
      searchVal: '',
      page: 1,
    };
  }

  componentDidMount() {
    this.loadData(1);
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
      "UFM Percentage",
      "PERCENT",
      "LOCATION",
      "WHATSAPP",
      "Right Answers",
      "Wrong Answer ",
      "Looking Sideways ",
      "Looking Up/Down ",
      "Total time of test ",
      "Time stepped away ",
      "> 1 person ",
      "jee Rank",
      "location",
      "company Name",
      "state Exam Rank",
      "work Experience",
      "are You Working YN",
      "branch Or Department",
      "class10GPAor Percent",
      "college Entrance Name",
      "plans To Work Full Time",
      "graduation College Name",
      "graduation GPAor Percent",
      "final Exam Start If Student",
      "graduation Date If Student",
    ];

    //merge the data with CSV
    csv = [...csv, "\n"].join(",");

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
  unlockRenderStatus = (a) => {
    if (a == 2) {
      return "Unblocked";
    } else if (a == 1) {
      return "Complete";
    } else if (a == 0) {
      return "Incomplete";
    }
  };

  loadData(page) {
    this.setState({
      dateLoaded: false,
    });
    global.api
      .getProctoredTestDetail(this.cohortId, this.quizId, page)
      .then((data) => {
        this.setState({
          dataLoaded: true,
          data: data.data.data,
          cohort: data.cohort,
          totalRecords: data.data.total,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }
  downloadExcel = () => {
    this.setState({
      downloading: true,
    });

    global.api
      .getProctoredTestDetailDownloadExcel(this.cohortId, this.quizId)
      .then(() => {
        alert("Email Sent");
        this.setState({
          downloading: false,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          downloading: false,
        });
      });
  };

  score = (data) => {
    try {
      data = JSON.parse(data);
      return data && data.processed && data.processed.finalResult
        ? data.processed.finalResult
        : "";
    } catch (e) {
      return "";
    }
  };

  totalScore = (data) => {
    try {
      data = JSON.parse(data);
      let processedItmes = data?.processed;
      let lookingUp = 0;
      let lookingDown = 0;
      let persons = 0;
      let totalTime = 0;

      if (processedItmes?.up_looking_percent) {
        lookingUp = parseFloat(processedItmes?.up_looking_percent) * parseFloat(up_looking)
      }
      if (processedItmes?.away_looking_percent) {
        lookingDown = parseFloat(processedItmes?.away_looking_percent) * parseFloat(away_looking)
      }

      if (processedItmes?.multi_user_percent > 0) {
        persons = parseFloat(processedItmes?.multi_user_percent) * parseFloat(multi_user)
      }

      if (processedItmes?.zero_candidate_time > 0) {
        totalTime = (parseFloat(processedItmes?.zero_candidate_time) / parseFloat(processedItmes?.total_time)) * 100
        totalTime = totalTime * parseFloat(zero_candidate)
      }
      let totalFinal = +lookingUp + +lookingDown + +persons + +totalTime;
      return totalFinal.toFixed(2);
    } catch (e) {
      return "";
    }
  };

  updateAllowedReattempt =(id, status) =>{
    this.setState({
      dateLoaded: false,
    });

    global.api
      .unlockProctoredTest({ id, status })
      .then((data) => {
        this.loadData(this.state.page);
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }

  lock = (id, status) => {
    if(status){
      this.setState({showPopupId:id, showPopup:true})
    } else {
      this.updateAllowedReattempt(id, status)
    }
   
  };

  unlockRender = (datum) => {
    const s = {
      color: "blue",
      cursor: "pointer",
    };
    if (datum?.allowedReattempt == 3) {
      return (
        <span style={s} onClick={(e) => this.lock(datum.id, 0)}>
          Start over
        </span>
      );
    } else if (datum?.allowedReattempt == 2) {
      return (
        <span style={s} onClick={(e) => this.lock(datum.id, 0)}>
          Resume
        </span>
      );
    } else if (datum?.allowedReattempt == 1) {
      return (
        <span style={s} onClick={(e) => this.lock(datum.id, 0)}>
          Unbloked
        </span>
      );
    }
     else {
      return (
        <span style={s} onClick={(e) => this.lock(datum.id, 1)}>
          Blocked{" "}
        </span>
      );
    }
  };

  handlePageClick = (event, val) => {
    const newPage = event.selected;
    // handlePagination(newPage)
  };

  onPageChange = (page) => {
    this.setState({ page: page });
    if (this.state.searchVal != '') {
      this.onTableChange(this.state.searchVal, page);

    } else {
      this.loadData(page);
    }
  };
  onTableChange = (type, { searchText }) => {
    this.setState({
      searchVal: searchText
    });
    if (type === "search" && searchText) {
      // search for the result
      this.setState({
        isUpdatingTable: true,
        page: 1
      });
      global.api
        .getProctoredTestDetailSearch(
          this.cohortId,
          this.quizId,
          1,
          searchText
        )
        .then((res) => res)
        .then((data) => {
          // $('#employee-content').show();
          this.setState({
            dataLoaded: true,
            data: data.data.data,
            cohort: data.cohort,
            totalRecords: data.data.total,
            isUpdatingTable: false,
          });
        })
        .catch((err) => {
          alert(err);
          this.setState({ isUpdatingTable: false });
        });
    } else {
      if (type == "search") {
        this.loadData(1)
        this.setState({ page: 1 })
      }

    }
  };

  onCancel = () => {
    const {showPopupId} =this.state;
    this.updateAllowedReattempt(showPopupId, 2)
    this.setState({showPopupId:null, showPopup:false})
  }
  onConfirm = () => {
    const {showPopupId} =this.state;
    this.updateAllowedReattempt(showPopupId, 3)
    this.setState({showPopupId:null, showPopup:false})
  }


  render() {
    const NoDataIndication = () => (
      <div className="table_wraps" id="spinner">
        <div className="spinner" >
          <Loader type="Grid" color="#4441E2" height={100} width={100} />
          Loading....
        </div>
      </div>
    );

    const pagination = paginationFactory({
      page: this.state.page,
      sizePerPage: 20,
      lastPageText: ">>",
      firstPageText: "<<",
      nextPageText: ">",
      prePageText: "<",
      showTotal: false,
      alwaysShowAllBtns: true,
      custom: false,
      onPageChange: this.onPageChange,
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
        formatter: (e, row) =>
          e == 1 ? "User Cancel" : e == 2 ? "Alt tab" : "",

      },
      // {
      //   dataField: "ai_result",
      //   text: "UFM Score",
      //   formatter: (e, row) => {
      //     return this.score(e)},
      // },
      {
        dataField: "ai_result",
        text: "% UFM ",
        formatter: (e, row) => {

          return this.totalScore(e)
        },
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
    let dataSource = [];
    if (data && Object.keys(data) && Object.keys(data).length > 0) {
      dataSource = Object.values(data);
    }
    const NoDataAvailable = () => (
      <div className="spinner nodata-available">
        No Data Available...
      </div>
    );
    const {showPopup} =this.state;
    return (
      <>
        {showPopup && <Popup
          text="Continue incomplete test or Start New"
          cancelText="Resume"
          confirmText="Start over"
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />}

        <ToolkitProvider
          keyField="id"
          data={dataSource}
          columns={columns}
          search
          clasName="proTable"
        >
          {
            props => (
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
                      <div
                        clasName="col-md-6"
                        style={{ textAlign: "left", marginBottom: "1rem" }}
                      >
                        <div className="head_box_c">
                          {this.state.isUpdatingTable ? (
                            <svg
                              height="40"
                              width="40"
                              fill="green"
                              viewBox="0 0 55 80"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="audio-loading"
                            >
                              <g transform="matrix(1 0 0 -1 0 80)">
                                <rect width="10" height="20" rx="3">
                                  <animate
                                    attributeName="height"
                                    begin="0s"
                                    dur="4.3s"
                                    values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                  ></animate>
                                </rect>
                                <rect x="15" width="10" height="80" rx="3">
                                  <animate
                                    attributeName="height"
                                    begin="0s"
                                    dur="2s"
                                    values="80;55;33;5;75;23;73;33;12;14;60;80"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                  ></animate>
                                </rect>
                                <rect x="30" width="10" height="50" rx="3">
                                  <animate
                                    attributeName="height"
                                    begin="0s"
                                    dur="1.4s"
                                    values="50;34;78;23;56;23;34;76;80;54;21;50"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                  ></animate>
                                </rect>
                                <rect x="45" width="10" height="30" rx="3">
                                  <animate
                                    attributeName="height"
                                    begin="0s"
                                    dur="2s"
                                    values="30;45;13;80;56;72;45;76;34;23;67;30"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                  ></animate>
                                </rect>
                              </g>
                            </svg>
                          ) : (
                            <></>
                          )}
                          <form className="form_search">
                            <SearchBar {...props.searchProps} />

                            {/* <SearchBar
                      value={this.state.searchVal}
                      onSearch={onTableChange}
                      // onChange={onTableChange}
                      {...this.props.searchProps}
                      placeholder="Search for student"
                    /> */}
                            <button>
                              <img src="search-icon.svg" alt="" />
                            </button>
                          </form>
                        </div>
                      </div>
                      {downloading && <h3>Generating Report ...</h3>}
                      <div
                        clasName="col-md-6"
                        style={{ textAlign: "right", marginBottom: "1rem" }}
                      >
                        <button
                          onClick={(e) => {
                            this.downloadCSV(
                              dataSource.map((u) => {
                                const rc =
                                  u.resumeContent &&
                                    Object.keys(u.resumeContent).length > 0
                                    ? Object.keys(u.resumeContent).map((k) =>
                                      u.resumeContent[k]
                                        ? u.resumeContent[k]
                                          .replaceAll(",", " ")
                                          .replaceAll("\n", " ")
                                        : ""
                                    )
                                    : [];

                                if (u && u.employee && u.employee) {
                                  rc.push(u.employee.Location);
                                }
                                let aiResult = null;
                                try {
                                  aiResult = u.ai_result
                                    ? JSON.parse(u.ai_result)
                                    : null;
                                  aiResult =
                                    aiResult && aiResult.processed
                                      ? aiResult.processed
                                      : null;
                                } catch (e) { }
                                if (u && u.employee && u.employee) {
                                  rc.push(u.employee.Location);
                                }
                                return [
                                  u.userId,
                                  u.employee.FirstName,
                                  u.employee.LastName,
                                  u.attemptNumber,
                                  u.attemptStatus ? "Y" : "N",
                                  u.reasonIncomplete == 1
                                    ? "User Cancel"
                                    : u.reasonIncomplete == 2
                                      ? "Alt tab"
                                      : "",
                                  // this.score(u.ai_result),
                                  this.totalScore(u.ai_result),
                                  u.percent,
                                  u?.employee?.Location,
                                  u?.resumeContent?.basicInfo?.phone,
                                  u.right,
                                  u.wrong,
                                  aiResult ? aiResult.away_looking_percent : "",
                                  aiResult ? aiResult.up_looking_percent : "",
                                  aiResult ? aiResult.total_time : "",
                                  aiResult ? aiResult.zero_candidate_time : "",
                                  aiResult ? aiResult.multi_user_percent : "",

                                  ...rc,
                                ];
                              })
                            );
                          }}
                          className="btn btn-size3 btn-blue btn-radius export"
                        >
                          <span>Download CSV</span>
                        </button>
                        <button
                          style={{ marginLeft: 10 }}
                          onClick={this.downloadExcel}
                          className="btn btn-size3 btn-blue btn-radius export"
                        >
                          <span>Email Report</span>
                        </button>
                      </div>
                      <h1 className="title1 mb25">Cohorts: {cohort?.name}</h1>
                      <h4 className="title4 mb40">

                        <>
                          <BootstrapTable
                            clasName="proTest"
                            {...props.baseProps}
                            remote={true}
                            keyField="id"
                            onTableChange={this.onTableChange}
                            pagination={pagination}
                            noDataIndication={() => <NoDataAvailable />}

                          />
                        </>
                        {/* {dataSource && dataSource.length == 0 &&
                          <NoDataAvailable />
                        } */}
                      </h4>
                    </div>
                  </div>

                  <div></div>
                  { // loader
                    this.state.dataLoaded ? <></> : <NoDataIndication />
                  }
                </section>
              </main>
            )
          }
        </ToolkitProvider>
      </>
    );
  }
}

export default ProctoredTestDetail;
