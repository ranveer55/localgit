import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';

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
                        prevAttempt: data.attempts.find(a => a.id === this.attemptId),
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
                                    prevAttempt && prevAttempt.ai_rating ? (
                                        <div style={{ marginTop: "2rem" }}>
                                            {JSON.stringify(prevAttempt.ai_rating)}
                                            {/* review details */}
                                            {
                                                prevAttempt.ai_rating.reviewJSONArray ? (
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Parameter Name</th>
                                                                <th>Parameter Value</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                prevAttempt.ai_rating.reviewJSONArray.map(data => {
                                                                    return (
                                                                        <tr>
                                                                            <td>{data.parameterName}</td>
                                                                            <td>{data.parameterValue}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                ) : <>No review Json Found</>
                                            }
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: "2rem" }}>
                                            No Ai Rating Found!
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
