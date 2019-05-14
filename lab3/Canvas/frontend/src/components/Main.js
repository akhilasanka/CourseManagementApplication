import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Signup from './LoginAndSignup/Signup';
import Login from './LoginAndSignup/Login';
import Home from './Home/Home';
import HomeFaculty from './Home/HomeFaculty';
import Profile from './Profile/Profile';
import MyCourses from './Courses/MyCourses';
import MyCoursesFaculty from './Courses/MyCoursesFaculty';
import NewCourse from './Courses/NewCourse';

//Create a Main Component
class Main extends Component {
    

    render(){
        return(
            
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Login}/>
                <Route exact path="/login" component= {Login}/>
                <Route exact path="/signup" component={Signup}/>
                <Route exact path="/student/home" component={Home}/>
                <Route exact path="/faculty/home" component={HomeFaculty}/>
                <Route exact path="/student/profile" component={Profile}/>
                <Route exact path="/faculty/profile" component={Profile}/>
                <Route exact path="/student/course/my-courses" component={MyCourses}/>
                <Route exact path="/faculty/course/my-courses" component={MyCoursesFaculty}/>
                <Route exact path="/faculty/course/new" component={NewCourse}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;