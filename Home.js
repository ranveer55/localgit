import React from "react";

class Home extends React.Component {
    render() {
    
        return (
            <main id="content">
            <div className="bg_gradient bg_content"></div>
            <section className="section_salute_box">
                <div className="section_salute_wrap">
                    <h1 className="title1 salute_title">Hello There.</h1>
                    <p className="salute_descr">This page seems a little bit empty. Why don't we start by adding in some of your employees information?</p>
                    <div className="salute_img">
                        <img src="images/img.svg" alt="" />
                    </div>
                    <a className="btn btn-blue btn-radius" href="/employee">
                        <span>Add Employees</span>
                    </a>
                </div>
            </section>
        </main>
        );
      }
}

export default Home;
