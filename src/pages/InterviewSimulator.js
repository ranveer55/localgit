import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';

class InterviewSimulatorPage extends Component {

    constructor(props) {
        super(props);

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohorts: [],
            selectedCohort: false
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
        global.api.getCompanyCohorts(
            this.companyCode
        )
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        cohorts: data.programs,
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


        return (
            <main className="offset" id="content">
                <section className="section_box">
                    <div className="row">
                        <div className="col-md-6">
                            <h1 className="title1 mb25">Interview Simulator</h1>
                            <h4 className="title4 mb40">
                                For {this.state.selectedCompanyName}
                            </h4>
                            <div>
                                <a href={`https://api2.taplingua.com/app/user-cohort-registration-dynamic/${this.state.selectedCompany}`} target="_blank" rel="noopener noreferrer" style={{
                                    margin: "0 4px"
                                }}>Open Dynamic Cohort Registration Form</a>
                                <a href={`/company-cohorts/new`} style={{
                                    margin: "0 4px"
                                }}>Create Cohort</a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <table style={{ width: "100%" }}>
                            <thead style={{ textAlign: "left" }}>
                                <tr>
                                    <th>Company Code</th>
                                    <th>Cohort ID</th>
                                    <th>Name</th>
                                    <th>Registration Link</th>
                                    <th>Start Date</th>
                                    <th>Users</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.dataLoaded ?
                                        this.state.cohorts.length > 0 ?
                                            this.state.cohorts.filter(c => !c.is_dynamic).map(cohort => {
                                                return (
                                                    <tr key={cohort.id}>
                                                        <td>{cohort.company_code}</td>
                                                        <td>{cohort.id}</td>
                                                        <td>
                                                            <a target="_blank" rel="noopener noreferrer" href={"/cohort-detail/" + cohort.id}>{cohort.name}</a>
                                                        </td>
                                                        <td> <a href={`https://api2.taplingua.com/app/user-cohort-registration/${cohort.id}`} target="_blank" rel="noopener noreferrer">Open Registration Form</a></td>
                                                        <td>{moment(cohort.start_date).format("DD-MM-YYYY")}</td>
                                                        <td
                                                            style={{
                                                                color: "blue",
                                                                cursor: "pointer"
                                                            }}>
                                                            <Link
                                                                to={"/interview-simulator/" + cohort.id}
                                                                style={{
                                                                    color: "blue",
                                                                    cursor: "pointer"
                                                                }}>{cohort.users.length} User(s)</Link>
                                                        </td>
                                                        <td className="interview-simulator-dropdown-holder">
                                                            <span className="interview-simulator-dropdown">⋮</span>
                                                            <div className="interview-simulator-dropdown-content">
                                                                <Link
                                                                    to={"/interview-simulator/" + cohort.id + "/add-practice-set"}
                                                                    className="interview-simulator-dropdown-link"
                                                                    style={{
                                                                        color: "blue",
                                                                        cursor: "pointer"
                                                                    }}>Add Practice Sets</Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : (
                                                <tr>
                                                    <td colSpan="4">No Data Available</td>
                                                </tr>
                                            )
                                        : (
                                            <tr>
                                                <td colSpan="4">Loading Data</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        );
    }
}

export default InterviewSimulatorPage;
