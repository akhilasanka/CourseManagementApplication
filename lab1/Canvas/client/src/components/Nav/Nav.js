import React, { Component } from 'react';
import '../cssFiles/homeNav.css';
import img from '../images/sjsu.PNG';
import AccountModal from './AccountModal';
import CourseModal from './CoursesModal';
import cookie from 'react-cookies';

class Nav extends Component {
    constructor(props){
        super(props);
    }
    openHomePage = () => {
        if (cookie.load('cookie1') == "faculty") {
            window.location = "/faculty/home";
        }
        if (cookie.load('cookie1') == "student") {
            window.location = "/student/home";
        }
    }

    render() {
        return (
            <div className="navigation main-nav">
                <nav className="navsidebar">
                    <ul className="nav navbar-nav" style={{height:"100vmax"}}>
                        <li className="nav-item border-bottom">

                            <img src={img} height="80px" width="77px" alt="SJSU" />
                        </li>
                        <li className="nav-item border-bottom">
                            <a className="nav-link" href="#" data-toggle="modal" data-target="#profile" data-placement="right" onClick={this.addAccountinfo}><i className="fa fa-user"></i><br />
                                Account </a>
                                <AccountModal/>
                        </li>

                        <li className="nav-item border-bottom">
                            <a className="nav-link" href="#" onClick={this.openHomePage}><i className="fa fa-list-alt"></i><br />
                                Dashboard</a>
                        </li>
                        <li className="nav-item border-bottom">
                            <a className="nav-link" href="#" data-toggle="modal" data-target="#course" data-placement="right"><i className="fa fa-book"></i><br />
                                Courses</a>
                                <CourseModal />
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Nav;