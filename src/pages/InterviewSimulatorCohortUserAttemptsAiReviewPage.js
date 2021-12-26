import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Mp3Player from './Mp3Player'
class InterviewSimulatorCohortUserAttempsAiReviewPage extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;
        this.userId = props.match.params.userId;
        this.attemptId = props.match.params.attemptId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            userDataLoaded: false,
            cohort: null,
            userData: null,
            prevAttempt: null,
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
            dateLoaded: false
        });
        global.api.getCompanyCohortSingle(
            this.cohortId
        )
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        cohort: data.program,
                    });
                    // this.setState({ batchData: data });
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });
        global.api.getCompanyCohortUserAttempts(
            this.userId
        )
            .then(
                data => {
                    this.setState({
                        userDataLoaded: true,
                        userData: data.user,
                        prevAttempt: data.attempts.find(a => a.id == this.attemptId),
                    });
                    // this.setState({ batchData: data });
                })
            .catch(err => {
                this.setState({
                    userDataLoaded: true
                });
            });
    }



    render() {

        const cohort = this.state.cohort;
        const userData = this.state.userData;
        const prevAttempt = this.state.prevAttempt;
        const external_rating = prevAttempt && prevAttempt.external_rating
        return (
            <main className="offset InterciewSimulationUserAttempts" id="content">
                <section className="section_box">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="title1 mb25">Company Cohorts</h1>
                            <h4 className="title4 mb40">
                                {
                                    userData ? (
                                        <div>
                                            <div style={{ margin: "16px 0" }}><b>Email:</b> {userData.userId}</div>
                                            <div style={{ margin: "16px 0" }}><b>First Name:</b> {userData.FirstName} <b>Last Name:</b> {userData.LastName}</div>
                                        </div>
                                    ) : <></>
                                }
                                {
                                    cohort ? (
                                        <>
                                            <div><b>Cohort:</b> {this.state.cohort.name}</div>
                                        </>
                                    ) : <></>
                                }
                                {
                                    prevAttempt ? (
                                        <div className="row" style={{ marginTop: "2rem" }}>
                                            <div className="col-md-12" style={{ margin: "1rem 0" }}>
                                                <h2>Question: {prevAttempt.lessonName}</h2>
                                            </div>
                                            <div className="col-md-6">
                                                <div>
                                                <h3>Recorded Video</h3>
                                                {/* video */}
                                                {
                                                    prevAttempt.filePath ? (
                                                        <>
                                                            <video controls width="480px">
                                                                <source src={"https://langappnew.s3.amazonaws.com/uploads/" + prevAttempt.filePath} type="video/webm" />
                                                            </video>
                                                            <a href={"https://langappnew.s3.amazonaws.com/uploads/" + prevAttempt.filePath} style={{marginTop: "10px"}} download>Download</a>
                                                        </>
                                                    ) : <div style={{ height: "100%" }}>Video Not Available</div>
                                                }
                                                </div>
                                                <div>
                                                {external_rating.map((item) => 
                                                        <Mp3Player key={item.id} url={item.audio} name={item.reviewerName}/>
                                                    
                                                )}
                                                </div>
                                               
                                            </div>
                                            {
                                                prevAttempt.ai_rating ? (
                                                    <div className="col-md-6">
                                                        <h3>AI Rating</h3>
                                                        {/* review details */}
                                                        {
                                                            prevAttempt.ai_rating.reviewJSONArray ? (
                                                                <table className="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Parameter</th>
                                                                            <th>Rating [0-5]</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            prevAttempt.ai_rating.reviewJSONArray.map(data => {
                                                                                return (
                                                                                    <tr key={data.parameterName}>
                                                                                        <td>{data.parameterName}</td>
                                                                                        <td>{data.parameterValue}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            ) : <>No Parameters available</>
                                                        }
                                                    </div>
                                                ) : (
                                                    <div style={{ marginTop: "2rem" }}>
                                                        No Ai Rating Found!
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: "2rem" }}>
                                            No Data Found!
                                        </div>
                                    )
                                }
                            </h4>
                        </div>
                    </div>
                    <div>
                    </div>
                </section>
            </main>
        );
    }
}


const getAiRatingMedal = (reviewAverage = 1, attempt = null) => {

    if (reviewAverage > 4) {
        return (
            <img src="https://app.taplingua.com/_assets/badge_icons/gold.png" alt="" width="48px" className="m-auto" />
        );
    }

    if (reviewAverage > 3) {
        return (
            <img src="https://app.taplingua.com/_assets/badge_icons/silver.png" alt="" width="48px" className="m-auto" />
        );
    }

    if (reviewAverage > 2) {
        return (
            <img src="https://app.taplingua.com/_assets/badge_icons/bronze.png" alt="" width="48px" className="m-auto" />
        );
    }

    return (
        <img src="https://app.taplingua.com/_assets/badge_icons/basic.png" alt="" width="48px" className="m-auto" />
    );
}

export default InterviewSimulatorCohortUserAttempsAiReviewPage;
