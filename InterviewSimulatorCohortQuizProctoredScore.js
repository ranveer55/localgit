import moment from "moment";
import React, { Component } from "react";

class InterviewSimulatorCohortQuizProctoredScore extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohort: null,
            dateLoaded: false,
            startDate: new Date(moment().subtract(1, "week")),
            endDate: new Date(moment()),
            users: [],
            dataSets: null,
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }

    componentDidMount() {
        // getCompanyRegistrationReport 
        this.loadData(this.state.startDate, this.state.endDate);


    }
    downloadCSV(data) {

        //define the heading for each row of the data  
        var csv = ['Email', 'First Name', 'Last Name', 'Questions Answered', 'Attempts', 'Asked for Review', 'Reviews Completed', '\n'].join(",");

        //merge the data with CSV  
        data.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = `${this.state.cohort.name}.csv`;
        hiddenElement.click();
    }

    loadData(startDate, endDate) {
        this.setState({
            dateLoaded: false
        });
        global.api.getCompanyCohortUsersQuizProctoredScore(
            this.cohortId
        )
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        cohort: data.program,
                        users: data.users,
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
                        <h4 className="title4 mb40">
                            For {this.state?.cohort?.name}
                        </h4>
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
                                                        <th>quizSetId</th>
                                                        <th>Correct</th>
                                                        <th>Incorrect</th>
                                                        <th>percent</th>
                                                        <th>View Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.users.map((user) => (
                                                            <tr key={user.userId + "" + user.quizSetId}>
                                                                <td style={{ wordBreak: "break-all" }}>{user.userId}</td>
                                                                <td>{user?.quiz_set?.quizTopic}</td>
                                                                <td>{user.right}</td>
                                                                <td>{user.wrong}</td>
                                                                <td>{user.percent.toFixed(2)}</td>
                                                                <td><a href={"/interview-simulator/" + this.cohortId + "/quiz-attempt-users/" + user.quizSetId + "/" + user.userId + "/log"}>Show Attempts Log</a></td>
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

export default InterviewSimulatorCohortQuizProctoredScore;