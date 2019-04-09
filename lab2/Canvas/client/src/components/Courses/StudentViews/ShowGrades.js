import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseNav.css';


class ShowGrades extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gradeDetails : []
        }
    }

    componentWillMount(){
        var id = cookie.load('cookie2');
        var courseID = this.props.match.params.courseID;
        console.log(id);
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://localhost:3001/student/grades',     
            params: { "studentID": id, "courseID": courseID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    gradeDetails : this.state.gradeDetails.concat(response.data.grades) 
                });
                console.log("details data",this.state.gradeDetails);
            });
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let gradeDetailsDiv = this.state.gradeDetails.map((record,index) => {
            return (
                <tr key={record._id}>
                    <td>{record.graded_for} : {record.title}</td>
                    <td>{record.marks}</td>
                    <td>{record.total}</td>
                </tr>
            )
            });
        let assignmenturl = "/student/course/"+this.props.match.params.courseID+ "/assignments";
        let filesurl = "/student/course/"+this.props.match.params.courseID+ "/files";
        let announcementsurl = "/student/course/"+this.props.match.params.courseID+ "/announcements";
        let peopleurl = "/student/course/"+this.props.match.params.courseID+ "/people";
        let quizurl = "/student/course/"+this.props.match.params.courseID+ "/quiz";
        let gradesurl = "/student/course/"+this.props.match.params.courseID+ "/grade";
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation/>
                   
                    <div className="container">
                        
                        <div className="row justify-content-center align-items-center" >
                        
                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Grades</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2"> 
                                    <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>
                                            <div className="row">
                                                <Link to={assignmenturl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn ">Assignments</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={announcementsurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Announcements</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={peopleurl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn">People</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={filesurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Files</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={quizurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Quiz</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={gradesurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn active-tab">Grades</button>
                                                </Link>
                                            </div>
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                    {this.state.gradeDetails.length>0
                                                        ?
                                                        (
                                    <div>
                                    <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Graded For</th>
                                            <th>Marks Obtained</th>
                                            <th>Total Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradeDetailsDiv}
                                    </tbody>
                                </table>
                                        </div>)
                                        :
                                        (
                                    <div class="alert alert-info" role="alert">
                                        No grades to display
                                    </div>
                                     )
                                    }
                                        </div>
                                        
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        )
    }

}

export default ShowGrades;