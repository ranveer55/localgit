import React, { Component } from "react";
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from "moment";
class ManageQuetions extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;
        this.practiceSetId = props.match.params.practicId;

        this.companyCode = global.companyCode;
        this.newQuestion = {
            practiceSetQuestion: '',
            practiceQuestionText: '',
            referenceAnswer: '',
            video: '',
        }
        this.state = {
            dateLoaded: false,
            cohort: null,
            questions: [],
            availablePracticeSets: [],
            showPracticeSetAddModal: false,
            alreadySelectedPracticeSets: [],
            selectedPracticeSets: [],
            newQuestion: this.newQuestion
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }


    componentDidMount() {
        this.loadData();
        this.loadPracticeSetsQuestions();
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

    addPracticeSetQuestion = () => {
        if (this.state.newQuestion.practiceQuestionId) {
            global.api.updateCompanyPracticeSetQuetion(this.practiceSetId, this.state.newQuestion)
                .then(
                    data => {
                        const dt = this.state.questions.map(item => item.practiceQuestionId == this.state.newQuestion.practiceQuestionId ? data.practiceQuestion : item);

                        this.setState({
                            addPracticeSetAddModal: false,
                            questions: dt,
                        });
                    })
                .catch(err => {
                    this.setState({
                        dateLoaded: true
                    });
                });
        } else {
            global.api.addCompanyPracticeSetQuetion(this.practiceSetId, this.state.newQuestion)
                .then(
                    data => {
                        const dt = this.state.questions;
                        dt.push(data.practiceQuestion)
                        this.setState({
                            addPracticeSetAddModal: false,
                            questions: dt,
                        });
                    })
                .catch(err => {
                    this.setState({
                        dateLoaded: true
                    });
                });
        }

    }

    onChange = (e) => {
        let { newQuestion } = this.state;
        this.setState({
            newQuestion: {
                ...newQuestion,
                [e.target.name]: e.target.value
            }
        })
    }
    onChangeFile = (e) => {
        const { files } = e.target
        if (files && files[0]) {
            var reader = new FileReader();

            reader.onload = () => {
                const { newQuestion } = this.state;
                this.setState({ newQuestion: { ...newQuestion, video: reader.result } })
                console.log(reader.result);
            }

            reader.readAsBinaryString(files[0]);
        }
    }

    Edit = (e, row) => {
        e.preventDefault();
        this.setState({ newQuestion: row, addPracticeSetAddModal: true })
    }
    Remove = (e, row) => {
        e.preventDefault();
        global.api.deleteCompanyPracticeSetQuetion(this.practiceSetId, row.practiceQuestionId)
            .then(
                data => {
                    const dt = this.state.questions.filter(item => item.practiceQuestionId !== row.practiceQuestionId);

                    this.setState({
                        addPracticeSetAddModal: false,
                        questions: dt,
                    });
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });

    }
    Assign = (e, row) => {
        e.preventDefault();
        // this.setState({newQuestion: row})
    }


    // get cohort practice sets
    loadPracticeSetsQuestions() {
        this.setState({ dataLoaded: false })
        global.api.getCohortPracticeSetsQuestions(this.practiceSetId)
            .then(data => {
                this.setState({
                    questions: data.practiceQuestions,
                    dataLoaded: true
                });
            });
    }

    // get all the available practice sets, available
    getAllPracticeSets() {
        global.api.getAllPracticeSets()
            .then(data => {
                this.setState({
                    availablePracticeSets: data.questions
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
    formatter = (cell, row) => {
        console.log(this);
        return (
            <div className="interview-simulator-dropdown-holder">
                <span className="interview-simulator-dropdown">⋮</span>
                <div className="interview-simulator-dropdown-content">
                    <Link
                        to="#"
                        onClick={e => this.Remove(e, row)}
                        className="interview-simulator-dropdown-link"
                        style={{
                            color: "blue",
                            cursor: "pointer"
                        }}
                    >Remove Question
                    </Link>
                    <Link
                        to="#"
                        onClick={e => this.Edit(e, row)}
                        className="interview-simulator-dropdown-link"
                        style={{
                            color: "blue",
                            cursor: "pointer"
                        }}>Edit Question
                    </Link>
                    <Link
                        to="#"
                        onClick={e => this.Assign(e, row)}
                        className="interview-simulator-dropdown-link"
                        style={{
                            color: "blue",
                            cursor: "pointer"
                        }}>Assign to Practice Set
                    </Link>


                </div>
            </div>


        );
    }

    render() {
        const { newQuestion, cohort, selectedCompanyName } = this.state;

        const columns = [
            {
                dataField: 'practiceQuestionId',
                text: 'Question Id',
                width: '20px'
            },
            {
                dataField: 'video',
                text: 'Video'
            },
            {
                dataField: 'practiceSetQuestion',
                text: 'Question'
            },
            {
                dataField: 'practiceQuestionText',
                text: 'Hints'
            },
            {
                dataField: 'referenceAnswer',
                text: 'Reference Answer'
            },

            {
                dataField: 'created_at',
                text: 'Date Created',
                formatter: () => moment().format('DD/MM/YYYY').toString(),
            },
            {
                dataField: 'created_at',
                text: 'Action',
                formatter: this.formatter,
            },


        ];
        if (!cohort) {
            return (

                <main className="offset" id="content">
                    <section className="section_box">
                        Loading...
                    </section>
                </main>
            )
        }

        return (
            <main className="offset" id="content">
                <section className="section_box">
                    <div className="row">
                        <div className="col-md-6">
                            <h1 className="title1 mb25">Manage Questions</h1>
                            <h4 className="title4 mb40">
                                For {selectedCompanyName}
                            </h4>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        Practice Set Questions:
                        <span onClick={e => {
                            this.setState({
                                addPracticeSetAddModal: true
                            });
                        }} className="link" style={{ marginLeft: "1rem", fontSize: "16px" }}>Add Practice Set Question</span>


                    </div>
                    <div>


                        {this.state.questions.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>No Questions added yet!</td>
                            </tr>
                        ) : (
                            <BootstrapTable
                                keyField='id'
                                data={this.state.questions}
                                columns={columns}
                            />
                        )}

                    </div>

                    {
                        this.state.addPracticeSetAddModal ? (
                            <div className="add-practice-set-modal">
                                <div className="add-practice-set-modal-body">

                                    <h2 style={{ padding: 10 }}>Practice Set</h2>
                                    <h6 style={{ padding: 10 }}>Add or Edit Practice Question</h6>
                                    <div style={{ margin: "1rem 0", fontSize: "23px" }}>
                                        <div className="row" style={{ padding: 10 }}>
                                            <div className="col-md-5">Practice Question</div>
                                            <div className="col-md-7">
                                                <input value={newQuestion.practiceSetQuestion} style={{ border: '1px solid', padding: 10, borderRadius: 5 }} name="practiceSetQuestion" placeholder="Practice Question" onChange={this.onChange} />

                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: 10 }}>
                                            <div className="col-md-5">Hints</div>
                                            <div className="col-md-7">
                                                <input value={newQuestion.practiceQuestionText} name="practiceQuestionText" style={{ border: '1px solid', padding: 10, borderRadius: 5 }} placeholder="Hints" onChange={this.onChange} />

                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: 10 }}>
                                            <div className="col-md-5">Reference Answer</div>
                                            <div className="col-md-7">
                                                <input name="referenceAnswer" value={newQuestion.referenceAnswer} style={{ border: '1px solid', padding: 10, borderRadius: 5 }} placeholder="Reference Answer" onChange={this.onChange} />

                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: 10 }}>
                                            <div className="col-md-5">Video</div>
                                            <div className="col-md-7">
                                                <input name="video" type="file" onChange={this.onChangeFile} accept=".mp4" />

                                            </div>
                                        </div>

                                    </div>


                                    <div style={{ display: 'flex' }}>
                                        <div disabled={!this.state.newPracticeName} style={{ backgroundColor: '#4AB93C' }} className="add-practice-set-modal-button" onClick={this.addPracticeSetQuestion}>Save</div>
                                        <div className="add-practice-set-modal-button" onClick={e => {
                                            this.setState({
                                                addPracticeSetAddModal: false,
                                                newQuestion: this.newQuestion
                                            });
                                        }}>Cancel</div>
                                    </div>
                                </div>
                            </div>
                        ) : <></>
                    }
                </section >
            </main >
        );
    }
}

export default ManageQuetions;
