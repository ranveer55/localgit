import React, { Component } from 'react';
import ReactNotifications from 'react-notifications-component';

import Menu from "./pages/Menu";
import Header from "./pages/Header";
import Router from './Routes';
import ApiService from './components/ApiService';
const Api = new ApiService();
const pathName = window.location.pathname;
//const companyCode = '115'
class App extends Component {
  constructor(props) {
    super(props);
    global.api = Api // API server domain
    //global.companyCode = companyCode // API server domain
    //global.companyCode = Api.getCompanyCode()
  }
  render() {

    if ((pathName === '/login' || pathName === '/forgotpass')) {
      return (<div>
        <Router />
      </div>)
    } else {
      return (
        <div className="page_wrap">
          <ReactNotifications />
          <Header />
          <div className="content_wrap">
            <Menu /><Router />
          </div>
        </div>
      )
    }
  }
}

export default App;