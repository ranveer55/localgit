import React, { Component } from "react";
import { Link } from 'react-router-dom';
import moment from "moment";
import BootstrapTable from 'react-bootstrap-table-next';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CustomizedSnackbars from '../CustomizedSnackbars'
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
            selectedPracticeSets: [],
            flash:false,
            message:'',
            variant:''
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

    addPracticeSet = () => {
        const { newPracticeName, assesment, assesmentTime } = this.state;
        global.api.addCompanyPracticeSet({ name: newPracticeName, assesment, assesmentTime })
            .then(
                data => {
                    const dt = this.state.availablePracticeSets;
                    dt.push(data.practiceSet);
                    this.setState({
                        selectedPracticeSets: [data.practiceSet.practiceSetId],
                        availablePracticeSets: dt,
                        message:'Practice set Added',
                        variant:'success',
                        flash:true
                    }, () => this.addd());
                })
            .catch(err => {
                this.setState({
                    dateLoaded: true,
                    message:'Oops something went wrong',
                        variant:'error',
                        flash:true
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
    Remove = (e, row) => {
        e.preventDefault();
        global.api.removePracticeSetFromCohort(this.cohortId, row.practiceSetId)
            .then((response) => {
                // remove from practice sets list
                const newState = [...this.state.practiceSets];
                newState.splice(this.state.practiceSets.indexOf(row.practiceSetId), 1);
                this.setState({
                    practiceSets: newState,
                    alreadySelectedPracticeSets: newState.map(d => d.practiceSetId),
                    message:'Practice set has been deleted',
                    variant:'success',
                    flash:true
                });
            })
            .catch(err => {
                this.setState({
                    message:'Oops something went wrong',
                    variant:'error',
                    flash:true
                })
            })

    }
    formatter = (cell, row) => {
        return (
            <div className="interview-simulator-dropdown-holder Inerpractice">
                <Button variant="contained" color="secondary" onClick={e => this.Remove(e, row)} title="Delete Practice Set" >
                    <DeleteIcon />
                </Button>
                <Button variant="contained" color="primary" onClick={e => this.props.history.push(`/manage-quetions/${this.cohortId}/${row.practiceSetId}`)} title=" Manage Questions" >
                    <EditIcon />
                </Button>
            </div>)
    }

    addd = () => {
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
                    showPracticeSetAddModal: false,
                    addPracticeSetAddModal: false
                });
            }).catch(err => {
                alert("Something went wrong!");
            });
    }



    render() {

        const columns = [

            {
                dataField: 'practiceSetName',
                text: 'Practice Set Name'
            },
            {
                dataField: 'assesment',
                text: 'Is Assesment',
                formatter: (val) => <Switch checked={val ?? false} />
            },
            {
                dataField: 'assesmentTime',
                text: ' Assesment Time'
            },
            {
                dataField: 'questionCount',
                text: '# of Questions'
            },



            {
                dataField: 'id',
                text: 'Action',
                formatter: this.formatter,
            },


        ];

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
                            <h1 className="title1 mb25">Manage Practice Sets</h1>
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
                                showPracticeSetAddModal: true
                            });
                        }} className="link" style={{ marginLeft: "1rem", fontSize: "16px" }}>Add Practice Set</span>
                        <span onClick={e => {
                            this.setState({
                                addPracticeSetAddModal: true
                            });
                        }} className="link" style={{ marginLeft: "1rem", fontSize: "16px" }}>Create new Practice Set</span>

                    </div>
                    <div>

                        {
                            this.state.practiceSets.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>No practice sets added yet!</td>
                                </tr>
                            ) : <></>
                        }
                        {
                            this.state.practiceSets.length > 0 && <BootstrapTable
                                keyField='id'
                                data={this.state.practiceSets}
                                columns={columns}
                            />
                        }
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
                                                <div className="add-practice-set-modal-button green" onClick={this.addd}>Add</div>
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
                    {
                        this.state.addPracticeSetAddModal ? (
                            <div className="add-practice-set-modal">
                                <div className="add-practice-set-modal-body">

                                    <h2>Create new Practice Set</h2>

                                    <TextField
                                        id="outlined-name"
                                        label="Practice set name"
                                        value={this.state.newPracticeName ?? ''}
                                        onChange={e => this.setState({ newPracticeName: e.target.value })}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <div style={{ margin: "1rem 0", fontSize: "23px" }}>
                                        <FormGroup row>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.state.assesment ?? false}
                                                        onChange={(e, val) => this.setState({ assesment: val })}
                                                        value="checkedA"
                                                        color="primary"
                                                    />
                                                }
                                                label="Is Assessment"
                                            />
                                        </FormGroup>
                                    </div>
                                    {this.state.assesment && <TextField
                                        id="outlined-name"
                                        label="Assesment Time"
                                        value={this.state.assesmentTime ?? 0}
                                        onChange={e => this.setState({ assesmentTime: e.target.value })}
                                        margin="normal"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                    />}



                                    <div style={{ display: 'flex' }}>
                                        <div disabled={!this.state.newPracticeName} style={{ backgroundColor: '#4AB93C' }} className="add-practice-set-modal-button" onClick={this.addPracticeSet}>Save</div>
                                        <div className="add-practice-set-modal-button" onClick={e => {
                                            this.setState({
                                                addPracticeSetAddModal: false
                                            });
                                        }}>Cancel</div>
                                    </div>
                                </div>
                            </div>
                        ) : <></>
                    }
                </section>
                <CustomizedSnackbars 
        open={this.state.flash}
        handleClose={() =>this.setState({flash:null})}
        variant={this.state.variant ?? ''}
        message={this.state.message ?? ''}
        />
            </main>
        );
    }
}

export default AddPracticeSetToCohortPage;
