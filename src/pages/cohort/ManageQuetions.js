import React, { Component } from "react";
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from "moment";
import RTEditor from './RTEditor'

class ManageQuetions extends Component {

    constructor(props) {
        super(props);
        this.ref =React.createRef();
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
            video: null,
            dateLoaded: false,
            uploading:false,
            cohort: null,
            practicSet: null,
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
        this.getAllPracticeSets(this.practiceSetId);
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
        this.setState({uploading:true})
        let  formData = new FormData();
        const {newQuestion,video} =this.state;
        for(const k of Object.keys(newQuestion)){
            if(k=='video'){
            } else {
                formData.append([k], newQuestion[k]);
             }
        }
        
        if(video && video.value){
            const {value, files}=video;
            formData.append('video', files[0], files[0].name);
        }
        
        if (this.state.newQuestion.practiceQuestionId) {
            global.api.updateCompanyPracticeSetQuetion(this.practiceSetId, formData,this.state.newQuestion.practiceQuestionId)
                .then(
                    data => {
                        const dt = this.state.questions.map(item => item.practiceQuestionId == this.state.newQuestion.practiceQuestionId ? data.practiceQuestion : item);

                        this.setState({
                            addPracticeSetAddModal: false,
                            questions: dt,
                            uploading:false,
                            newQuestion:this.newQuestion, 
                            video: null
                        });
                    })
                .catch(err => {
                    this.setState({
                        dateLoaded: true,
                        uploading:false,
                    });
                });
        } else {
            global.api.addCompanyPracticeSetQuetion(this.practiceSetId, formData)
                .then(
                    data => {
                        const dt = this.state.questions;
                        dt.push(data.practiceQuestion)
                        this.setState({
                            addPracticeSetAddModal: false,
                            questions: dt,
                            uploading:false,
                            newQuestion:this.newQuestion,
                            video: null
                        });
                    })
                .catch(err => {
                    this.setState({
                        dateLoaded: true,
                        uploading:false,
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
    onChangeEditor = (e) => {
        console.log({e});
        let { newQuestion } = this.state;
        this.setState({
            newQuestion: {
                ...newQuestion,
                practiceSetQuestion: e
            }
        })
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
    onChangeFile =(e) =>{
        // console.log('1',e.target.files)
        // console.log('2',e.target.Files)
        // console.log(e.target)
        this.setState({video: e.target})
    }


    // get cohort practice sets
    loadPracticeSetsQuestions() {
        this.setState({ dataLoaded: false })
        global.api.getCohortPracticeSetsQuestions(this.practiceSetId)
            .then(data => {
                this.setState({
                    questions: data ? data.practiceQuestions:[],
                    dataLoaded: true
                });
            });
    }

    // get all the available practice sets, available
    getAllPracticeSets(id) {
        global.api.getAllPracticeSets()
            .then(data => {
                if(data && data.practiceSets){
                    const find = data.practiceSets.find(e=>e.practiceSetId==id)
                    if(find){
                        this.setState({practicSet:find})
                    }
                }
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
                    


                </div>
            </div>


        );
    }

    render() {
        const { newQuestion, cohort, practicSet ,uploading, } = this.state;

        const columns = [
           
            {
                dataField: 'video',
                text: 'Video',
                formatter: (v, row) =>( <video width="100" height="70" controls>
                <source src={`https://langappnew.s3.amazonaws.com/interviewprep/${row.practiceSetId}/${row.practiceSetId}_0_${row.practiceQuestionId}.mp4`} type="video/mp4"/>
              </video> )
            },
            {
                dataField: 'practiceSetQuestion',
                text: 'Question',
            },
            {
                dataField: 'practiceQuestionText',
                text: 'Hints',
                formatter: (datum) => datum && datum != null && datum != 'null' ? datum :''
            },
            {
                dataField: 'referenceAnswer',
                text: 'Reference Answer',
                formatter: (datum) => datum && datum != null && datum != 'null' ? datum :''
            },

            {
                dataField: 'created_at',
                text: 'Date Created',
                formatter: (created_at) => moment(created_at).format('DD/MM/YYYY').toString(),
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
                            <h1 className="title1 mb25">Manage Practice Questions</h1>
                            <h4 className="title4 mb40">
                            Assigned to Practice Set ({practicSet ? practicSet.practiceSetName :''}) 
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
                            <div className="add-practice-set-modal" >
                                 {uploading && <div className="loader" style={{zIndex:999}}></div>}
                                <div disabled={true} className="add-practice-set-modal-body" style={{width:'90%', height:'80%', zIndex:99, }}>
                                    <div>
                                    <h2 style={{ padding: '2px 10px' }}>Practice Set Question</h2>
                                    <h6 style={{ padding: '2px 10px' }}>Add or Edit Practice Question</h6>
                                    <div style={{ margin: "1rem 0", fontSize: "23px" }}>
                                        <div className="row" style={{ padding: '2px 10px' }}>
                                            <div className="col-md-3">Practice Question</div>
                                            <div className="col-md-9">
                                                <RTEditor  disabled={uploading} 
                                                data={newQuestion.practiceSetQuestion}
                                                 placeholder="Practice Question" onChange={this.onChangeEditor} />

                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: '2px 10px' }}>
                                            <div className="col-md-3">Hints</div>
                                            <div className="col-md-9">
                                                <textarea disabled={uploading} value={newQuestion.practiceQuestionText} name="practiceQuestionText" style={{width:'100%', border: '1px solid', padding: 10, borderRadius: 5 }} placeholder="Hints" onChange={this.onChange} />

                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: '2px 10px' }}>
                                            <div className="col-md-3">Reference Answer</div>
                                            <div className="col-md-9">
                                                <textarea disabled={uploading} name="referenceAnswer" value={newQuestion.referenceAnswer} style={{ width:'100%', border: '1px solid', padding: 10, borderRadius: 5 }} placeholder="Reference Answer" onChange={this.onChange} />

                                            </div>
                                        </div>
                                        <div className="row" style={{ padding: '2px 10px' }}>
                                            <div className="col-md-3">Video</div>
                                            <div className="col-md-9">
                                                <input disabled={uploading}  name="video" type="file" onChange={this.onChangeFile} accept=".mp4" />

                                            </div>
                                        </div>

                                    </div>

                                    {uploading && <span style={{color:'green'}}> The question is being saved to the database.</span>}
                                   
                                    <div style={{ display: 'flex' }}>
                                        <div disabled={!this.state.newPracticeName} style={{ backgroundColor: '#4AB93C', color:'#fff' }} className="add-practice-set-modal-button" onClick={this.addPracticeSetQuestion}>Save</div>
                                        <div className="add-practice-set-modal-button"
                                        disabled={!uploading}
                                         onClick={e => {
                                             if(!uploading){
                                            this.setState({
                                                addPracticeSetAddModal: false,
                                                newQuestion: this.newQuestion
                                            });
                                        }
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

export default ManageQuetions;
