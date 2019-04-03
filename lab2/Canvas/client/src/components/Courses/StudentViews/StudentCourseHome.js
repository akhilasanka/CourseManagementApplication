import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import {Nav, Tab, Row, Col} from 'react-bootstrap';

class StudentCourseHome extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (!role) {
            redirectVar = <Redirect to="/login" />;
        }
        let url = window.location.href;
        let coursehomeurl = "/student/course/"+url.substr(url.lastIndexOf('/') + 1) + "/assignments";
        let filesurl = "/student/course/"+this.props.match.params.courseID+ "/files";
        let announcementsurl = "/student/course/"+this.props.match.params.courseID+ "/announcements";
        let peopleurl = "/student/course/"+this.props.match.params.courseID+ "/people";
        let quizurl = "/student/course/"+this.props.match.params.courseID+ "/quiz";
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />
                    <div className="container">
                        <div className="row justify-content-center align-items-center" >
                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3 >Course</h3>
                                </div>
                            </div>
                        </div>
                        <ul style={{listStyleType:"none", paddingLeft:"0px"}}>
                            <div className="row">
                            <Link to={coursehomeurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Assignments</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {announcementsurl}>
                            <button type="button" className="btn active btn-link float-left course-nav-btn">Announcemts</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {peopleurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">People</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to={filesurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Files</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to={quizurl}>
                            <button type="button" className="btn  btn-link float-left course-nav-btn">Quiz</button>
                            </Link>
                            </div>
                        </ul>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default StudentCourseHome;