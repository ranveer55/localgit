import React from "react";
import Select from 'react-select';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
//import logo from "../images/logo.png";
//import $ from 'jquery';
import AuthService from '../components/AuthService';
const Auth = new AuthService();


class Header extends React.Component {
    constructor(){
        super();
        this.user = '';
        if(Auth.loggedIn()){
            this.user = Auth.getProfile()
            console.log('profile',this.user)
        }
        this.state = {
            companyList: [],
            selectedOption: {"value":115,"label":"115 - Taplingua Empresas Demo 1"},
        };
    }
    componentDidMount() {
        let companies = []
        global.api.getCompanyList ()
        .then(res => res)
        .then((json)=>{
            companies = json.map((company) => {
            return {'value':company.Id,'label':company.Id +" - "+company.Name}
        });
        console.log(companies);
        this.setState({
            companyList: companies,
        });
        })  
        .catch(err =>{
            alert(err);
        })
    }
    
    handleChange = selectedOption => {
        this.setState(
          { selectedOption },
          () => console.log(`Option selected:`, this.state.selectedOption)
        );
      };
    handleLogout = (props) => {
        console.log('logout',props)
        Auth.logout()
        window.location.href = '/login';
     }
  render() {
    const options = this.state.companyList
    const { selectedOption } = this.state.selectedOption;
    console.log(this.state.selectedOption)
    return (
      <div>
        <div className="overlay"></div>
            {/* <!-- Preloader Start     ============================================ --> */}
            <div id="page-preloader">
                <div className="preloader">
                    <div className="preload_inner preload-one"></div>
                    <div className="preload_inner preload-two"></div>
                    <div className="preload_inner preload-three"></div>
                </div>
            </div>
            {/* <!-- Preloader End       ============================================ -->
            <!-- Header Start     ============================================ --> */}
            <header className="header" id="header">
                <div className="container-fluid">
                    <div className="header_wrap">
                        <div className="header_left">
                            <a className="logo_box" href="index.html">
                                <div className="logo">
                                    <img src="images/logo.svg" alt="" />
                                </div>
                                <div className="logo_description">Dashboard</div>
                            </a>
                        </div>
                        
                        <div className="header_right">
                            <div className="head_box_l switch">
                                <h6 className="title1 mr15"  style={{'fontSize':'15px'}}>
                                Company
                                </h6>
                                <div className="select_box">
                                <Dropdown options={options} onChange={this.handleChange} defaultValue={selectedOption} />
                                <Select
                options={options}
                onChange={this.handleChange}
                defaultValue={selectedOption}
            />
                                {/* <Select
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={options}
                                    classes="select select_size"
                                /> */}
                                {/* <select className="select select_size" id="company" name="company" value="133" style={{'padding': '10px 54px 10px 23px'}} readOnly>
                                            
                                        </select> */}
                                </div>
                            </div>
                            
                            <a className="link link-black support_link" href="/help">
                                <span>Help & Support</span>
                            </a>
                            <a className="header_reminder" href="/">
                                <span>8</span>
                            </a>
                            <div className="header_login_box">
                                <span className="header_login_name">Hi,
                                    <span className="fw700">{this.user}</span>
                                </span>
                                <span className="header_login_photo" onClick={this.handleLogout}><img src="/images/logout.png" alt="Logout" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
      </div>
    );
  }
}

export default Header;

