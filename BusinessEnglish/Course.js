
import React, { Component } from "react";
import Table from '../../components/Table'
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom'
import CloudDownload from '@material-ui/icons/CloudDownload';

const headCells = [
    { id: 'userId', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'FirstName', numeric: false, disablePadding: false, label: 'First Name' },
    { id: 'LastName', numeric: false, disablePadding: false, label: 'Last Name' },
    { id: 'dateRegistered', numeric: false, disablePadding: false, label: 'Register Time' },
    { id: 'lessonsCompleted', numeric: false, disablePadding: false, label: 'Lessons Completed' },
    { id: 'currentMilestone', numeric: false, disablePadding: false, label: 'Current Milestone' },
    { id: 'totalScore', numeric: true, disablePadding: false, label: 'Score' }
];
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
        const company_code = localStorage.getItem('company_code');
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
            <Link to={`/business-english/course/${row.courseNumber}`}>
                <Button size="small" variant="contained" color="primary">
                    Detail
                </Button>
            </Link>
        )
    }

    downloadCSV = () => {
        let heading = headCells.map((item) => item.label);

        let csv = [
            ...heading,
            "\n",
        ].join(",");

        let { data } = this.state;
        data = data.map((item) => {
            return headCells.map((cell) => item && item[cell.id] != undefined ? item[cell.id] : '')
        })
        data.forEach(function (row) {
            csv += row.join(",");
            csv += "\n";
        });
        var hiddenElement = document.createElement("a");
        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        hiddenElement.target = "_blank";

        //provide the name for the CSV file to be downloaded
        hiddenElement.download = `${this.courseId}.csv`;
        hiddenElement.click();
    }

    render() {



        const { data, loading, course } = this.state;
        return (
            <>
                <Container>
                    <Typography variant="h4" component="h4" style={{ marginTop: 20, marginBottom: 20 }}>
                        Business English Course

                    </Typography>
                    <Typography variant="h6" style={{ marginBottom: 20 }}> Course No. :  {this.courseId}</Typography>
                    <Grid
                        justify="space-between" // Add it here :)
                        container
                        spacing={24}
                        style={{marginBottom:'20px'}}
                    >
                        <Grid container item xs={8} />
                        <Grid container item xs={4}  justify="flex-end">
                            <Button variant="contained"
                            align="right" 
                                color="primary"
                                startIcon={<CloudDownload />}
                                onClick={this.downloadCSV}>Download CSV</Button>

                        </Grid>
                    </Grid>


                    <Table headCells={headCells} rows={data} loading={loading} />
                </Container>


            </>
        );
    }
}

export default BusinessEnglishCourse;
