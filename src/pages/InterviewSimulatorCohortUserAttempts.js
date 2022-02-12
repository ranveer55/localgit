import moment from "moment";
import React, { Component } from "react";
import { Row, Button, Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { ReactComponent as Star } from "./start_icon.svg";
import { InterviewSimulatorReviewModal } from "./InterviewSimulatorReviewModal";
// import "bootstrap/dist/css/bootstrap.min.css";
import { CDN_URL } from "../constant";
class InterviewSimulatorCohortUserAttempsPage extends Component {
  constructor(props) {
    super(props);

    this.cohortId = props.match.params.cohortId;
    this.userId = props.match.params.userId;

    this.companyCode = global.companyCode;

    this.state = {
      dateLoaded: false,
      userDataLoaded: false,
      cohort: null,
      userData: null,
      prevAttempts: [],
      reviewModal: false,
      reviewIsExternal: true,
      loading: false,
      alertMsg: undefined,
      seqNo:''
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;
  }

  componentDidMount() {
    // getCompanyRegistrationReport
    this.loadData();
  }

  loadData() {
    this.setState({
      dateLoaded: false,
    });
    global.api
      .getCompanyCohortSingle(this.cohortId)
      .then((data) => {
        this.setState({
          dataLoaded: true,
          cohort: data.program,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
    global.api
      .getCompanyCohortUserAttempts(this.userId)
      .then((data) => {
        this.setState({
          userDataLoaded: true,
          userData: data.user,
          prevAttempts: data.attempts,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          userDataLoaded: true,
        });
      });
  }

  handleCloseReview = () => {
    this.setState({
      reviewModal: false,
    });
  };

  handleExternalReview = (val) => {
    this.setState({
      reviewIsExternal: val,
    });
  };
  getVPIScore = (datum) => {
    if(datum.vpi_score){
      this.setState({
        loading: false,
        alertMsg: datum.vpi_score,
        showAlert: true
      });
      return;
    }
    this.setState({
      loading: true,
      alertMsg: undefined,
      showAlert: true
    });
    global.api
      .getVPIScore(datum.id)
      .then((data) => {
        this.setState({
          loading: false,
          alertMsg: data && data.data ? data.data : null
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          loading: true,
        });
      });
  }

  closeAlert = () => {
    this.setState({ showAlert: false, alertMsg: undefined })
  }

  render() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const cohort = this.state.cohort;
    const userData = this.state.userData;
    const prevAttempts = this.state.prevAttempts;
    const { loading, alertMsg, showAlert } = this.state;
    return (
      <>

        {!this.state.reviewModal && (
          <main className="offset InterciewSimulationUserAttempts" id="content">
            <section className="section_box">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="title1 mb25">Company Cohorts</h1>
                  <h4 className="title4 mb40">
                    {userData ? (
                      <div>
                        <div style={{ margin: "16px 0" }}>
                          <b>Email:</b> {userData.userId}
                        </div>
                        <div style={{ margin: "16px 0" }}>
                          <b>First Name:</b> {userData.FirstName}{" "}
                          <b>Last Name:</b> {userData.LastName}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {cohort ? (
                      <>
                        <div>
                          <b>Cohort:</b> {this.state.cohort.name}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    {prevAttempts.length > 0 ? (
                      <table
                        className="table"
                        style={{ width: "100%", marginTop: "2rem" }}
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "56px" }}>S No</th>
                            <th>Video</th>
                            <th>Lesson Name</th>
                            <th>Date</th>
                            <th>AI Review</th>
                            <th>VPI Review</th>
                            <th>Mentor Review</th>
                            <th>User Answer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prevAttempts.map((prevAttempt, index) =>{
                            let vpi_score = prevAttempt?.vpi_score;
                            return(
                            <tr
                              key={
                                prevAttempt.uuid
                                  ? prevAttempt.uuid
                                  : prevAttempt.id
                              }
                              style={{ cursor: "pointer" }}
                            // onClick={e => { window.location.href = `/interview-simulator/${this.cohortId}/user-attempts/${this.userId}/${prevAttempt.id}`; }}
                            >
                              <td>{index + 1}</td>
                              <td style={{ wordBreak: "break-all" }}>
                                {prevAttempt.filePath ? (
                                  <video
                                    controls
                                    height="170"
                                    width="170"
                                    src={
                                       CDN_URL +"/uploads/" +
                                      prevAttempt.filePath
                                    }
                                  ></video>
                                ) : (
                                  <div style={{ height: "100%" }}>
                                    Video Not Available
                                  </div>
                                )}
                              </td>
                              <td>{prevAttempt.lessonName}</td>
                              <td>
                                {moment(prevAttempt.created_at).format(
                                  "MMM DD YYYY"
                                )}
                              </td>

                              <td>
                                <a
                                  href={`/interview-simulator/${this.cohortId}/user-attempts/${this.userId}/${prevAttempt.id}`}
                                >
                                  {getAiRatingMedal(prevAttempt.ai_rating_avg)}
                                </a>
                              </td>
                              <td>
                              {vpi_score != null ? 
                                <span className={`scoreColor ${vpi_score != null ?
                                  parseFloat(vpi_score?.fluency_score) > 75 ? 'green' : 
                                  parseFloat(vpi_score?.fluency_score) < 75 &&
                                   parseFloat(vpi_score?.fluency_score) > 60 ? 'yellow' :
                                   parseFloat(vpi_score?.fluency_score) < 60 ? 'red': '' : ''
                                 }`}>{'VPI Score :' + parseFloat(vpi_score?.fluency_score).toFixed(2)}</span>
                               :
                                <button onClick={() => this.getVPIScore(prevAttempt)}>get</button>
                              }
                              </td>
                              <td
                                className="testClick"
                                onClick={() => {
                                  this.setState({
                                    currentAttempt: prevAttempt,
                                    reviewModal: true,
                                    seqNo:index + 1
                                  });
                                }}
                              >
                                {prevAttempt.external_rating_avg ? (
                                  <div
                                    className={
                                      prevAttempt.external_rating_avg
                                        ? prevAttempt.external_rating_avg <= 2
                                          ? "review-red cursor-pointer"
                                          : prevAttempt.external_rating_avg <= 3
                                            ? "review-yellow cursor-pointer"
                                            : "review-green cursor-pointer"
                                        : "ai-review NA cursor-pointer"
                                    }
                                  >
                                    <div
                                      className="starReview"
                                    //   style={{
                                    //     paddingTop: "7px",
                                    //     marginRight: 6,
                                    //   }}
                                    >
                                      {prevAttempt.external_rating_avg ? (
                                        <Star />
                                      ) : (
                                        <div className="circle cursor-pointer"></div>
                                      )}
                                    </div>
                                    <div className="ml-2 ratingText">
                                      {prevAttempt.external_rating_avg === null
                                        ? "NA"
                                        : prevAttempt.external_rating_avg.toFixed(
                                          2
                                        )}
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      fontWeight: "lighter",
                                      color: "#1A43F0",
                                      cursor: "pointer",
                                      textAlign: "left",
                                    }}
                                  >
                                    No Review
                                  </div>
                                )}
                              </td>
                              <td
                                dangerouslySetInnerHTML={{
                                  __html:
                                    prevAttempt?.student_practice_answers
                                      ?.studentResponse,
                                }}
                              ></td>
                            </tr>
                          )}
                          
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <>No Data</>
                    )}
                  </h4>
                  {showAlert && 
                  <Modal.Dialog onHide={this.closeAlert} style={{
                    position: 'fixed',
                    margin: '10px',
                    top: '30%',
                    left: '30%',
                    width: '600px'
                  }}>
                    <Modal.Header
                    //  closeButton={this.closeAlert}
                      size="lg"
                      backdrop="static"
                      keyboard={false}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Title>{loading ? `Getting...` : 'Candidate '} VPI Score</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      {loading && <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>}
                      {alertMsg && Object.keys(alertMsg).length > 0 ? Object.keys(alertMsg).map((key) =><div>
                        <b>{key}</b> : {alertMsg[key]}
                      </div>): !loading ?  'No record found!' : ''}
                    </Modal.Body>

                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.closeAlert}>Close</Button>
                    </Modal.Footer>
                  </Modal.Dialog>}
                </div>
              </div>
              <div></div>
            </section>
          </main>
        )}
        {this.state.reviewModal && (
          <InterviewSimulatorReviewModal
          sequenceNo={this.state.seqNo}
            handleCloseReview={this.handleCloseReview}
            show={this.state.reviewModal}
            attempt={this.state.currentAttempt}
            mentor={false}
            user={user}
            reviewIsExternal={this.state.reviewIsExternal}
            handleExternalReview={this.handleExternalReview}
          />
        )}
      </>
    );
  }
}

const getAiRatingMedal = (reviewAverage = 1, attempt = null) => {
  if (reviewAverage > 4) {
    return (
      <img
        src="https://app.taplingua.com/_assets/badge_icons/gold.png"
        alt=""
        width="48px"
        className="m-auto"
      />
    );
  }

  if (reviewAverage > 3) {
    return (
      <img
        src="https://app.taplingua.com/_assets/badge_icons/silver.png"
        alt=""
        width="48px"
        className="m-auto"
      />
    );
  }

  if (reviewAverage > 2) {
    return (
      <img
        src="https://app.taplingua.com/_assets/badge_icons/bronze.png"
        alt=""
        width="48px"
        className="m-auto"
      />
    );
  }

  return (
    <img
      src="https://app.taplingua.com/_assets/badge_icons/basic.png"
      alt=""
      width="48px"
      className="m-auto"
    />
  );
};

export default InterviewSimulatorCohortUserAttempsPage;
