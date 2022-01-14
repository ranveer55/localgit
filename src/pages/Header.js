import React from "react";
import AuthService from '../components/AuthService';
import ApiService from '../components/ApiService';
import Select from 'react-select';

const pathName = window.location.pathname;
const Auth = new AuthService();
const Api = new ApiService();

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.user = '';
        if (Auth.loggedIn()) {
            this.user = Auth.getProfile()
        }
        global.companyCode = Api.getCompanyCode()
        global.companyName = Api.getCompanyName()
        global.access_level = Api.getAccessLevel()

        if (global.companyCode === null && global.access_level === "1") {
            global.companyCode = 115
            global.companyName = 'Taplingua Empresas Demo 1'
        }
        this.state = {
            companyList: [],
            companyName: '',
            selectedOption: [{ "value": global.companyCode, "label": global.companyCode + " - " + global.companyName }],
            companyDisable: ""
        };

    }
    componentDidMount() {
        if (global.access_level == "3") {
            this.setState({ companyDisable: "disabled" })
        }
        let api = ''
        if (global.access_level === "1") {
            api = global.api.getCompanyList();
        } else {
            api = global.api.getCompanyList(global.companyCode);
        }
        api
            .then(companyList => {
                companyList.sort(function (a, b) {
                    return a.value - b.value;
                });
                this.setState({ companyList: companyList });
            })
            .catch(err => {
                alert(err);
            })

        // get company name
        global.api.getCompanyList(global.companyCode)
            .then(res => res)
            .then(data => {
                const companyName = data[0].label.split(" - ").pop();
                this.setState({ companyName });
            })
            .catch(err => {
                // fail silently
                console.log({ err, companyCode: global.companyCode });
            })

    }

    handleLogout = (props) => {
        localStorage.setItem("mytime",'')
        Auth.logout()
        window.location.href = '/login';
    }
    handleChange = selectedOption => {
        this.setState({ selectedOption });
        var selValue = selectedOption.value;
        Api.setCompanyCode(selValue);
        var CompanyName = selectedOption.label;
        var res = CompanyName.split(" - ");
        Api.setCompanyName(res[1]);
        window.location.href = pathName;
    };

    render() {
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
                                        <img src="/images/logo.svg" alt="" />
                                    </div>
                                    <div className="logo_description">Dashboard</div>
                                </a>
                                <img src={`https://langappnew.s3.amazonaws.com/logos/${this.state.selectedOption[0].value}.jpeg`} style={{
                                    marginLeft: "12px",
                                    maxHeight: "36px",
                                    maxWidth: "120px"
                                }} alt="" />
                                {
                                    this.state.companyDisable ? (
                                        <h6 className="title1 ml15" style={{ 'fontSize': '15px', marginLeft: '15px' }}>Welcome! {this.state.companyName} Team</h6>
                                    ) : <></>
                                }
                            </div>

                            <div className="header_right">
                                <div className="head_box_l switch">
                                    {
                                        this.state.companyDisable ? (
                                            <></>
                                        ) : (
                                            <>

                                                <h6 className="title1 mr15" style={{ 'fontSize': '15px' }}>
                                                    Company
                                                </h6>
                                                <div style={{ 'width': '350px' }}>
                                                    <Select id="company" value={this.state.selectedOption} onChange={this.handleChange} options={this.state.companyList} className="Select has-value is-clearable is-searchable Select--multi"
                                                        classNamePrefix="company" isDisabled={this.state.companyDisable} />
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                                {/*                             
                            <a className="link link-black support_link" href="/help">
                                <span>Help & Support</span>
                            </a> */}
                                <a className="header_reminder" href="/">
                                    <span>8</span>
                                </a>
                                <div className="header_login_box">
                                    <span className="header_login_name">Hi,
                                        <span className="fw700 header-logout">{this.user}</span>
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
