import moment from "moment";
import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";

class ProctoredTestUserDetail extends Component {
  constructor(props) {
    super(props);

    this.attemptLogId = props.match.params.attemptLogId;
    this.state = {
      dateLoaded: false,
      cohort: null,
      dateLoaded: false,
     
      data: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({
      dateLoaded: false,
    });

    global.api
      .getProctoredTestUserDetail(this.attemptLogId)
      .then((data) => {
        this.setState({
          dataLoaded: true,
          data: data.data,
          cohort: data.cohort,
        });
        // this.setState({ batchData: data });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }

 

  render() {
    const { data, cohort } = this.state;
    
    return (
      <main className="offset" id="content">
        <div className="row">
          <div className="">
            <h4 className="title4 mb40">Procotored Tests</h4>
            <br />
          </div>
        </div>

        <section className="section_box">
          <div className="row">
            <div className="col-md-12">
              <h1 className="title1 mb25">Cohorts: {cohort?.name}</h1>
              <h4 className="title4 mb40">
                {data && data.employee && <>
                {
                    Object.keys(data.employee).map((k)=><li key={k}><b>{k}: </b>{data.employee[k]}</li>)
                }
                 </> }
              </h4>
            </div>
          </div>
          <div></div>
        </section>
      </main>
    );
  }
}

export default ProctoredTestUserDetail;
