import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AuthService from './components/AuthService';
import Employees from "./pages/Employees";
import AddEmployees from "./pages/AddEmployee";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmployeestoCourses from "./pages/EmployeestoCourses";
import Reports from "./pages/Reports";
import Forgot from "./pages/Forgot";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";
// import Firebase from "./pages/Firebase";
import Campaigns from "./pages/Campaigns";
import OverView from "./pages/OverView";
import Messaging from './pages/messaging/Messaging';
import accessLevels from './config/access_levels';
import Leaderboard from './pages/Leaderboard';
import DailyGoalLog from './pages/DailyGoalLog';
import CourseRegistrationReport from './pages/CourseRegistrationReport';
import CompanyRegistrationReport from './pages/CompanyRegistrationReport';
import CompanyActivationReport from './pages/CompanyActivationReport';
import Program from './pages/Program';
import CompanyRegActReport from './pages/CompanyRegActReport';
import CompanyCohortsReport from './pages/CompanyCohortsReport';
import CompanyCohortsMistakeReport from './pages/CompanyCohortsMistakeReport';
import CompanyCohortsMistakeDetailReport from './pages/CompanyCohortsMistakeDetailReport';
import CohortDetail from './pages/CohortDetail';
import UserCohortDetail from './pages/UserCohortDetail';
import CohortRegisterCSV from './pages/CohortRegisterCSV';
import CompanyCohortsPlacementMistakeReport from './pages/CompanyCohortsPlacementMistakeReport';
import CompanyCohortsPlacementMistakeDetailReport from './pages/CompanyCohortsPlacementMistakeDetailReport';
import CompanyCohortCreate from './pages/CompanyCohortCreate';
import CompanyUserTimeLogReport from './pages/CompanyUserTimeLogReport';
import InterviewSimulatorPage from './pages/InterviewSimulator';
import InterviewSimulatorCohortPage from './pages/InterviewSimulatorCohort';
import InterviewSimulatorCohortUserAttempsPage from './pages/InterviewSimulatorCohortUserAttempts';
import InterviewSimulatorCohortUserAttempsAiReviewPage from './pages/InterviewSimulatorCohortUserAttemptsAiReviewPage';

const Auth = new AuthService();
class Router extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/forgotpass' component={Forgot} />
        <ProtectedRoute path="/students" component={Employees} />
        <ProtectedRoute path="/add-student" component={AddEmployees} />
        <ProtectedRoute path="/employeestocourses" component={EmployeestoCourses} />
        <ProtectedRoute path="/reports" component={Reports} />
        <ProtectedRoute path="/leaderboard" component={Leaderboard} />
        <ProtectedRoute path="/registration-report-by-company" component={CompanyRegistrationReport} />
        <ProtectedRoute path="/regact-report-by-company" component={CompanyRegActReport} />
        <ProtectedRoute path="/company-cohorts/mistakes/:cohortId/user/:userId" component={CompanyCohortsMistakeDetailReport} />
        <ProtectedRoute path="/time-log/:cohortId/user/:userId" component={CompanyUserTimeLogReport} />
        <ProtectedRoute path="/company-cohorts/mistakes" component={CompanyCohortsMistakeReport} />
        <ProtectedRoute path="/company-cohorts/placement-mistakes/:cohortId/user/:userId" component={CompanyCohortsPlacementMistakeDetailReport} />
        <ProtectedRoute path="/company-cohorts/placement-mistakes" component={CompanyCohortsPlacementMistakeReport} />
        <ProtectedRoute path="/company-cohorts/new" component={CompanyCohortCreate} />
        <ProtectedRoute path="/company-cohorts" component={CompanyCohortsReport} />
        <ProtectedRoute path="/interview-simulator/:cohortId/user-attempts/:userId/:attemptId" component={InterviewSimulatorCohortUserAttempsAiReviewPage} />
        <ProtectedRoute path="/interview-simulator/:cohortId/user-attempts/:userId" component={InterviewSimulatorCohortUserAttempsPage} />
        <ProtectedRoute path="/interview-simulator/:cohortId" component={InterviewSimulatorCohortPage} />
        <ProtectedRoute path="/interview-simulator" component={InterviewSimulatorPage} />
        <ProtectedRoute path="/cohort-detail/:cohortId" component={CohortDetail} />
        <ProtectedRoute path="/cohort-csv-register/:cohortId" component={CohortRegisterCSV} />
        <ProtectedRoute path="/user-cohort-detail/:cohortId/:userId" component={UserCohortDetail} />
        <ProtectedRoute path="/course-registration-report" component={CourseRegistrationReport} />
        <ProtectedRoute path="/activation-report-by-company" component={CompanyActivationReport} />
        <ProtectedRoute path="/daily-goal-log" component={DailyGoalLog} />
        <ProtectedRoute path="/coursedetail" component={CourseDetails} />
        <ProtectedRoute path="/courses" component={Courses} />
        {/* <ProtectedRoute path="/firebase" component={Firebase} /> */}
        {
          (typeof localStorage['access_level'] === "string") && parseInt(localStorage['access_level']) !== accessLevels.AUDITOR ?
            <ProtectedRoute path="/campaigns" component={Campaigns} /> : ''
        }
        <ProtectedRoute path="/chats" component={Messaging} />
        <ProtectedRoute path="/overview" component={OverView} />
        <ProtectedRoute path="/program" component={Program} />
        <ProtectedRoute path="/" component={OverView} />

        <Route
          render={function () {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}
const ProtectedRoute = ({ component: Component, ...rest }) => {
  if (Auth.loggedIn()) {
    return (<Route {...rest} render={(props) => (
      Auth.loggedIn() === true ?
        <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />)
  } else {
    window.location.href = '/login';
  }
}



export default Router;
