import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import {Nav, Row, Col} from 'react-bootstrap';
var classNames = require('classnames');

class CourseNavFaculty extends Component {
    constructor(props) {
        super(props);
        this.state={
            active : null
        }
    }

    click() {
		this.setState({active: true});
	}
    
    render() {
        let courseID = null;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (!role) {
            redirectVar = <Redirect to="/login" />;
        }
        console.log(this.state.active);
        let classes = classNames('btn btn-link float-left course-nav-btn');
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
                            <button type="button" className={classes} onClick={this.click.bind(this)}>Assignments</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to={announcementsurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn active-css ">Announcements</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {peopleurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn ">People</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {filesurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn ">Files</button>
                            </Link>
                            </div>
                            <div className="row">
                            <Link to= {quizurl}>
                            <button type="button" className="btn btn-link float-left course-nav-btn  ">Quiz</button>
                            </Link>
                            </div>
                        </ul>
                        
                    </div>
                    </div>
        )
    }
}

export default CourseNavFaculty;