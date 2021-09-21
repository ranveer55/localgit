import React, { Component } from "react";

class AddPracticeSetToCohortPage extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohort: null,
            practiceSets: [],
            availablePracticeSets: [],
            showPracticeSetAddModal: false,
            alreadySelectedPracticeSets: [],
            selectedPracticeSets: []
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
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });
    }

    // get cohort practice sets
    loadPracticeSets() {
        global.api.getCohortPracticeSets(this.cohortId)
            .then(data => {
                this.setState({
                    practiceSets: data.cohortPracticeSets
                });

                // set already selected practice sets
                this.setState({
                    alreadySelectedPracticeSets: data.cohortPracticeSets.map(e => e.practiceSetId)
                });

            });
    }

    // get all the available practice sets, available
    getAllPracticeSets() {
        global.api.getAllPracticeSets()
            .then(data => {
                this.setState({
                    availablePracticeSets: data.practiceSets
                });
            });
    }

    togglePracticeSetSelection(practiceSetId) {
        // if already there, remove it
        console.log("here", practiceSetId);
        if (this.state.selectedPracticeSets.includes(practiceSetId)) {
            const newState = [...this.state.selectedPracticeSets];
            newState.splice(this.state.selectedPracticeSets.indexOf(practiceSetId), 1);
            this.setState({
                selectedPracticeSets: newState
            });
        } else {
            this.setState({
                selectedPracticeSets: [...this.state.selectedPracticeSets, practiceSetId]
            });
        }
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

        const remainingPracticeSets = this.state.availablePracticeSets.filter(e => !this.state.alreadySelectedPracticeSets.includes(e.practiceSetId));

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
                                    this.state.practiceSets.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{textAlign: "center"}}>No practice sets added yet!</td>
                                        </tr>
                                    ) : <></>
                                }
                                {
                                    this.state.practiceSets.map(practiceSet => (
                                        <tr key={practiceSet.practiceSetId}>
                                            <td>{practiceSet.practiceSetId}</td>
                                            <td>{practiceSet.practiceSetName}</td>
                                            <td>{practiceSet.questionCount}</td>
                                            <td>
                                                <span className="remove-practice-set"
                                                    onClick={e => {
                                                        // remove the practice set
                                                        global.api.removePracticeSetFromCohort(this.cohortId, practiceSet.practiceSetId)
                                                            .then((response) => {
                                                                // remove from practice sets list
                                                                const newState = [...this.state.practiceSets];
                                                                newState.splice(this.state.practiceSets.indexOf(practiceSet.practiceSetId), 1);
                                                                this.setState({
                                                                    practiceSets: newState,
                                                                    alreadySelectedPracticeSets: newState.map(e => e.practiceSetId),
                                                                });
                                                            })
                                                            .catch(err => {
                                                                alert("Something went wrong!");
                                                            })
                                                    }}>Remove</span>
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
                                                <div key={e.practiceSetId} className="practice-set-choice"
                                                    onClick={f => {
                                                        this.togglePracticeSetSelection(e.practiceSetId);
                                                    }}>
                                                    <span className={"practice-set-choice-selector " + (
                                                        this.state.selectedPracticeSets.includes(e.practiceSetId) ? "selected" : ""
                                                    )}></span>
                                                    {e.practiceSetName}
                                                </div>
                                            ))
                                    }
                                    {/* buttons */}
                                    <div className="add-practice-set-modal-button-holder" style={{ margin: "1rem 0" }}>
                                        {
                                            this.state.selectedPracticeSets.length === 0 ? <></> : (
                                                <div className="add-practice-set-modal-button green" onClick={e => {
                                                    if (this.state.selectedPracticeSets.length === 0) {
                                                        return alert("Please select atleast one practice set to add!");
                                                    }
                                                    // save practice sets
                                                    global.api.addPracticeSetsToCohort(this.cohortId, this.state.selectedPracticeSets)
                                                        .then((response) => {
                                                            // now add these to practiceSets
                                                            this.setState({
                                                                practiceSets: [...this.state.practiceSets, ...response.cohortPracticeSets],
                                                                alreadySelectedPracticeSets: [...this.state.practiceSets, ...response.cohortPracticeSets].map(e => e.practiceSetId),
                                                                selectedPracticeSets: [],
                                                                showPracticeSetAddModal: false
                                                            });
                                                        }).catch(err => {
                                                            alert("Something went wrong!");
                                                        });
                                                }}>Add</div>
                                            )
                                        }
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

export default AddPracticeSetToCohortPage;
