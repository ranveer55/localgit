import moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";

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
    };
  }

  componentDidMount() {
    this.loadData(this.state.startDate, this.state.endDate);
  }
  downloadCSV(data) {
    //define the heading for each row of the data
    var csv = [
      "Email",
      "First Name",
      "Last Name",
      "ATTEMPTS",
      "COMPLETE",
      "EXAM ATTEMPT",
      "UFM SCORE",
      "LOCATION",
      "CURRENT ADDRESS",
      "WHATSAPP",
      "COLLEGE",
      "\n",
    ].join(",");

    //merge the data with CSV
    data.forEach(function (row) {
      console.log(row)

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

  loadData(startDate, endDate) {
    this.setState({
      dateLoaded: false,
    });

    global.api
      .getProctoredTestDetail(this.cohortId, this.quizId)
      .then((data) => {
        this.setState({
          dataLoaded: true,
          data: data.data,
          cohort: data.cohort,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
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
  if (datum.allowedReattempt == 1) {
    return <span style={s} onClick={(e) => this.lock(datum.id, 0)}>Unblocked</span>
  } else {
      return <span style={s} onClick={(e) => this.lock(datum.id, 1)}>Blocked </span>;
  }
};

  render() {
    const { data, cohort } = this.state;
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
            <a href={`/proctored-test/user/${row.id}`}>{row.userId}</a>
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
        dataField: "ai_result",
        text: "UFM Score",
        formatter: (e, row) => this.score(e),
      },
      {
        dataField: "employee.Location",
        text: "Location",
      },
      {
        dataField: "resumeContent.basicInfo.address",
        text: "Current Address",
      },
      {
        dataField: "resumeContent.basicInfo.phone",
        text: "WhatsApp",
      },
      {
        dataField: "resumeContent.education[0].institution",
        text: "College",
      },
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
            <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                  <button
                      onClick={e => {
                          this.downloadCSV(dataSource.map(u => {
                              return [
                                  u.userId,
                                  u.employee.FirstName ,
                                  u.employee.LastName,
                                  u.attemptNumber,
                                  u.attemptStatus ? 'Y':'N',
                                  this.unlockRenderStatus(u.attemptStatus),
                                 
                                 
                              ];
                          }));
                      }}
                      className="btn btn-size3 btn-blue btn-radius export">
                      <span>Download CSV</span>
                  </button>
              </div>
              <h1 className="title1 mb25">Cohorts: {cohort?.name}</h1>
              <h4 className="title4 mb40">
                {dataSource && dataSource.length > 0 ? (
                  <BootstrapTable keyField="id" data={dataSource} columns={columns} />
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
