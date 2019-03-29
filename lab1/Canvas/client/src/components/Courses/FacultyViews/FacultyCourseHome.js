import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseNav.css';
import {Nav, Tab, Row, Col} from 'react-bootstrap';
import CourseNav from './FacultyCourseNav';

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

        return (
           <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation/>
                   
                    <div className="container">
                        
                        <div className="row justify-content-center align-items-center" >
                        
                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Home</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2"> 
                                    <CourseNav/>
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

export default Course;