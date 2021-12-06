import React, { Component } from "react";
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from "moment";
import RTEditor from './RTEditor'
import AnswerOptions from './AnswerOptions'

class ManageQuizSetQuetions extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.cohortId = props.match.params.cohortId;
        this.Id = props.match.params.quizSetId;

        this.companyCode = global.companyCode;
        this.newQuestion = {
            questionType: 2,
            quizSubTopic: 0,
            questionText: '',
            optionChoices: '',
            difficultyLevel: 1,
            quizSetId: ''
        }
        this.state = {
            data: null,
            dateLoaded: false,
            newQuestion: this.newQuestion
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }


    componentDidMount() {
        this.loadQuizSetsQuestions();
    }
    loadQuizSetsQuestions() {
        this.setState({ dataLoaded: false })
        global.api.getCohortQuizSet(this.Id)
            .then(data => {
                this.setState({
                    data: data,
                    dataLoaded: true,
                    addQuizSetAddModal: false
                });
            });
    }



    addQuestion = () => {
        const datum = this.state.newQuestion;
        datum.quizSetId = this.state.data.quizSetId;
        global.api.addQuizSetQuetion(datum)
            .then(
                data => {
                    this.loadQuizSetsQuestions()
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true,
                });
            });
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
    onChangeEditor = (e) => {
        let { newQuestion } = this.state;
        this.setState({
            newQuestion: {
                ...newQuestion,
                questionText: e
            }
        })
    }
    onChangeOptions = (ops) => {
        let { newQuestion } = this.state;
        this.setState({
            newQuestion: {
                ...newQuestion,
                optionChoices: ops
            }
        })
    }


    Edit = (e, row) => {
        e.preventDefault();
        this.setState({ newQuestion: row, addQuizSetAddModal: true })
    }
    Remove = (e, id) => {
        e.preventDefault();
        global.api.deleteQuizSetQuetion(id)
            .then(
                data => this.loadQuizSetsQuestions()
            )
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });

    }

    render() {
        const { newQuestion, data } = this.state;
        const inputClass = { width: '100%', border: '1px solid', padding: 10, borderRadius: 5, margin: '5px 0' }

        const columns = [


            {
                dataField: 'quizSetQuestionId',
                text: 'Question Id',
            },
            {
                dataField: 'questionText',
                text: 'Question',
                formatter: (d) => <div>{d.substr(0, 40).replace(/<[^>]*>?/gm, '').replace('&nbsp;', '')}</div>
            },
            {
                dataField: 'questionType',
                text: 'Question Type',
            },
            {
                dataField: 'quizSubTopic',
                text: 'Quiz Sub Topic',
            },
            {
                dataField: 'difficultyLevel',
                text: 'difficulty Level',
            },

            {
                dataField: 'id',
                text: 'Remove',
                formatter: (id) => <Link
                    to="#"
                    onClick={e => this.Remove(e, id)}
                    style={{
                        color: "blue",
                        cursor: "pointer"
                    }}
                >Remove Question
                </Link>
            },
            {
                dataField: 'id',
                text: 'Edit',
                formatter: (id, row) => <Link
                    to="#"
                    onClick={e => this.Edit(e, row)}
                    style={{
                        color: "blue",
                        cursor: "pointer"
                    }}>Edit Question
                </Link>
            },


        ];
        if (!data) {
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
                            <h1 className="title1 mb25">Manage Quiz Questions</h1>
                            <h4 className="title4 mb40">
                                Assigned to Quiz Set ({data ? data.quizTopic : ''})
                            </h4>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        Quiz Set Questions:
                        <span onClick={e => {
                            this.setState({
                                addQuizSetAddModal: true
                            });
                        }} className="link" style={{ marginLeft: "1rem", fontSize: "16px" }}>Add Quiz Set Question</span>


                    </div>
                    <div>


                        {data.questions.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>No Questions added yet!</td>
                            </tr>
                        ) : (
                            <BootstrapTable
                                keyField='id'
                                data={data.questions}
                                columns={columns}
                            />
                        )}

                    </div>

                    {
                        this.state.addQuizSetAddModal ? (
                            <div className="add-practice-set-modal">
                                <div className="add-practice-set-modal-body" style={{ width: '90%', height:'80%', overflow: 'auto', margin: "0", fontSize: "16px" }}>
                                    <h2>Quiz Set Question</h2>
                                    <div>
                                        <div className="card">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div style={{ alignContent: 'center', paddingTop: '30px' }}>
                                                    <h3>Quiz Question</h3>
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <RTEditor data={newQuestion.questionText} onChange={this.onChangeEditor} />
                                            </div>
                                        </div>
                                        </div>
                                        <div className="card">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div style={{ alignContent: 'center' }}>
                                                    <h3>Quiz Answers Options</h3>
                                                    <p>Add the <b> correct answer as the first choice (Option 1).</b> </p>
                                                    <p>The choices will be randomly shuffled during display.    </p>
                                                </div>
                                                </div>

                                                <div className="col-md-7">
                                                    <AnswerOptions data={newQuestion.optionChoices} inputClass={inputClass} callbacks={this.onChangeOptions} />
                                                </div>
                                           
                                        </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-5">

                                            <div>Difficulty Level<input type="number" style={inputClass} name="difficultyLevel" value={newQuestion.difficultyLevel} placeholder="Difficulty Level" onChange={this.onChange} /></div>
                                            <div>Quiz Sub Topic<input type="number" min="0" style={inputClass} name="quizSubTopic" value={newQuestion.quizSubTopic} placeholder="Quiz Sub Topic" onChange={this.onChange} /></div>

                                            <div>Question Type<input type="number" min="1" max="2" style={inputClass} name="questionType" value={newQuestion.questionType} placeholder="Question Type" onChange={this.onChange} /></div>
                                        </div> */}
                                     <div className="card">
                                    <div style={{ display: 'flex' }}>
                                        <div disabled={!this.state.valid} style={{ backgroundColor: '#4AB93C' }} className="add-practice-set-modal-button" onClick={this.addQuestion}>Save</div>
                                        <div className="add-practice-set-modal-button" onClick={e => {
                                            this.setState({
                                                addQuizSetAddModal: false
                                            });
                                        }}>Cancel</div>
                                    </div>
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

export default ManageQuizSetQuetions;
