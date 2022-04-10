import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import ReactDatePicker from "react-datepicker";

export const interviewSimulatorCohortQuizAttemptUsersLogRoute = "/interview-simulator/:cohortId/quiz-attempt-users/:quizSetId/:userId/log";

// function to create route
export const createInterviewSimulatorCohortQuizAttemptUsersLogRoute = (cohortId, quizSetId, userId) => `/interview-simulator/${cohortId}/quiz-attempt-users/${quizSetId}/${userId}/log`;

class InterviewSimulatorCohortQuizAttemptUsersLogPage extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;
        this.userId = props.match.params.userId;
        this.quizSetId = props.match.params.quizSetId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohort: null,
            dateLoaded: false,
            user: null,
            attempts: [],
            dataSets: null,
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
        global.api.getCompanyCohortUserLogWhoAttemptedQuiz(
            this.cohortId,
            this.quizSetId,
            this.userId
        )
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        cohort: data.program,
                        user: data.employee,
                        attempts: data.attempts,
                    });
                    // this.setState({ batchData: data });
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });
    }



    render() {

        const cohort = this.state.cohort;


        return (
            <main className="offset" id="content">
                <div className="row">
                    <div className="">
                        {this.state.attempts.length > 0 ? (
                            <h4 className="title4 mb40">
                                For {this.state.attempts[0].quizTopic}
                            </h4>
                        ) : <></>}
                        <br />
                    </div>

                </div>

                <section className="section_box">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="title1 mb25">Company Cohorts</h1>
                            <h4 className="title4 mb40">
                                {
                                    cohort ? (
                                        <>
                                            <div><b>Cohort:</b> {this.state.cohort.name}</div>
                                            <table className="table" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '250px' }}>Email</th>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Easy Percentage</th>
                                                        <th>Difficult Percentage</th>
                                                        <th>Hard Percentage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.attempts.map((attempt) => (
                                                            <tr>
                                                                <td style={{ wordBreak: "break-all" }}>{this.state.user.userId}</td>
                                                                <td>{this.state.user.FirstName}</td>
                                                                <td>{this.state.user.LastName}</td>
                                                                <td>{attempt.easyPercentage}%</td>
                                                                <td>{attempt.mediumPercentage}%</td>
                                                                <td>{attempt.difficultPercentage}%</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </>
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

export default InterviewSimulatorCohortQuizAttemptUsersLogPage;