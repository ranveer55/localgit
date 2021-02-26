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

const Auth = new AuthService();
class Router extends React.Component {
  render() {
    return (
    <Switch>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/forgotpass' component={Forgot}/>
      <ProtectedRoute path="/employee" component={Employees} />
      <ProtectedRoute path="/add-employee" component={AddEmployees} />
      <ProtectedRoute path="/employeestocourses" component={EmployeestoCourses} />
      <ProtectedRoute path="/reports" component={Reports} />
      <ProtectedRoute path="/leaderboard" component={Leaderboard} />
      <ProtectedRoute path="/daily-goal-log" component={DailyGoalLog} />
      <ProtectedRoute path="/coursedetail" component={CourseDetails} />
      <ProtectedRoute path="/courses" component={Courses} />
      {/* <ProtectedRoute path="/firebase" component={Firebase} /> */}
      {
        (typeof localStorage['access_level'] === "string") && parseInt(localStorage['access_level']) !== accessLevels.AUDITOR ?
        <ProtectedRoute path="/campaigns" component={Campaigns} /> :
        ''
      }
      <ProtectedRoute path="/chats" component={Messaging} />
      <ProtectedRoute path="/overview" component={OverView} />
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
  if(Auth.loggedIn()){
    return (<Route {...rest} render={(props) => (
      Auth.loggedIn() === true ? 
          <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />   
    )} />)
  }else{
    window.location.href = '/login';
  }
  }



export default Router;
