import React, { Component } from 'react';
import AuthService from '../components/AuthService';

class Forgot extends Component {
    constructor(){
        super();
        this.state = {
            email : '',
            showError: false,
            messageFromServer:'',
            showSuccess: ''
        }
        this.Auth = new AuthService();
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleFormSubmit = e => {
        e.preventDefault();
        const email = this.state.email;
        if(email === ''){
            alert("Please Enter Email");
        }else{
            
            this.Auth.forgotpass(email)
                .then(res =>{
                    if(res.message === 'Please check email for reset link.'){
                        this.setState({
                            showError : true,
                            showSuccess: 'success_message',
                            messageFromServer : res.message
                        });
                    }else{
                        this.setState({
                            showError : true,
                            showSuccess: 'error_message',
                            messageFromServer : res.message
                        });
                    }
                })
                .catch(err =>{
                    alert(err);
                })
        }
    };
    
    render() {
        //const {email} = this.state;
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
                            <h3 className="form_title al_center mb50" style={{'fontSize':'25px'}}>Enter your email and we send you a password reset link.</h3>
                            
                            <div className="form_row type2">
                                <input className="form_input type2" type="text" placeholder="Email" id="email" label="email" onChange={this.handleChange('email')}/> 
                            </div>
                            <div className={this.state.showSuccess}>{this.state.showError=== true ? this.state.messageFromServer:' '}&nbsp;</div>

                            <div className="form_row_btn type2">
                                <button className="btn btn-radius btn-orange btn-size5" type="submit">
                                    <span>SEND REQUEST</span>
                                </button>
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
}

export default Forgot;