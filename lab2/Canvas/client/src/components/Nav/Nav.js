import React, { Component } from 'react';
import '../cssFiles/homeNav.css';
import img from '../images/sjsu.PNG';
import AccountModal from './AccountModal';
import CourseModal from './CoursesModal';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

class Nav extends Component {
    constructor(props){
        super(props);
        this.state = {
            inboxURL : null
        }
    }

    componentWillMount(){
        if(localStorage.getItem('cookie1')=="student"){
            this.setState({inboxURL: "/student/inbox"});
        }
        if(localStorage.getItem('cookie1')=="faculty"){
            this.setState({inboxURL: "/faculty/inbox"});
        }
    }

    openHomePage = () => {
        if (localStorage.getItem('cookie1') == "faculty") {
            window.location = "/faculty/home";
        }
        if (localStorage.getItem('cookie1') == "student") {
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
                        <li className="nav-item border-bottom">
                            <a className="nav-link" href={this.state.inboxURL} ><i className="fa fa-inbox"></i><br />
                                Inbox</a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Nav;