import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './LoginAndSignup/Login';
import Signup from './LoginAndSignup/Signup';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import NewCourse from './Courses/FacultyViews/NewCourse';
import PermissionCode from './Courses/FacultyViews/PermissionCode';
import StudentCourseHome from './Courses/StudentViews/StudentCourseHome';
import FacultyCourseHome from './Courses/FacultyViews/FacultyCourseHome';
import SearchCourse from './Courses/StudentViews/SearchCourse';
import MyCourses from './Courses/StudentViews/MyCourses';
import CreateAssignments from './Courses/FacultyViews/CreateAssignments';
import CourseAssignmentSubmissions from './Courses/FacultyViews/CourseAssignmentSubmissions';
import GradeAssignment from './Courses/FacultyViews/GradeAssignment';
import ShowAssignments from './Courses/StudentViews/ShowAssignment';
import SubmitAssignments from './Courses/StudentViews/SubmitAssignments';
import CourseFileUpload from './Courses/FacultyViews/CourseFileUpload';
import DownloadFiles from './Courses/StudentViews/DowloadFiles';
import CreateQuiz from './Courses/FacultyViews/CreateQuiz';

//Create a Main Component
class Main extends Component {
    

    render(){
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
                <Route exact path="/faculty/course/:courseID/assignments/:assignmentID/student/:studentID" component={GradeAssignment}/>
                <Route exact path="/faculty/course/:courseID/assignments/:assignmentID" component={CourseAssignmentSubmissions}/>
                <Route exact path="/student/course/:courseID/assignments/:assignmentID" component={SubmitAssignments}/>
                <Route exact path="/student/course/:courseID/assignments" component={ShowAssignments}/>
                <Route exact path="/faculty/course/:courseID/assignments" component={CreateAssignments}/>
                <Route exact path="/student/course/:courseID/files" component={DownloadFiles}/>
                <Route exact path="/faculty/course/:courseID/files" component={CourseFileUpload}/>
                <Route exact path="/faculty/course/:courseID/Quiz" component={CreateQuiz}/>
                <Route exact path="/student/course/:courseID" component={StudentCourseHome}/>
                <Route exact path="/faculty/course/:courseID" component={FacultyCourseHome}/>
                
                
            </div>
        )
    }
}
//Export The Main Component
export default Main;