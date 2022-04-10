import React, { Component } from "react";
import CampaignsWeeklyCompletion from './Campaigns-weekly-completion'
import CampaignsWeeklyTask from './Campaigns-weekly-task'
import CampaignsWelcomeEmail from './Campaigns-welcome-email'

class Campaigns extends Component {
  
  render(){
      return (
        <main className="offset" id="content">
          <section className="section_box">
            <h4 className="title4 fw500 mb20">Messaging & Notification Center</h4>
              <h1 className="title1 mb115">Campaigns</h1>
              <form className="form_employee js-tabs">
                <ul className="js-tabs-list tab-list">
                  <li data-id="weeklycompletion"><span>Weekly Completion</span></li>
                  <li data-id="weeklytasks"><span>Weekly Tasks</span></li>
                  <li data-id="welcomemail"><span>Welcome - Email</span></li>
                </ul>
                <div>
                  <div className="js-tabs-box tab-box">
                    <CampaignsWeeklyCompletion />
                    <CampaignsWeeklyTask />
                    <CampaignsWelcomeEmail />
                  </div>
                </div>
              </form>
            </section>
      </main>
    )
  }
}
export default Campaigns;


