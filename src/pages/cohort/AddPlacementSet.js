import React, { Component } from "react";

class AddPlacementSetToCohortPage extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohort: null,
            practiceSets: [],
            availablePracticeSets: [],
            showPracticeSetAddModal: true
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }

    componentDidMount() {
        // getCompanyRegistrationReport 
        this.loadData();
        this.loadPracticeSets();
        this.getAllPracticeSets();
    }

    loadData() {
        this.setState({
            dateLoaded: false
        });
        global.api.getCohortDetail(
            this.cohortId
        )
            .then(
                data => {
                    this.setState({
                        dataLoaded: true,
                        cohort: data,
                    });
                    // this.setState({ batchData: data });
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });
    }

    loadPracticeSets() {
        global.api.getCohortPlacementSets(this.cohortId)
            .then(data => {
                this.setState({
                    practiceSets: data.cohortPracticeSets
                });
            });
    }

    getAllPracticeSets() {
        console.log("reddd")
        global.api.getAllPracticeSets()
            .then(data => {
                this.setState({
                    availablePracticeSets: data.practiceSets
                });
            });
    }



    render() {

        if (!this.state.cohort) {
            return (

                <main className="offset" id="content">
                    <section className="section_box">
                        Loading...
                    </section>
                </main>
            )
        }

        const alreadySelectedPracticeSets = this.state.practiceSets.map(e => e.practiceSetId);
        const remainingPracticeSets = this.state.availablePracticeSets.filter(e => !alreadySelectedPracticeSets.includes(e.practiceSetId));

        return (
            <main className="offset" id="content">
                <section className="section_box">
                    <div className="row">
                        <div className="col-md-6">
                            <h1 className="title1 mb25">Cohort Detail</h1>
                            <h4 className="title4 mb40">
                                For {this.state.selectedCompanyName}
                            </h4>
                            <a href={`https://api2.taplingua.com/app/user-cohort-registration/${this.cohortId}`} target="_blank" rel="noopener noreferrer">Open Registration Form</a>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        Cohort Name: {this.state.cohort.cohort_name} <span onClick={e => {
                            this.setState({
                                showPracticeSetAddModal: true
                            });
                        }} className="link" style={{ marginLeft: "1rem", fontSize: "16px" }}>Add Practice Set</span>
                    </div>
                    <div>
                        <table style={{ width: "100%" }}>
                            <thead style={{ textAlign: "left" }}>
                                <tr>
                                    <th>Practice Set Id</th>
                                    <th>Practice Set Name</th>
                                    <th># of Questions</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                        this.state.practiceSets.map(practiceSet => (
                                            <tr key={practiceSet.practiceSetId}>
                                                <td>{practiceSet.practiceSetId}</td>
                                                <td>{practiceSet.practiceSetName}</td>
                                                <td>{practiceSet.questionCount}</td>
                                                <td>
                                                    <span className="remove-practice-set">Remove</span>
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {
                        this.state.showPracticeSetAddModal ? (
                            <div className="add-practice-set-modal">
                                <div className="add-practice-set-modal-body">
                                    <h2>Add Practice Set to Cohort</h2>
                                    <div style={{ margin: "1rem 0", fontSize: "23px" }}><b>Cohort Name:</b> {this.state.cohort.cohort_name}</div>
                                    {/* show practice set choices */}
                                    {
                                        remainingPracticeSets.length === 0 ? "No practice set available to display!" : remainingPracticeSets
                                            .map(e => (
                                                <div key={e.practiceSetId} className="practice-set-choice">
                                                    <span className={"practice-set-choice-selector " + (
                                                        alreadySelectedPracticeSets.includes(e.practiceSetId) ? "selected" : ""
                                                    )}></span>
                                                    {e.practiceSetName}
                                                </div>
                                            ))
                                    }
                                    {/* buttons */}
                                    <div className="add-practice-set-modal-button-holder">
                                        <div className="add-practice-set-modal-button green">Add</div>
                                        <div className="add-practice-set-modal-button" onClick={e => {
                                            this.setState({
                                                showPracticeSetAddModal: false
                                            });
                                        }}>Cancel</div>
                                    </div>
                                </div>
                            </div>
                        ) : <></>
                    }
                </section>
            </main>
        );
    }
}

export default AddPlacementSetToCohortPage;
