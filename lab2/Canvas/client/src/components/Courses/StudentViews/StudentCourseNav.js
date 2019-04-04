import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import {Nav, Tab, Row, Col} from 'react-bootstrap';

class StudentCourseNav extends Component {
    constructor(props) {
        super(props);
        
    }
   

    render() {
        let url = window.location.href;
        let assignmenturl = "/student/course/"+url.substr(url.lastIndexOf('/') + 1) + "/assignments";
        let filesurl = "/student/course/"+url.substr(url.lastIndexOf('/') + 1) + "/files";
        let announcementsurl = "/student/course/"+url.substr(url.lastIndexOf('/') + 1) + "/announcements";
        let peopleurl = "/student/course/"+url.substr(url.lastIndexOf('/') + 1) + "/people";
        let quizurl = "/student/course/"+url.substr(url.lastIndexOf('/') + 1) + "/quiz";
        let gradesurl = "/student/course/"+url.substr(url.lastIndexOf('/') + 1) + "/grade";
        return (
            <div>
                        <ul style={{listStyleType:"none", paddingLeft:"0px"}}>
                            <div className="row">
                            <Link to={assignmenturl}>
                            <button type="button" className="btn  btn-link float-left course-nav-btn ">Assignments</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {announcementsurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Announcemts</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {peopleurl}>
                            <button type="button" className="btn  btn-link float-left course-nav-btn">People</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to={filesurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn btn-assignment ">Files</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to={quizurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Quiz</button>
                            </Link>
                            <Link to={gradesurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Grades</button>
                            </Link>
                            </div>
                        </ul>
                        
                    </div>
        )
    }
}

export default StudentCourseNav;