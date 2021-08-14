import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';

class InterviewSimulatorCohortPage extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohort: null,
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
    }



    render() {

        const cohort = this.state.cohort;


        return (
            <main className="offset" id="content">
                <section className="section_box">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="title1 mb25">Company Cohorts</h1>
                            <h4 className="title4 mb40">
                                For {this.state.selectedCompanyName}
                                {
                                    cohort ? (
                                        <>
                                            <div><b>Cohort:</b> {this.state.cohort.name}</div>
                                            <table className="table" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Email</th>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Questions Answered</th>
                                                        <th>Attempts</th>
                                                        <th> </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        cohort.users.map((user) => (
                                                            <tr>
                                                                <td style={{ wordBreak: "break-all" }}>{user.userId}</td>
                                                                <td>{user.FirstName}</td>
                                                                <td>{user.LastName}</td>
                                                                <td>{user.distinctAttempts}</td>
                                                                <td>{user.totalAttempts}</td>
                                                                <td><a href="#">Show Activity</a></td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </>
                                    ) : <></>
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

export default InterviewSimulatorCohortPage;
