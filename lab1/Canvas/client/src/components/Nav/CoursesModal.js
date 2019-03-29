import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../cssFiles/homeNavModal.css';


class CourseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            role: null
        }
        this.openCourse = this.openCourse.bind(this);
    }


    componentWillMount() {
        var role = cookie.load('cookie1');
        var id = cookie.load('cookie2');
        let url = '';
        this.setState({ role: role });
        if (role === "faculty") {
            url = "http://localhost:3001/faculty/home";
            
        }
        else {
            url = "http://localhost:3001/student/home";
        }
        axios({
            method: 'get',
            url: url,
            params: { "id": id },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then((response) => {
                //update the state with the response data
                this.setState({
                    courses: this.state.courses.concat(response.data)
                });
                console.log("courses", this.state.courses);
            });
    }

    openCourseCreationPage = () => {
        if (cookie.load('cookie1') == "faculty") {
            window.location = "/faculty/course/new";
        }
    }

    searchCourses = () => {
        if (cookie.load('cookie1') == "student") {
            window.location = "/student/course/search";
        }
    }


    openMyCourses = () => {
        if (cookie.load('cookie1') == "student") {
            window.location = "/student/course/my-courses";
        }
    }

    openCourse = (event, courseID) => {
        if (cookie.load('cookie1') == "faculty") {
            window.location = "/faculty/course/" + courseID;
        }
        if (cookie.load('cookie1') == "student") {
            window.location = "/student/course/" + courseID;
        }
    }

    generatePermissionCode = () => {
        if (cookie.load('cookie1') == "faculty") {
            window.location = "/faculty/permissionCode";
        }
    }

    render() {
        let menuDiv = null;
        if (this.state.role === "student") {
            menuDiv = <ul>
                <div className="row">
                    <button type="button" className="btn btn-link float-left" onClick={this.searchCourses}>Search/Add Courses</button>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-link float-left" onClick={this.openMyCourses}>My Courses</button>
                </div>
            </ul>;
        }
        else {
            menuDiv = <ul>
                <div className="row">
                    <button type="button" className="btn btn-link float-left" onClick={this.openCourseCreationPage}>Create new course</button>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-link float-left" onClick={this.generatePermissionCode}>Generate Permission Code</button>
                </div>

            </ul>
        }
        let coursesDiv = null;
        coursesDiv = this.state.courses.map(course => {
            return (
                <div className="row" key={course.course_id} >
                    <button type="button" className="btn btn-link float-left" onClick={(event) => this.openCourse(event, course.course_id)}>{course.dept}&nbsp;{course.course_id}</button>
                </div>
            )
        });
        return (
            <div className="modal" id="course" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="false" aria-live="assertive" aria-relevant="additions" aria-atomic="false">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="container border-bottom">
                            <div className="row ">

                                <button type="button" className="close w-100 pull-right" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" className="pull-right">&times;</span>
                                </button>
                                <h4 className="modal-title w-100 text-center" style={{ paddingBottom: "15px" }}>
                                    Courses
                                    </h4>
                            </div>
                        </div>
                        <div className="container border-bottom" style={{ paddingLeft: "0px" }}>
                            <ul >
                                {coursesDiv}
                            </ul>
                        </div>
                        {menuDiv}
                    </div>
                </div>
            </div>
        )
    }
}

export default CourseModal;