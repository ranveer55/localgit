import React, { Component } from 'react';
import AuthService from '../components/AuthService';
import { GoogleLogin } from 'react-google-login';
import { facebook, google } from '../config/services';
import ReactFacebookLogin from 'react-facebook-login';

class Login extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
        this.state = {
            isLoading: false
        };
        //temp email/pass
    }

    /**
     * Google Auth
     * @param {*} response 
     */
    googleAuthResponse(response) {
        // Check if there is a token
        this.setState({
            isLoading: true
        });
        if (response && ('accessToken' in response)) {
            const accessToken = response.accessToken;
            this.Auth.loginGoogle(accessToken).catch(f => {
                this.setState({
                    isLoading: false
                });
            });
        } else {
            alert('something went wrong, please try again!');
            this.setState({
                isLoading: false
            });
        }
    }

    /**
     * Google Auth
     * @param {*} response 
     */
    facebookAuthResponse(response: any) {
        // Check if there is a token
        this.setState({
            isLoading: true
        });

        console.log({ facebookResponse: response })

        if (response && ('accessToken' in response)) {
            const accessToken = response.accessToken;
            this.Auth.loginFacebook(accessToken)
                .catch(f => {
                    this.setState({
                        isLoading: false
                    });
                    alert('something went wrong, please try again!');
                });
        } else {
            alert('something went wrong, please try again!');
            this.setState({
                isLoading: false
            });
        }
    }

    componentDidMount() {
        if (this.Auth.loggedIn())
            this.props.history.replace('/');
    }
    render() {
        return (
            <div>
                <div className="overlay"></div>
                <div id="page-preloader">
                    <div className="preloader">
                        <div className="preload_inner preload-one"></div>
                        <div className="preload_inner preload-two"></div>
                        <div className="preload_inner preload-three"></div>
                    </div>
                </div>
                <main className="type2" id="content">
                    <section className="section_box section_offset1 zoom">
                        <div className="form_wrapper ">
                            <div className="form_logos mb35">
                                <img src="/images/logos.png" alt="" />
                            </div>
                            <form className="form_form" onSubmit={this.handleFormSubmit}>
                                <h3 className="form_title al_center mb35">Please login to your account.</h3>
                                <div className="form_row type2">
                                    <input className="form_input type2" placeholder="Username" name="email" type="text" onChange={this.handleChange} />
                                </div>
                                <div className="form_row type2">
                                    <input className="form_input type2" placeholder="Password " name="password" type="password" onChange={this.handleChange} />
                                </div>
                                <div className="form_row type2 form_flex mb115">
                                    <label className="form_checkbox login">
                                        <input type="checkbox" hidden="hidden" />
                                        <span>Remember me</span>
                                    </label>
                                    <a className="link link-size1 link_color" href="/forgotpass">Forgot password</a>
                                </div>
                                <div className="form_row_btn type2">
                                    <button className="btn btn-radius btn-orange btn-login" type="submit">
                                        <span>LOG IN</span>
                                    </button>
                                </div>
                                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                    <GoogleLogin
                                        clientId={google.clientId}
                                        buttonText="Login"
                                        onSuccess={this.googleAuthResponse.bind(this)}
                                        onFailure={this.googleAuthResponse.bind(this)}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                    <ReactFacebookLogin
                                        appId={facebook.appId}
                                        textButton="Continue with Facebook"
                                        callback={this.facebookAuthResponse.bind(this)}
                                        cssClass="btnFacebook"
                                        icon="fa-facebook"
                                    />
                                </div>
                                <div style={{
                                    display: this.state.isLoading ? 'flex' : 'none',
                                    top: '0',
                                    bottom: '0',
                                    left: '0',
                                    right: '0',
                                    position: 'fixed',
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    Please wait...
                                </div>
                            </form>
                            <div className="link_wrapp">
                                <a className="link_wrapp_it" href="/terms">Terms of Use</a>
                                <a className="link_wrapp_it" href="/policy">Privacy Policy</a>
                            </div>
                        </div>

                    </section>
                </main>

            </div>

        );
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }
    handleFormSubmit(e) {
        e.preventDefault();
        this.Auth.login(this.state.email, this.state.password)
            .then(res => {
                if (res.message) {
                    alert(res.message);
                    return false;
                } else {
                    if (res.accesslevel !== "0") {
                        window.location.href = '/overview';
                    } else {
                        alert('Access Level Disabled, Contact Admin');
                    }
                }
            })
            .catch(err => {
                alert(err);
            })
    }
}

export default Login;