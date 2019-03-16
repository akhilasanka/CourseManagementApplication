import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseNav.css';
import {Nav, Tab, Row, Col} from 'react-bootstrap';

class CourseNavFaculty extends Component {
    constructor(props) {
        super(props);
        
    }
   

    render() {
        let courseID = null;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (!role) {
            redirectVar = <Redirect to="/login" />;
        }
        let url = window.location.href;
        let coursehomeurl = "/faculty/course/"+url.substr(url.lastIndexOf('/') + 1) + "/assignments";
        let filesurl = "/faculty/course/"+url.substr(url.lastIndexOf('/') + 1) + "/files";
        let quizurl = "/faculty/course/"+url.substr(url.lastIndexOf('/') + 1) + "/quiz";
        let announcementsurl = "/faculty/course/"+url.substr(url.lastIndexOf('/') + 1) + "/announcements";
        let peopleurl = "/faculty/course/"+url.substr(url.lastIndexOf('/') + 1) + "/people";
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                        <ul style={{listStyleType:"none", paddingLeft:"0px"}}>
                            <div className="row">
                            <Link to={coursehomeurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn btn-assignment">Assignments</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to={announcementsurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Announcements</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {peopleurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">People</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {filesurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Files</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {quizurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn">Quiz</button>
                            </Link>
                            </div>
                        </ul>
                        
                    </div>
                    </div>
        )
    }
}

export default CourseNavFaculty;