import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import '../cssFiles/homeNavModal.css';
import {rooturl} from '../../config/settings';


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
        var role = localStorage.getItem('cookie1');
        var id = localStorage.getItem('cookie2');
        let url = '';
        this.setState({ role: role });
        if (role === "faculty") {
            url = "http://"+rooturl+":3001/faculty/home";
            
        }
        else {
            url = "http://"+rooturl+":3001/student/home";
        }
        axios({
            method: 'get',
            url: url,
            params: { "id": id },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then((response) => {
                //update the state with the response data
                if(response.data.courses){
                this.setState({
                    courses: this.state.courses.concat(response.data.courses)
                });
                console.log("courses", this.state.courses);
            }
            });
    }

    openCourseCreationPage = () => {
        if (localStorage.getItem('cookie1') == "faculty") {
            window.location = "/faculty/course/new";
        }
    }

    searchCourses = () => {
        if (localStorage.getItem('cookie1') == "student") {
            window.location = "/student/course/search";
        }
    }


    openMyCourses = () => {
        if (localStorage.getItem('cookie1') == "student") {
            window.location = "/student/course/my-courses";
        }
    }

    openCourse = (event, courseID) => {
        if (localStorage.getItem('cookie1') == "faculty") {
            window.location = "/faculty/course/" + courseID + "/files";
        }
        if (localStorage.getItem('cookie1') == "student") {
            window.location = "/student/course/" + courseID + "/files";
        }
    }

    generatePermissionCode = () => {
        if (localStorage.getItem('cookie1') == "faculty") {
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
        if(this.state.courses.length>0){
        coursesDiv = this.state.courses.map(course => {
            return (
                <div className="row" key={course.course_id} >
                    <button type="button" className="btn btn-link float-left" onClick={(event) => this.openCourse(event, course.course_id)}>{course.dept}&nbsp;{course.course_id}</button>
                </div>
            )
        });
    }
        return (
            <div className="modal" id="course" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="false" aria-live="assertive" aria-relevant="additions" aria-atomic="false">
                <div className="modal-dialog nav-dialog" role="document">
                    <div className="modal-content nav-content">

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