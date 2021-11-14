import moment from "moment";
import React, { Component } from "react";

class ProctoredTest extends Component {

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
            data: [],
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }

    componentDidMount() {
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
        global.api.getProctoredTest(global.companyCode)
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        data: data.data,
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

        const {data} = this.state;

        return (
            <main className="offset" id="content">
                <div className="row">
                    <div className="">
                        <h4 className="title4 mb40">
                        Procotored Tests
                        </h4>
                        <br />
                    </div>

                </div>

                <section className="section_box">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="title1 mb25">Cohorts</h1>
                            <h4 className="title4 mb40">
                                {
                                    data  && data.length > 0 ? (
                                        <>
                                            
                                            <table className="table" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '250px' }}>Cohort Name</th>
                                                        <th>Cohort Start Date</th>
                                                        <th>Quiz Topic</th>
                                                        <th>Number of Candidates</th>
                                                        <th>Tests Completed</th>
                                                        <th>Pending Tests</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data.map((datum) => (
                                                            <tr key={datum.id + "" + datum.quizSetId}>
                                                                <td style={{ wordBreak: "break-all", color:'#408BF9' }}><a href={"/proctored-test/"  + datum.id + "/" + datum.quizSetId }>{datum.name}</a></td>
                                                                <td>{datum?.start_date}</td>
                                                                <td>{datum.quizTopic}</td>
                                                                <td>{datum.students}</td>
                                                                <td>{datum.completed}</td>
                                                                <td>{datum.pending}</td>
                                                                
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

export default ProctoredTest;