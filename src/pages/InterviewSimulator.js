import moment from "moment";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
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

    formatter = (cell, row) => {
        return (
            <div className="interview-simulator-dropdown-holder">
                <span className="interview-simulator-dropdown">⋮</span>
                <div className="interview-simulator-dropdown-content">
                    <Link
                        to={"/interview-simulator/" + row.id + "/add-practice-set"}
                        className="interview-simulator-dropdown-link"
                        style={{
                            color: "blue",
                            cursor: "pointer"
                        }}>Manage Practice Sets</Link>
                </div>
            </div>);
    }

    render() {
        const columns = [
            
            {
                dataField: 'practiceSetQuestion',
                text: 'Name',
                formatter: (e, row) => <a target="_blank" rel="noopener noreferrer" href={"/cohort-detail/" + row.id}>{row.name}</a>
            },
            

            {
                dataField: 'created_at',
                text: 'Date Created',
                formatter: (created_at) => moment(created_at).format('DD/MM/YYYY').toString(),
            },
            {
                dataField: 'id',
                text: 'Users',
                formatter: (id, row) => <td
                    style={{
                        color: "blue",
                        cursor: "pointer"
                    }}>
                    <Link
                        to={"/interview-simulator/" + row.id}
                        style={{
                            color: "blue",
                            cursor: "pointer"
                        }}>{row.users.length} User(s)</Link>
                </td>,
            },
            // {
            //     dataField: 'created_at',
            //     text: 'Date Created',
            //     formatter: (created_at) =>'',
            // },
            {
                dataField: 'id',
                text: 'Action',
                formatter: this.formatter,
            },


        ];

        return (
            <main className="offset" id="content">
                <section className="section_box">
                    <div className="row">
                        <div className="col-md-6">
                            <h1 className="title1 mb25">Manage Interview Simulator Cohorts</h1>
                            <h4 className="title4 mb40">
                                For {this.state.selectedCompanyName !='null' ? this.state.selectedCompanyName:'' }
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

                        {
                            this.state.dataLoaded ?
                                this.state.cohorts.length > 0 ? (
                                    <BootstrapTable
                                        keyField='id'
                                        data={this.state.cohorts.filter(c => !c.is_dynamic)}
                                        columns={columns}
                                    />

                                ) : (<span colSpan="4">No Data Available</span>)
                                : (<span colSpan="4">Loading Data </span>)
                        }
                    </div>
                </section>
            </main>
        );
    }
}

export default InterviewSimulatorPage;
