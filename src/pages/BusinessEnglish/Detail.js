
import React, { Component } from "react";
import Table from '../../components/Table'
import { Container, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
class BusinessEnglishDetail extends Component {
    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;
        this.state = {
            data: [],
            cohort: null
        };
    }

    componentDidMount() {
        this.loadData(1);
    }

    loadData(page) {
        this.setState({
            loading: true,
        });
        global.api
            .getBusinessEnglishDetail(this.cohortId, page)
            .then((data) => {
                this.setState({
                    loading: false,
                    data: data && data.course && data.course.length > 0 ? data.course : [],
                    cohort: data.cohort ?? null
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
                <Link to={`/business-english/course/${row.courseNumber}`}>
                <Button size="small" variant="contained" color="primary">
                    Detail
                </Button>
                </Link>
        )
    }

    render() {

        const headCells = [
            { id: 'courseName', numeric: false, disablePadding: false, label: 'Course Name' },
            { id: 'courseNumber', numeric: true, disablePadding: false, label: 'Course Number' },
            { id: 'moduleNo', numeric: true, disablePadding: true, label: 'Module No' },
            { id: 'courseStartDate', numeric: false, disablePadding: false, label: 'Start Date' },
            { id: 'enrolled', numeric: true, disablePadding: false, label: 'Enrolled' },
            { id: 'module_level', numeric: true, disablePadding: false, label: 'Level' },
            { id: 'btn', numeric: false, disablePadding: false, label: 'Detail', component: this.btnComponent },
        ];

        const { data, loading, cohort } = this.state;
        return (
            <>
                <Container>
                    <Typography variant="h4" component="h4" style={{ marginTop: 20, marginBottom: 20 }}>
                        Cohort Course

                    </Typography>
                    <Typography variant="h6">Name:  {cohort ? cohort.name : ''}</Typography>
                    <Typography variant="h6" style={{ marginBottom: 20 }}>Instructor Emails: {cohort ? cohort.instructorEmails : ''}</Typography>
                    <Table headCells={headCells} rows={data} loading={loading} />
                </Container>


            </>
        );
    }
}

export default BusinessEnglishDetail;
