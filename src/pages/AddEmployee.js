import React, { Component } from "react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import 'react-notifications-component/dist/theme.css';
import ReactFormInputValidation from "react-form-input-validation";
import DatePicker from "react-datepicker";
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import "react-datepicker/dist/react-datepicker.css";
import queryString from 'query-string';

class AddEmployee extends Component {
 constructor(props) {
    super(props);
    let params = queryString.parse(this.props.location.search)
     
    this.state = {
      countryCode: '+34',
      phone: '+34',
      title: 'Add',
      startDate: new Date(),
      fields: {
        fname: "",
        email: "",
        lname:"",
        location:"",
        dni:"",
        deptname:"",
        userId:"",
        status:"F",
        wemail:'N',
        mobileos:'android',
      },
      update:0,
      errors: {},
      
    };
    
    if(params.userId!==undefined ){
      this.state.userId = params.userId
      this.state.title = 'Update';
      this.state.update = 1;
    }
    this.state.notification = {
      title: '',
      message: '',
      type: 'default',                // 'default', 'success', 'info', 'warning'
      container: 'top-right',                // where to position the notifications
      animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
      animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
      dismiss: {
        duration: 2000,
        onScreen: true
      }
    };
    this.state.errors = [];
    this.form = new ReactFormInputValidation(this);
    this.form.useRules({
        fname: "required",
        email: "required|email",
    });

    this.form.onformsubmit = (fields) => {
      
      var notification=this.state.notification
      let actVal = this.refs['actionVal'].value;
      if((actVal === '') || (actVal === 'fillform')){
        let countryCode = "";	
        let mobile = "";	
        let mobileData = this.state.phone;	
        if(mobileData !== ""){	
         let mobileDataArr = mobileData.split(" ");  
          countryCode = (mobileDataArr["0"]).replace ( /[^0-9]/g, '' ); 
          let n = mobileData.indexOf(" ");  
          if(n >= 0){
            mobile = (mobileData.substr(parseInt(n+1))).replace ( /[^0-9]/g, '' );
          }
        }	
        
        var params = {
          userId:fields.email,
          CompanyCode:global.companyCode,
          FirstName:fields.fname,
          LastName:fields.lname,
          Location:fields.location,
          Mobile:mobile,	
          CountryCode:countryCode,
          Mobilewcode:countryCode,
          DNI:fields.dni,
          mobileOS:this.state.mobileos,
          subscriptionValidDate:this.state.startDate,
          company:fields.deptname,
          weeklyEmail:this.state.wemail,
          disable:this.state.status,
          status:this.state.status
        }
        if(this.state.update === 1){
          global.api.updateEmployee(params)
          .then(res => res)
          .then((json)=>{
            if(json.data.message==="Employee data updated Successfully."){
              notification.type='success'
              notification.title='Success';
              notification.message=json.data.message
              store.addNotification({
                ...notification
              });
            }else{
              notification.type='danger'
              notification.title='Error';
              notification.message=json.data.message
                    store.addNotification({
                      ...notification
                    });
            }
          })
          .catch(err =>{
              //alert(err);
              notification.type='danger'
              notification.title='Error';
              notification.message=err.data.error
                    store.addNotification({
                      ...notification
                    });
          });
        }else{
          global.api.addEmployee(params)
          .then(res => res)
          .then((json)=>{
            if(json.data.message==="Employee data inserted Successfully."){
              notification.type='success'
              notification.title='Success';
              notification.message=json.data.message
              store.addNotification({
                ...notification
              });
            }else{
              notification.type='danger'
              notification.title='Error';
              notification.message=json.data.message
                    store.addNotification({
                      ...notification
                    });
            }
          })
          .catch(err =>{
              //alert(err);
              notification.type='danger'
              notification.title='Error';
              notification.message=err.data.error
                    store.addNotification({
                      ...notification
                    });
          });
        }
        
    }else{
      alert("Upload File");
    }
  }
 }
 componentDidMount() {
   if(this.state.userId){
    global.api.getEmployeeDetails (this.state.userId)
              .then(res => res)
              .then((json)=>{
                const fields = {
                  fname :  json.FirstName,
                  email :  json.userId,
                  lname :  json.LastName,
                  location  : json.Location,
                  dni   :  json.DNI,
                  deptname  : json.company,
                  userId  : json.userId
                }
                this.setState({countryCode: `+${json.CountryCode}`});
                this.setState({phone: `+${json.Mobilewcode} ${json.Mobile}`});
                this.setState({fields});
                //this.setState({phone : json.Mobile});
                if(json.status!=="" && json.status!==" "){
                  this.setState({status:json.status.toUpperCase()});
                }
                if(json.weeklyEmail!=="" && json.weeklyEmail!==" "){
                  this.setState({wemail:json.weeklyEmail});
                }
                
                if(json.mobileOS!=="" && json.mobileOS!==" "){
                  
                  this.setState({mobileos:json.mobileOS});
                }
                
                if(json.subscriptionValidDate !== '' && json.subscriptionValidDate!== '0000-00-00 00:00:00'){
                  var toDate = new Date(json.subscriptionValidDate);
                  this.setState({startDate : toDate});
                }
                
              })
              .catch(err =>{
                  alert(err);
              })

    // show user daily log link
    console.log("show daily log link")
   }
  
}
  handleChange(e){
    this.setState({countryCode: e.target.value});
  }
  handleCheck(e) {
     this.setState({actionVal: e.currentTarget.dataset.id})
     this.refs['actionVal'].value = e.currentTarget.dataset.id;
  }
  handleOnChange = (event) => {
    this.setState({
        mobileos: event.target.value
    })
  }
  render(){
    
    
    return (
        
      <main className="offset" id="content">
      <link rel="stylesheet" media="screen" href="fonts/flag-icon/css/flag-icon.min.css" />
    <section className="section_box">
      <h4 className="title4 fw500 mb20">Employees</h4>
        <h1 className="title1 mb25">{this.state.title} Employee</h1>
          <form onSubmit={this.form.handleSubmit} className="form_employee js-tabs">

          {
              this.state.userId ? (
                <a href={"/daily-goal-log?userId=" + this.state.userId.trim()} className="btn btn-blue btn-sm btn-radius btn-icon-left" style={{ marginBottom: "2rem" }}>
                  <span>Daily Goal Log</span>
                </a>
              ) : <></>
          }
          
          <div className="js-tabs-box">
            <div>
              <div className="form_row_box">
                <h2 className="title2 fw400 form_title mb25">Personal Information</h2>
                <div className="form_row_col">
                  <div className="form_row mb25">
                    <label className="form_label">FIRST Name</label>
                    
                    <input type="text" className="form_input" name="fname" onBlur={this.form.handleBlurEvent} onChange={this.form.handleChangeEvent} value={this.state.fields.fname}/>
                    <label className="error_message"> {this.state.errors.fname ? this.state.errors.fname : ""}</label>
                  </div>
                  <div className="form_row mb25">
                    <label className="form_label">LAST Name</label>
                    <input type="text" className="form_input" name="lname" onChange={this.form.handleChangeEvent} value={this.state.fields.lname}/>
                  </div>
                </div>
                <div className="form_row_col">
                  <div className="form_row mb25">
                    <label className="form_label">EMAIL</label>
                    <input className="form_input" type="email" name="email" onBlur={this.form.handleBlurEvent} onChange={this.form.handleChangeEvent} value={this.state.fields.email}/>
                    <label className="error_message"> {this.state.errors.email ? this.state.errors.email : ""}</label>
                  </div>
                  <div className="form_row mb25">
                    <label className="form_label">mobile</label>
                    <div className="p_rel selectt">
                        <PhoneInput className="form_input form_input_tel" country={'us'} value={this.state.phone} 
                        onChange={phone => this.setState({ phone })} 
                        enableSearch required= 'true' ref="mobile"/>
                    </div>
                  </div>
                </div>
                <div className="form_row_col">
                  <div className="form_row mb25">
                    <label className="form_label">Location</label>
                    <input className="form_input" type="text" id="location" name="location" ref="location" onChange={this.form.handleChangeEvent} value={this.state.fields.location}/> 
                  </div>
                  <div className="form_row mb25">
                    <label className="form_label">dni</label>
                    <input className="form_input" type="text" id="dni" name="dni" ref="dni" onChange={this.form.handleChangeEvent} value={this.state.fields.dni}/> 
                  </div>
                </div>
              </div>
              <div className="form_row_box">
                <h2 className="title2 fw400 form_title mb25">Work Information</h2>
                <div className="form_row mb25">
                    <label className="form_label">Department</label>
                    <input className="form_input" type="text" id="deptname" name="deptname" ref="deptname" onChange={this.form.handleChangeEvent} value={this.state.fields.deptname}/>
                </div>
              </div>
              <div className="form_row_box">
                  <h2 className="title2 fw400 form_title mb25">Additional Information</h2>
                  <div className="form_row_col">
                    <div className="form_row form_flex mb25">
                        <label className="form_label">MOBILE OS</label>
                        
                        <select className="select w182" id="mobileos" value={this.state.mobileos} onChange={mobileos => this.setState({ mobileos:mobileos.target.value})}>
                          <option value="android">Android</option>
                          <option value="IOS">IOS</option>
                        </select><div className="jq-selectbox__trigger-arrow"></div>
                        
                    </div>
                    <div className="form_row form_flex mb25">
                        <label className="form_label">Subscription valid date</label>
                        <div>
                            <div className="datepicker_box mb20">
                                <div className="p_rel">
                                <DatePicker className=" form_input" selected={this.state.startDate} onChange= {date => this.setState({ startDate: date })} dateFormat="dd-MM-yyyy"/>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div className="form_row_col">
                    <div className="form_row form_flex mb25">
                        <label className="form_label">weekly email</label>
                        <select className=" select w182" id="wemail" name="wemail" ref="wemail" value={this.state.wemail} onChange={wemail => this.setState({wemail: wemail.target.value})}>
                          <option value="N">No</option>
                          <option value="Y">Yes</option>
                        </select><div className="jq-selectbox__trigger-arrow"></div>
                    </div>
                    <div className="form_row form_flex mb25">
                        <label className="form_label">Status</label>
                        <select className=" select w182" id="status" name="status" value={this.state.status} onChange={status => this.setState({status: status.target.value})}>
                        <option value="F"> Unarchive</option>
                        <option value="T">Archive</option>
                        </select><div className="jq-selectbox__trigger-arrow"></div>
                    </div>
                  </div>
              </div>
              <div className="form_row_btn">
                <button className="btn btn-white btn-radius btn-size">
                  <span>Cancel</span>
                </button>
                <button className="btn btn-blue btn-radius btn-icon-left">
                  
                  <span>Add employee</span>
                </button>
                <input type="hidden" id="action" name="actionVal" ref="actionVal"/>
              </div>
            </div>
            <div>
              
            </div>
          </div>
          
        </form>
      </section>
</main>
    )
  }
}
export default AddEmployee;
