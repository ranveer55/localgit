
import React, { Component } from "react";
import Table from '../../components/Table'
import { Container, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
class BusinessEnglishCourse extends Component {
    constructor(props) {
        super(props);

        this.courseId = props.match.params.courseId;
        this.state = {
            data: [],
            course: null
        };
    }

    componentDidMount() {
        this.loadData(1);
    }

    loadData(page) {
        const company_code =localStorage.getItem('company_code');
        this.setState({
            loading: true,
        });
        global.api
            .getBusinessEnglishCourseDetail(this.courseId, company_code)
            .then((data) => {
                this.setState({
                    loading: false,
                    data: data && data.registered && data.registered.length > 0 ? data.registered : [],
                   
                });
                // this.setState({ batchData: data });
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                });
            });
    }

   

    btnComponent = (row) => {
        return (
            <td>
                <Link to={`/business-english/course/${row.courseNumber}`}>
                <Button size="small" variant="contained" color="primary">
                    Detail
                </Button>
                </Link>
            </td>
        )
    }

    render() {

        const headCells = [
            { id: 'userId', numeric: false, disablePadding: false, label: 'Email' },
            { id: 'FirstName', numeric: false, disablePadding: false, label: 'First Name' },
            { id: 'LastName', numeric: false, disablePadding: false, label: 'Last Name' },
            { id: 'dateRegistered', numeric: false, disablePadding: false, label: 'Register Time' },
            { id: 'lessonsCompleted', numeric: false, disablePadding: false, label: 'Lessons Completed' },
            { id: 'currentMilestone', numeric: false, disablePadding: false, label: 'Current Milestone' },
            { id: 'totalScore', numeric: true, disablePadding: false, label: 'Score' }
        ];

        const { data, loading, course } = this.state;
        return (
            <>
                <Container>
                    <Typography variant="h4" component="h4" style={{ marginTop: 20, marginBottom: 20 }}>
                        Business English Course
                        
                    </Typography>
                    <Typography variant="h6"  style={{ marginBottom: 20 }}> Course No. :  {this.courseId }</Typography>
                    <Table headCells={headCells} rows={data} loading={loading} />
                </Container>


            </>
        );
    }
}

export default BusinessEnglishCourse;
