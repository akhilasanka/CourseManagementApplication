import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './LoginAndSignup/Login';
import Signup from './LoginAndSignup/Signup';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Profile2 from './Profile/Profile2';
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
import CreateAnnouncements from './Courses/FacultyViews/CreateAnnouncements';
import ShowAnnouncements from './Courses/StudentViews/ShowAnnouncements';
import ShowPeople from './Courses/StudentViews/ShowPeople';
import ShowStudents from './Courses/FacultyViews/ShowStudents';
import ViewAssignmentFile from './Courses/StudentViews/ViewAssignmentFile';
import CreateQuestion from './Courses/FacultyViews/CreateQuestion';
import Quiz from './Courses/StudentViews/Quiz';
import QuizQuestions from './Courses/StudentViews/QuizQuestions';
import Inbox from './Inbox/Inbox';

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
                <Route exact path="/student/inbox" component={Inbox}/>
                <Route exact path="/faculty/inbox" component={Inbox}/>
                <Route exact path="/student/course/search" component={SearchCourse}/>
                <Route exact path="/student/course/my-courses" component={MyCourses}/>
                <Route exact path="/faculty/course/:courseID/assignments/:assignmentID/student/:studentID/assignmentFile/:submissionID" component={GradeAssignment}/>
                <Route exact path="/faculty/course/:courseID/assignments/:assignmentID" component={CourseAssignmentSubmissions}/>
                <Route exact path="/student/course/:courseID/assignments/:assignmentID/assignmentFile/:submissionID" component={ViewAssignmentFile}/>
                <Route exact path="/student/course/:courseID/assignments/:assignmentID" component={SubmitAssignments}/>
                <Route exact path="/student/course/:courseID/assignments" component={ShowAssignments}/>
                <Route exact path="/faculty/course/:courseID/assignments" component={CreateAssignments}/>
                <Route exact path="/student/course/:courseID/files" component={DownloadFiles}/>
                <Route exact path="/faculty/course/:courseID/files" component={CourseFileUpload}/>
                <Route exact path="/student/course/:courseID/quiz/:quizID" component={QuizQuestions}/>
                <Route exact path="/student/course/:courseID/quiz" component={Quiz}/>
                
                <Route exact path="/faculty/course/:courseID/quiz" component={CreateQuiz}/>
                <Route exact path="/faculty/course/:courseID/quiz/:quizID/question/:questionID" component={CreateQuestion}/>
                <Route exact path="/faculty/course/:courseID/announcements" component={CreateAnnouncements}/>
                <Route exact path="/student/course/:courseID/announcements" component={ShowAnnouncements}/>
                <Route exact path="/student/course/:courseID/people" component={ShowPeople}/>
                <Route exact path="/faculty/course/:courseID/people" component={ShowStudents}/>
                <Route exact path="/student/course/:courseID" component={StudentCourseHome}/>
                <Route exact path="/faculty/course/:courseID" component={FacultyCourseHome}/>
                
                
            </div>
        )
    }
}
//Export The Main Component
export default Main;