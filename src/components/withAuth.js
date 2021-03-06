import React, { Component } from 'react';
import AuthService from './AuthService';
export default function withAuth(AuthComponent) {
          // Code here now
          const Auth = new AuthService('http://localhost:8080');
          return class AuthWrapped extends Component {
                    constructor() {
                              super();
                              this.state = {
                                  user: null
                              }
                          }
                          componentDidMount() {
                              if (!Auth.loggedIn()) {
                                    window.location.href = '/login';
                                  //this.props.history.replace('/login')
                              }
                              else {
                                  try {
                                      const profile = Auth.getProfile()
                                      this.setState({
                                          user: profile
                                      })
                                  }
                                  catch(err){
                                      Auth.logout()
                                      window.location.href = '/login';
                                      //this.props.history.replace('/login')
                                  }
                              }
                          }
                          render() {
                              if (this.state.user) {
                                  return (
                                      <AuthComponent history={this.props.history} user={this.state.user} />
                                  )
                              }
                              else {
                                  return null
                              }
                          }
          }
          

      }