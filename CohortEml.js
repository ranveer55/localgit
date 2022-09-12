import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Loader from "react-loader-spinner";
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationDialog from "./ConfirmDialog";
import CustomizedSnackbars from "./CustomizedSnackbars";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
class CohortEml extends Component {

  constructor(props) {
    super(props);

    this.companyCode = global.companyCode;
    this.cohortId = props.match.params.cohortId;
  console.log(this.cohortId)
   
    
    this.state = {
      dataLoaded: false,
      cohorts: [],
      selectedCohort: false,
      open: false,
      userId: '',
      course: '',
      courseNumber: null,
      deleting: undefined,
      del:false
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
      dataLoaded: true
    });
    global.api.getCompanyCohorts(
      this.companyCode
    )
      .then(
        data => {
          console.log("dataa",data) 
          this.setState({
            dataLoaded: false,
            cohorts: data.programs,
          });
         console.log("chhioas",this.state.cohorts)
          this.load();
           // this.setState({ batchData: data });
        })
      .catch(err => {
        this.setState({
          dataLoaded: false
        });
      });
           
  }
load=()=>{
   !this.state.dataLoaded &&this.state.cohorts&&
        this.state.cohorts.filter(c =>c.id==this.cohortId).map(cohort => {
                   this.setState({
                       selectedCohort: cohort
                   })
                })
                        
          }
   DeleteIconClick = (course) => {
      this.setState({
      open: true,
       course
    })
  }
  CheckedonClick = (userId, courseNumber, course) => {
    this.setState({
    del: true,
    userId, courseNumber, course
  })
}
  handleCancel = () => {
    this.setState({
      open: false,
      open: false,
      userId: '',
      course: '',
      courseNumber: null,
      deleting: undefined,
      del: false,
    })
   }

  deleteUser = () => {
    this.setState({
      deleting: true,
      deleted: undefined
    });
    global.api.deleteUserCourse(this.state.userId, this.state.courseNumber)
          .then(data => {
       
        if (data && data.status) {
          let selectedCohort =undefined;
          const cohorts = this.state.cohorts.map((c) => {
            if (c.id === this.state.selectedCohort.id) {
              const users = this.state.selectedCohort.users.filter((u) => u.userId !== this.state.userId);
              selectedCohort = {
                ...this.state.selectedCohort,
                users
              }
             
              return selectedCohort;
            }
            return c;
          })
          this.setState({
            open: false,
            userId: '',
            course: '',
            courseNumber: null,
            deleting: undefined,
            deleted: true,
            cohorts,
            selectedCohort: selectedCohort ? selectedCohort :this.state.selectedCohort
          })
        } else {
          this.setState({
            open: false,
            userId: '',
            course: '',
            courseNumber: null,
            deleting: undefined,
            deleted: false
            
          })
        }
      })
      .catch(err => {
        this.setState({
          deleting: undefined
        });
      });
 }
    render() {
    const NoDataIndication = () => (
      <div className="table_wraps" id="spinner">
        <div className="spinner" >
          <Loader type="Grid" color="#4441E2" height={100} width={100} />
          Loading....
        </div>
      </div>
    );
      return (
      <main className="offset" id="content">
       {this.state.del?(<Link style={{background:'green', width:"20%"}}><DeleteIcon style={{ margin: '3px 0px 0px 25px' }} color="secondary" onClick={() => this.DeleteIconClick(this.state.selectedCohort.name)} /></Link>):
        <></>}
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Company Cohorts ID</h1>
                 </div>
          </div>
          <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>checked</th>
                  <th>CohortID</th>
                </tr>
              </thead>
              <tbody>
             <div>
            {
              this.state.selectedCohort ? (
                <div>
                  <br />
                
                  <div>
                    {
                      this.state.selectedCohort.users.map(user => (
                        <tr key={user.userId}>
                          <td  style={{ width: "100%" }}> <FormControlLabel 
                             control={(
                              <Checkbox  
                              onChange={() => this.CheckedonClick(user.userId, user.courseNumber, this.state.selectedCohort.name 
                                )}
                                 /> 
                                      )}
                              /></td>
                         <td  style={{ width: "100%" }}> <Link key={user.userId}
                            target="_blank"
                            to={"/user-cohort-detail/" + this.state.selectedCohort.id + "/" + user.userId}
                            style={{
                              color: "blue",
                              cursor: "pointer"
                            }}>{user.userId}</Link></td>
                         </tr>
                      ))
                    }
                  </div>
                </div>
              ) :(
                <tr>
                  <td colSpan="10"><NoDataIndication />
                  </td>
                </tr>
              )
          }
       </div>
       </tbody>
            </table>
            </section>  
         <ConfirmationDialog userId={this.state.userId} course={this.state.course} open={this.state.open} handleCancel={this.handleCancel} handleOk={this.deleteUser} deleting={this.state.deleting} />
       <CustomizedSnackbars 
        open={this.state.deleted !== undefined}
        handleClose={() =>this.setState({deleted:undefined})}
        variant={this.state.deleted ? 'success' : 'error'}
        message={this.state.deleted ? 'User has been deleted' : 'Oops something went wrong'}
        />
        </main>
    );
  }
}

export default CohortEml;
