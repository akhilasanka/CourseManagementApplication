import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../Nav/Nav';
import '../cssFiles/course.css';
import {Nav, Tab, Row, Col} from 'react-bootstrap';

class Course extends Component {
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
        let coursehomeurl = url + "/home";
        let CourseHome = null;

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
                        <ul>
                            <Link to="">
                            <div>
                                <li>Assignments</li>
                            </div>
                            </Link>
                        </ul>

                       {/* <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                            <Row>
                                <Col sm={3}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link eventKey="first">Tab 1</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="second">Tab 2</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="first">
                                            <h1>1</h1>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                            <h2>2</h2>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                        <div className="tab-container">
                            <div className="row" >
                                <nav role="navigation col-2 list-view" aria-label="Courses navigation menu" style={{ marginRight: "3em" }}>
                                    <ul className="nav nav-pills flex-column">
                                        <li className="nav-item">
                                            <a className="nav-link" eventKey="first" data-toggle="pill" >Home</a>
                                            {CourseHome}
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#announcements">Announcements</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#assignments">Assignments</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#quizzes">Quizzes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#people">People</a>
                                        </li>
                                    </ul>
                                </nav>
                                <div class="col-9">
                                    <h1> this is announcements</h1>
                                </div>
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default Course;