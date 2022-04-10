import React, { Component } from "react";
//import DataTable from 'react-data-table-component';
import $ from 'jquery';
class EmployeestoCourses extends Component {
  constructor(props) {
    super(props);
    if(this.props.location.state===undefined){
      window.location.href = '/employee';
    }
  //console.log(this.props.location.state.userid)
    this.state = {
      data : [],
      userid:this.props.location.state.userid
    }
    this.state.selected = []
    
  }
  componentDidMount() {
    global.api.getCourseList(global.companyCode)
                .then(res => res)
                .then(data => this.setState({data}))
                .catch(err =>{
                    alert(err);
                })
    
  }
  
  handleChkChange = (e) => {
    console.log(e.target.value)
    
    //console.log(e.target.checked)
    var isSelect = e.target.checked
    var chkValue = e.target.value
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, chkValue]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== chkValue)
      }));
    }
  }
  
  onSubmit = (e) => {
    console.log($(e.target.parentNode.parentNode.parentNode))
    console.log($('#popup_box').get(0).className)
    window.location.href = '#popup_box'
    //$('#popup_box').get(0).className = 'mfp popup_container'
   /*  e.preventDefault();
    let arr = [];
    for (var key in this.state) {
      if(this.state[key] === true) {
        arr.push(key);
      }
    }
    console.log(arr) */
    /* let data = {
      check: arr.toString() 
    }; */
   /*  axios.post('http://localhost:4000/checks/add', data)
          .then(res => console.log(res.data)); */
  }
  render() {
    
    const courseList = this.state.data.map((item, index) => {
      var imgPath = '/images/icons/icon_module_'+item.moduleNumber+'.svg'
      return (
        <label className="course_wraps_checkbox" key={index} >
            <input type="checkbox" id={item.Id} hidden="hiddden" onChange={this.handleChkChange} value={item.Id}/>
            <span>
                <span className="course_wraps_img">
                    <img src={imgPath} alt="" />
                </span>
                <span className="course_wraps_text">
                    <h3 className="title3">{item.courseName}</h3>
                    <p>{item.Id} Weeks</p>
                </span>
            </span>
        </label>
        
      );
    });
    
    return (<main className="offset" id="content">
    <section className="section_box">
        <h1 className="title1 mb50">Employees</h1>
        {/* <form onSubmit = {this.onSubmit}> */}
        <div className="head_box type2 mb20">
            <div className="head_box_l">
                <div className="activated_employee type2">
                    <div className="activated_employee_it mr30">
                        <img className="img" src="/images/icons/twotone-people2.svg" alt="" />
                    </div>
                    <div className="activated_employee_it mr60">
                        <h4 className="title4 fw400 mb10">Activated Employees</h4>
                        <div className="color5 fz28 fw700">54</div>
                    </div>
                    <div className="activated_employee_it">
                        <h4 className="title4 fw400 mb10">Open Slots</h4>
                        <div className="color5 fz28 fw300">35</div>
                    </div>
                </div>
            </div>
            <div className="head_box_c">
                <span className="form_search">
                    <input type="text" placeholder="Search for employee" />
                    <button>
                        <img src="/images/icons/search-icon.svg" alt="" />
                    </button>
                </span>
            </div>
            <div className="head_box_r">
                <a className="btn btn-radius btn-size btn-white" href="/employee">
                    <i>
                        <img src="/images/icons/User.svg" alt="" />
                    </i>
                    <span>Add new</span>
                </a>
                <a className="btn btn-radius btn-size btn-blue btn-icon-right popup-link" href='#popup_box1' onClick={this.onSubmit}>
                    <i>
                        <img src="/images/icons/arrow_next2.svg" alt="" />
                    </i>
                    <span>Add to Course</span>
                </a>
            </div>
        </div>
        <div className="head_box type2 mb105">
            <div className="head_box_l fd">
                <div className="following_box">
                    <span className="following_img">
                        <img src="/images/benjamin.png" alt="" />
                        <img src="/images/benjamin.png" alt="" />
                        <img src="/images/benjamin.png" alt="" />
                        <img src="/images/benjamin.png" alt="" />
                        <img src="/images/benjamin.png" alt="" />
                    </span>
                    <span>
                        <b>+65 more</b>&nbsp;will be added to the following</span>
                </div>
            </div>
            
        </div>
        
        <div className="course_wraps mb105">
            <h2 className="mb30 fw400">General Courses</h2>
            <div className="course_wraps_it">
            {courseList}
                
            </div>
        </div>
        {/* <div className="course_wraps">
            <h2 className="mb30 fw400">Management</h2>
            <div className="course_wraps_it">
            {courseList}
            </div>
        </div> */}
        {/* </form> */}
    </section>
    
</main>)

  }
}


export default EmployeestoCourses;
