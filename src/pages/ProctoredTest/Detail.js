import moment from "moment";
import React, { Component } from "react";

class ProctoredTestDetail extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;
        this.quizId = props.match.params.quizId;
        this.state = {
            dateLoaded: false,
            cohort: null,
            dateLoaded: false,
            startDate: new Date(moment().subtract(1, "week")),
            endDate: new Date(moment()),
            data: [],
        };
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
        
        global.api.getProctoredTestDetail(this.cohortId, this.quizId)
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        data: data.data,
                        cohort: data.cohort,
                    });
                    // this.setState({ batchData: data });
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });
    }

    score =(data)=>{
        try{
        data =JSON.parse(data);
        const total =data.length;
        let correct =data.filter(item=>item.isAnswerCorrect);
        return total > 0 ? (correct.length/total)*100+'%' :''
        } catch (e){
            return ''
        }
        
    }

    render() {

        const {data,cohort} = this.state;

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
                            <h1 className="title1 mb25">Cohorts: {cohort?.name}</h1>
                            <h4 className="title4 mb40">
                                {
                                    data  && data.length > 0 ? (
                                        <>
                                            
                                            <table className="table" style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Email</th>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Attempts</th>
                                                        <th>Complete</th>
                                                        <th>Score</th>
                                                        <th>Location</th>
                                                        <th>Current Address</th>
                                                        <th>WhatsApp</th>
                                                        <th>College</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data.map((datum) => (
                                                            <tr key={datum.id + "" + datum.quizSetId}>
                                                                <td style={{ wordBreak: "break-all", color:'#408BF9' }}><a href={"/proctored-test/" }>{datum.userId}</a></td>
                                                                <td>{datum?.employee?.FirstName}</td>
                                                                <td>{datum?.employee?.LastName}</td>
                                                                <td>{datum.attemptNumber}</td>
                                                                <td>{datum.attemptStatus ? 'Y':'N'}</td>
                                                                <td>{this.score(datum.answerJSON)}</td>
                                                                <td>{datum?.employee?.Location}</td>
                                                                <td>{datum?.employee?.Location}</td>
                                                                <td>{datum?.employee?.Mobile}</td>
                                                                <td>{datum?.employee?.Location}</td>
                                                                
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

export default ProctoredTestDetail;