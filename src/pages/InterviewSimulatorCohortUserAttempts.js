import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';

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
                        prevAttempts: data.attempts,
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
        const prevAttempts = this.state.prevAttempts;

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
                                    prevAttempts.length > 0 ? (
                                        <table className="table" style={{ width: '100%', marginTop: "2rem" }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "56px" }}>S No</th>
                                                    <th>Video</th>
                                                    <th>Lesson Name</th>
                                                    <th>AI Review</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    prevAttempts.map((prevAttempt, index) => (
                                                        <tr key={prevAttempt.uuid ? prevAttempt.uuid : prevAttempt.id} style={{ cursor: "pointer" }} onClick={e => {
                                                            window.location.href = `/interview-simulator/${this.cohortId}/user-attempts/${this.userId}/${prevAttempt.id}`;
                                                        }}>
                                                            <td>{index + 1}</td>
                                                            <td style={{ wordBreak: "break-all" }}>
                                                                {
                                                                    prevAttempt.filePath ? (
                                                                        <video src={"https://langappnew.s3.amazonaws.com/uploads/" + prevAttempt.filePath} width="320px" />
                                                                    ) : <div style={{ height: "100%" }}>Video Not Available</div>
                                                                }
                                                            </td>
                                                            <td>{prevAttempt.lessonName}</td>
                                                            <td>
                                                                <a href={`/interview-simulator/${this.cohortId}/user-attempts/${this.userId}/${prevAttempt.id}`}>{getAiRatingMedal(prevAttempt.ai_rating_avg)}</a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    ) : <>No Data</>
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

export default InterviewSimulatorCohortUserAttempsPage;