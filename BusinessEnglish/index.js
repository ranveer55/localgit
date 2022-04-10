import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from '../../components/Table'
import { Container, Typography, Button } from '@material-ui/core';
class BusinessEnglish extends Component {

    constructor(props) {
        super(props);

        this.cohortId = props.match.params.cohortId;

        this.companyCode = global.companyCode;

        this.state = {
            dateLoaded: false,
            cohort: null,
            dateLoaded: false,
            startDate: new Date(moment().subtract(1, "week")),
            endDate: new Date(moment()),
            users: [],
            data: [],
        };

        this.state.selectedCompany = global.companyCode;
        this.state.selectedCompanyName = global.companyName;
    }

    componentDidMount() {
        this.loadData(this.state.startDate, this.state.endDate);


    }
    downloadCSV(data) {

        //define the heading for each row of the data  
        var csv = ['Email', 'First Name', 'Last Name', 'Questions Answered', 'Attempts', 'Asked for Review', 'Reviews Completed', '\n'].join(",");

        //merge the data with CSV  
        data.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = `${this.state.cohort.name}.csv`;
        hiddenElement.click();
    }

    loadData(startDate, endDate) {
        this.setState({
            loading: true
        });
        global.api.getBusinessEnglishTest(global.companyCode)
            .then(
                data => {
                    let resData =  data.data
                    let filterData = resData.filter((item)=> item.type_id == '4')
                    this.setState({
                        loading: false,
                        data: filterData,
                    });
                    // this.setState({ batchData: data });
                })
            .catch(err => {
                this.setState({
                    loading: true
                });
            });
    }

    btnComponent = (row) => {
        return (
                <Link to={`/business-english/${row.id}`}>
                <Button size="small" variant="contained" color="primary">
                    View Course
                </Button>
                </Link>
        )
    }



    render() {

        const headCells = [
            { id: 'name', numeric: false, disablePadding: false, label: 'Cohort Name' },
            { id: 'start_date', numeric: true, disablePadding: false, label: 'Start Date' },
            { id: 'btn', numeric: false, disablePadding: false, label: 'Detail', component: this.btnComponent },
        ];

        const { data, loading, cohort } = this.state;

        return (
            <>
                <Container>
                    <Typography variant="h4" component="h4" style={{ marginTop: 20, marginBottom: 20 }}>
                    Business English Tests

                    </Typography>
                    <Typography variant="h6" style={{ marginBottom: 20 }}></Typography>
                    <Table headCells={headCells} rows={data} loading={loading} />
                </Container>


            </>
        );
    }
}

export default BusinessEnglish;