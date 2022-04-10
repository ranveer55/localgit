import React from "react";

class OverView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    global.api
      .getOverView(global.companyCode)
      .then((data) => {
        this.setState({ data: data });
      })
      .catch((err) => {
         alert(err);
      });
  }

  render() {
    const { totalUsers, activeCourses, ongoingBatches } = this.state.data;
    return (
      <main className="offset" id="content">
        <section className="section_box">
          <h1 className="title1 mb115">Overview</h1>

          <div className="overview-wrap">
            <div className="overview-wrap-left">
              <div className="overview-wrap-div-up">
                <div className="overview-wrap-div-up-heading">Total Users</div>
                <div className="overview-wrap-div-up-border"></div>
                <div className="overview-wrap-div-up-text">{totalUsers}</div>
              </div>
              <div className="overview-wrap-div-down">
                {/*<div className="overview-wrap-div-down-text">View Engagement</div>
                  <div className="overview-wrap-div-down-img">
                    <img src="images/icons/farrow.svg" alt="" />
                  </div>*/}
              </div>
            </div>
            <div className="overview-wrap-center">
              <div className="overview-wrap-div-up">
                <div className="overview-wrap-div-up-heading">
                  Active Courses
                </div>
                <div className="overview-wrap-div-up-border"></div>
                <div className="overview-wrap-div-up-text">{activeCourses}</div>
              </div>
              <div className="overview-wrap-div-down">
                {/*<div className="overview-wrap-div-down-text">View Engagement</div>
                  <div className="overview-wrap-div-down-img">
                    <img src="images/icons/farrow.svg" alt="" />
                  </div>*/}
              </div>
            </div>
            <div className="overview-wrap-right">
              <div className="overview-wrap-div-up">
                <div className="overview-wrap-div-up-heading">
                  Ongoing Cohorts
                </div>
                <div className="overview-wrap-div-up-border"></div>
                <div className="overview-wrap-div-up-text">
                  {ongoingBatches}
                </div>
              </div>
              <div className="overview-wrap-div-down">
                {/*<div className="overview-wrap-div-down-text">View Engagement</div>
                  <div className="overview-wrap-div-down-img">
                    <img src="images/icons/farrow.svg" alt="" />
                  </div>*/}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default OverView;
