import moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";

class ProctoredTestUserDetail extends Component {
  constructor(props) {
    super(props);

    this.attemptLogId = props.match.params.attemptLogId;
    this.state = {
      dateLoaded: false,
      cohort: null,
      dateLoaded: false,

      data: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({
      dateLoaded: false,
    });

    global.api
      .getProctoredTestUserDetail(this.attemptLogId)
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
      const total = data.length;
      let correct = data.filter((item) => item.isAnswerCorrect);
      return total > 0 ? ((correct.length / total) * 100).toFixed(2) + "%" : "";
    } catch (e) {
      return "";
    }
  };

  unlockRender = (datum) => {
    const s = {
      color: "blue",
      cursor: "pointer",
    };
    if (datum.attemptStatus == 2) {
      return <span style={s}>Unblocked</span>;
    } else if (datum.attemptStatus == 1) {
      return <span style={s}>Complete </span>;
    } else if (datum.attemptStatus == 0) {
      return <span style={s}>Incomplete </span>;
    }
  };

  getData = (data, key) => {
    key = key.split(".");
    if (key.length == 1) {
      return data[key[0]] ? data[key[0]] : "";
    } else if (key.length == 2) {
      return data[key[0]] && data[key[0]][key[1]] ? data[key[0]][key[1]] : "";
    }
    if (key.length == 3) {
      return typeof data[key[0]] &&
        data[key[0]][key[1]] &&
        data[key[0]][key[1]][key[2]]
        ? data[key[0]][key[1]][key[2]]
        : "";
    }
  };

  render() {
    const { data, cohort } = this.state;
    const columns = [
      {
        dataField: "userId",
        text: "Email",
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
        // formatter: (e, row) => (e == 1 ? "Y" : e == 0 ? "N" : ""),
      },
      {
        dataField: "attemptStatus",
        text: "Exam Attempt",
        // formatter: (e, row) => this.unlockRender(row),
      },
      {
        dataField: "answerJSON",
        text: "Score",
        // formatter: (e, row) => this.score(e),
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
              <h1 className="title1 mb25">Cohorts: {cohort?.name}</h1>
              <h4 className="title4 mb40">
                {data && data.employee && (
                  <>
                    <li>
                      <b>Email </b> : {data?.userId}{" "}
                    </li>
                    <li>
                      <b>First Name </b> : {data?.employee?.FirstName}{" "}
                    </li>
                    <li>
                      <b>Last Name </b> : {data?.employee?.LastName}{" "}
                    </li>
                    <li>
                      <b>Attempts </b> : {data?.attemptNumber}{" "}
                    </li>
                    <li>
                      <b>Complete </b> :{" "}
                      {data.attemptStatus == 1
                        ? "Yes"
                        : data.attemptStatus == 0
                        ? "No"
                        : ""}{" "}
                    </li>
                    <li>
                      <b>Exam Attempt </b> : {this.unlockRender(data)}{" "}
                    </li>
                    <li>
                      <b>Score </b> : {this.score(data.answerJSON)}{" "}
                    </li>
                    <li>
                      <b>Location </b> : {data?.employee?.Location}{" "}
                    </li>

                    {Object.keys(data.resumeContent).map((k) => (
                      <li key={k}>
                        <b>{k.replace(/([a-z])([A-Z])/g, "$1 $2")}: </b>
                        {data.resumeContent[k]}
                      </li>
                    ))}
                  
                    <video width="320" height="240" controls style={{marginTop:20}}>
                      <source src={`https://langappnew.s3.amazonaws.com/${data.proctoredVideo}`} type="video/mp4" />
                    </video>
                  </>
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

export default ProctoredTestUserDetail;
