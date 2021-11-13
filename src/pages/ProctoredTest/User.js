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
      return data && data.processed && data.processed.finalResult ? data.processed.finalResult:'' 
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
    let aiOutput ={};
    let ai_result ={};
    if(data.aiOutput ){
      try {
        aiOutput =(JSON.parse(data.aiOutput));
      } catch (e){

      }
    }
    if(data.ai_result ){
      try {
        ai_result =(JSON.parse(data.ai_result));
      } catch (e){

      }
    }
    console.log({aiOutput});
    return (
      <main className="offset" id="content">
        <div className="row">
          <div className="">
            <h4 className="title4 mb40">Candidate Full Details</h4>
            <br />
          </div>
        </div>

        <section className="section_box">
          <div className="row">
            <div className="col-md-12">
              <h1 className="title1 mb25">Email:{data?.userId}</h1>
              <div className="title4 mb40">
                {data && data.employee && (
                  <div className="row">
                    <div className="col-md-7">
                      <div className="flex">
                        <div className="col-md-5  label">Email </div><div className="col-md-7  labelval"> {data?.userId}</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">First Name </div><div className="col-md-7  labelval"> {data?.employee?.FirstName}</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">Last Name </div><div className="col-md-7  labelval"> {data?.employee?.LastName}</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">Attempts </div><div className="col-md-7  labelval"> {data?.attemptNumber}</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">Complete </div><div className="col-md-7  labelval">
                          {data.attemptStatus == 1
                            ? "Yes"
                            : data.attemptStatus == 0
                              ? "No"
                              : ""}</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">Exam Attempt </div><div className="col-md-7  labelval"> {this.unlockRender(data)}</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">UFM Score </div><div className="col-md-7  labelval"> {this.score(data.ai_result)}</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">Looking Sideways </div><div className="col-md-7  labelval"> {ai_result?.processed?.away_looking_percent}%</div>
                      </div>
                       <div className="flex">
                        <div className="col-md-5  label">Looking  Up/Down </div><div className="col-md-7  labelval">{ai_result?.processed?.up_looking_percent}%</div>
                      </div>
                       <div className="flex">
                        <div className="col-md-5  label">Total time of test </div><div className="col-md-7  labelval">{ai_result?.processed?.total_time} Seconds</div>
                      </div>
                       <div className="flex">
                        <div className="col-md-5  label">Time stepped away </div><div className="col-md-7  labelval">{ai_result?.processed?.zero_candidate_time} Seconds</div>
                      </div>
                       <div className="flex">
                        <div className="col-md-5  label">> 1 person </div><div className="col-md-7  labelval">{ai_result?.processed?.multi_user_percent}%</div>
                      </div>
                      <div className="flex">
                        <div className="col-md-5  label">Location </div><div className="col-md-7  labelval"> {data?.employee?.Location}</div>
                      </div>
                      {/* <div className="flex">
                        <div className="col-md-5  label">AI Analysis  </div><div className="col-md-7  labelval"> {data.aiStatus == 0 ? 'Not Started' : data.aiStatus == 1 ? 'Completed' : data.aiStatus == 2 ? 'Errored' : ''}</div>
                      </div> */}
                      <div className="flex">
                        <div className="col-md-5  label">AI Analysis Result </div><div className="col-md-7  labelval">
                          { aiOutput &&  Object.keys(aiOutput).length > 0 ? Object.keys(aiOutput).map((k) => (<div className="flex" key={k}>
                            <div className="col-md-5  label">{k.replace(/([a-z])([A-Z])/g, "$1 $2")}: </div>
                            <div className="col-md-7  labelval">{aiOutput && aiOutput[k] ? aiOutput[k] :''}</div>
                          </div>)) : null}
                        </div>
                      </div>

                      {data.resumeContent && Object.keys(data.resumeContent).length > 0 && Object.keys(data.resumeContent).map((k) => (
                        <div className="flex" key={k}>
                          <div className="col-md-5  label">{k.replace(/([a-z])([A-Z])/g, "$1 $2")}: </div>
                          <div className="col-md-7  labelval">{data.resumeContent[k]}</div>
                        </div>

                      ))}

                    </div>
                    <div className="col-md-5 proctoredVideo">
                      <div className="proctoredVideo">
                        <video controls width="100%">
                          <source src={`https://langappnew.s3.amazonaws.com/${data.proctoredVideo}`} type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div></div>
        </section>
      </main >
    );
  }
}

export default ProctoredTestUserDetail;
