import React, { Component } from "react";
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
class AddQuizSetToCohortPage extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohort: null,
            quizSets: [],
            showQuizSetAddModal: false,
            newSet:{
                "cohortId":this.cohortId,"companyCode":this.companyCode,"quizTopic":"",
                "questionCap":10,"quizSubTopic":"","quizSubject":"STATS"
            },
            newSetDesign:{
                "cohortId":this.cohortId,"companyCode":this.companyCode,"quizTopic":"",
                "questionCap":10,"quizSubTopic":"","quizSubject":"STATS"
            }
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }


    componentDidMount() {
        this.loadData();
        this.loadQuizSets();
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

    addQuizSet = () => {

        global.api.addCohortQuizSet(this.state.newSet)
            .then(
                data => {
                    this.loadQuizSets()
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true
                });
            });
    }



    // get cohort quiz sets
    loadQuizSets() {
        global.api.getCohortQuizSets(this.cohortId)
            .then(data => {

                const n = data && data.length > 0 ? data[0]:null;
                this.setState({
                    quizSets: data,
                    addQuizSetAddModal:false
                });
            });
    }
    EditQuizSet =(e, set) =>{
        e.preventDefault();
        this.setState({
            newSet:set,
            addQuizSetAddModal: true
        })
    }
    
    formatter = (cell, row) => {
        return (
            <div className="interview-simulator-dropdown-holder">
                <span className="interview-simulator-dropdown">⋮</span>
                <div className="interview-simulator-dropdown-content">
                    <Link
                        to={`manage-quetions/${row.id}`}
                        className="interview-simulator-dropdown-link"
                        style={{
                            color: "blue",
                            cursor: "pointer"
                        }}>Manage Questions
                    </Link>
                    {/* <Link
                        to="#"
                        onClick={e=>this.Remove(e, row)}
                        className="interview-simulator-dropdown-link"
                        style={{
                            color: "blue",
                            cursor: "pointer"
                        }}>Delete Quiz Set
                    </Link> */}


                </div>
            </div>)
    }

    

    onChange =(e) =>{
        let {newSet} =this.state;
        newSet ={
            ...newSet,
            [e.target.name]:e.target.value
        }
        const valid =Object.values(newSet).find(item=>!item)
        this.setState({
            newSet,valid:!valid
        })
    }



    render() {

        const columns = [
           
            {
                dataField: 'quizSetId',
                text: 'Quiz Set Id'
            },
            {
                dataField: 'quizTopic',
                text: 'quiz Topic'
            },
            {
                dataField: 'questionCap',
                text: 'question Cap'
            },
            {
                dataField: 'quizSubTopic',
                text: 'quiz Sub Topic'
            },
             {
                dataField: 'quizSubject',
                text: 'quiz Subject'
            },
            
            {
                dataField: 'questionsCount',
                text: '# of Questions'
            },


            
            {
                dataField: 'id',
                text: 'Action',
                formatter: (id)=><Link
                to={`manage-quetions/${id}`}
                className=""
                style={{
                    color: "blue",
                    cursor: "pointer"
                }}>Manage Questions
            </Link>
            },
             {
                dataField: 'id',
                text: 'Action',
                formatter: (id,row)=><Link
                to={`#`}
                onClick={e=>this.EditQuizSet(e,row)}
                className=""
                style={{
                    color: "blue",
                    cursor: "pointer"
                }}>Edit Quiz Set
            </Link>
            },


        ];
        const newSet =this.state.newSet;
        const newSetDesign =this.state.newSetDesign;
        let quizSet =this.state.quizSets;
        quizSet =quizSet && quizSet.length > 0 ? quizSet[0]: null;
        const inputClass ={width:'100%',border: '1px solid', padding: 10, borderRadius: 5, margin:'5px 0' }
        if (!this.state.cohort) {
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
                            <h1 className="title1 mb25">Manage Quiz Sets</h1>
                            <h4 className="title4 mb40">
                                For {this.state?.cohort?.cohort_name}
                            </h4>
                            <a href={`https://api2.taplingua.com/app/user-cohort-registration/${this.cohortId}`} target="_blank" rel="noopener noreferrer">Open Registration Form</a>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        Cohort Name: {this.state.cohort.cohort_name}
                       
                        <span onClick={e => {
                            this.setState({
                                addQuizSetAddModal: true,
                                newSet:newSetDesign
                            });
                        }} className="link" style={{ marginLeft: "1rem", fontSize: "16px" }}>Add Quiz Set</span>
                       

                    </div>
                    <div>

                        {
                            this.state.quizSets.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>No quiz sets added yet!</td>
                                </tr>
                            ) : <></>
                        }
                        {
                            this.state.quizSets.length > 0 && <BootstrapTable
                                keyField='id'
                                data={this.state.quizSets}
                                columns={columns}
                            />
                        }
                    </div>
                    {
                        this.state.addQuizSetAddModal ? (
                            <div className="add-practice-set-modal">
                                <div className="add-practice-set-modal-body" style={{ margin: "0", fontSize: "11px" }}>
                                    <h2>Quiz Set</h2>
                                    <div>Quiz Topic<input style={inputClass} name="quizTopic" value={newSet.quizTopic}  placeholder="Quiz Topic" onChange={this.onChange} /></div>
                                    <div>Question Cap<input style={inputClass} name="questionCap"  value={newSet.questionCap}  placeholder="Question Cap" onChange={this.onChange} /></div>
                                    <div>Quiz Sub Topic<input style={inputClass} name="quizSubTopic"   value={newSet.quizSubTopic} placeholder="Quiz Sub Topic" onChange={this.onChange} /></div>
                                    <div>Quiz Subject<input style={inputClass} name="quizSubject"  value={newSet.quizSubject}  placeholder="Quiz Subject" onChange={this.onChange} /></div>


                                    <div style={{ display: 'flex' }}>
                                        <div disabled={!this.state.valid} style={{ backgroundColor: '#4AB93C' }} className="add-practice-set-modal-button" onClick={this.addQuizSet}>Save</div>
                                        <div className="add-practice-set-modal-button" onClick={e => {
                                            this.setState({
                                                addQuizSetAddModal: false
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

export default AddQuizSetToCohortPage;
