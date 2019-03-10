import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './LoginAndSignup/Login';
import Signup from './LoginAndSignup/Signup';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import NewCourse from './Courses/FacultyViews/NewCourse';
import PermissionCode from './Courses/FacultyViews/PermissionCode';
import Course from './Courses/Course';
import SearchCourse from './Courses/StudentViews/SearchCourse';
import MyCourses from './Courses/StudentViews/MyCourses';

//Create a Main Component
class Main extends Component {
    

    render(){
        //let user = {'username': this.state.username , 'role': this.state.role }
        return(
            
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Login}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={Signup}/>
                <Route exact path="/student/home" component={Home}/>
                <Route exact path="/faculty/home" component={Home}/>
                <Route exact path="/student/profile" component={Profile}/>
                <Route exact path="/faculty/profile" component={Profile}/>
                <Route exact path="/faculty/course/new" component={NewCourse}/>
                <Route exact path="/faculty/permissionCode" component={PermissionCode}/>
                <Route exact path="/student/course/search" component={SearchCourse}/>
                <Route exact path="/student/course/my-courses" component={MyCourses}/>
                <Route exact path="/student/course/:courseID" component={Course}/>
                <Route exact path="/faculty/course/:courseID" component={Course}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;