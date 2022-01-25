
import React, { Component } from "react";
import {up_looking,away_looking,multi_user,zero_candidate} from "../../constant";

class ProctoredTestUserDetail extends Component {
  constructor(props) {
    super(props);

    this.attemptLogId = props.match.params.attemptLogId;
    this.state = {
      dateLoaded: false,
      cohort: null,
      dateLoaded: false,
      showAnswer: false,

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
      return data && data.processed && data.processed.finalResult ? data.processed.finalResult : ''
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
      
      if(processedItmes?.up_looking_percent){
        lookingUp = parseFloat(processedItmes?.up_looking_percent) * parseFloat(up_looking)
      }
      if(processedItmes?.away_looking_percent){
        lookingDown = parseFloat(processedItmes?.away_looking_percent) * parseFloat(away_looking)
      }

      if(processedItmes?.multi_user_percent > 0){
        persons = parseFloat(processedItmes?.multi_user_percent) * parseFloat(multi_user)
      }

      if(processedItmes?.zero_candidate_time > 0){
        totalTime = (parseFloat(processedItmes?.zero_candidate_time) / parseFloat(processedItmes?.total_time)) * 100
        totalTime = totalTime * parseFloat(zero_candidate)
      }
      let totalFinal = +lookingUp + +lookingDown + +persons + +totalTime;
      return totalFinal.toFixed(2);
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

  combineChunks =()=>{
    this.setState({
      dateLoaded: false,
    });

    global.api
      .combineChunks(this.attemptLogId)
      .then((data) => {
        this.setState({
          dataLoaded: true,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }


  render() {
    const { data, cohort, showAnswer } = this.state;
    let aiOutput = {};
    let ai_result = {};
    if (data.aiOutput) {
      try {
        aiOutput = (JSON.parse(data.aiOutput));
      } catch (e) {

      }
    }
    if (data.ai_result) {
      try {
        ai_result = (JSON.parse(data.ai_result));
      } catch (e) {

      }
    }
    const answers = data && data.answers && data.answers.length > 0 ? data.answers : [];

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
                  <>
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
                          <div className="col-md-5  label">Right Answers</div><div className="col-md-7  labelval"> {data.right}</div>
                        </div>
                        <div className="flex">
                          <div className="col-md-5  label">Wrong Answer </div><div className="col-md-7  labelval"> {data.wrong}</div>
                        </div>
                        <div className="flex">
                          <div className="col-md-5  label">Percentage </div><div className="col-md-7  labelval"> {data?.percent.toFixed(2)}</div>
                        </div>
                        <div className="flex">
                          <div className="col-md-5  label">UFM % </div><div className="col-md-7  labelval"> {this.totalScore(data.ai_result)}%</div>
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
                        {/* <div className="flex">
                        <div className="col-md-5  label">AI Analysis Result </div><div className="col-md-7  labelval">
                          { aiOutput &&  Object.keys(aiOutput).length > 0 ? Object.keys(aiOutput).map((k) => (<div className="flex" key={k}>
                            <div className="col-md-5  label">{k.replace(/([a-z])([A-Z])/g, "$1 $2")}: </div>
                            <div className="col-md-7  labelval">{aiOutput && aiOutput[k] ? aiOutput[k] :''}</div>
                          </div>)) : null}
                        </div>
                      </div> */}

                        {data.resumeContent && Object.keys(data.resumeContent).length > 0 && Object.keys(data.resumeContent).map((k) => (
                          <div className="flex" key={k}>
                            <div className="col-md-5  label">{k.replace(/([a-z])([A-Z])/g, "$1 $2")}: </div>
                            <div className="col-md-7  labelval">{data.resumeContent[k]}</div>
                          </div>

                        ))}


                      </div>
                      <div className="col-md-5 proctoredVideo">
                       
                        <h3>Proctored Video</h3>
                        {data.streamId ? (
                           <div className="proctoredVideo">
                           <video controls width="100%">
                             <source src={`https://langappnew.s3.amazonaws.com/${data.streamId}`} type="video/mp4" />
                           </video>
                         </div>
                        ):(
                          <button onClick={this.combineChunks}>Generate</button>
                        )}
                       
                      </div>
                    </div>
                    <div className="flex">
                      <div className="col-md-5  label">
                        <button
                          className="btn btn-radius btn-blue btn-icon-right export" onClick={e => this.setState({ showAnswer: !showAnswer })}>
                          See Answer
                        </button>
                      </div>
                    </div>
                    {showAnswer && (
                      <>
                        <div className="flex">
                          <div className="col-md-4  label">
                            Question
                          </div>
                          <div className="col-md-4 label">
                            Correct Answer
                          </div>
                          <div className="col-md-4 label" >
                            Candidate Answer
                          </div>

                        </div>
                        <ol style={{ listStyle: 'decimal', marginLeft: '33px' }}>
                          {answers.map((ans, i) => (
                            <li>
                              <div className="flex" style={{ marginTop: 10 }}>
                                <div className="col-md-4  label" dangerouslySetInnerHTML={{__html:ans.q}}>
                                
                                </div>

                                <div className="col-md-4 label">
                                  {ans.correctAnswer}
                                </div>
                                <div className="col-md-4 label" style={{ color: ans.isAnswerCorrect ? 'green' : 'red' }}>
                                  {ans.selectedAnswer}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}
                  </>
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
