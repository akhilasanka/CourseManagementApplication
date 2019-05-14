import React, { Component } from 'react';
import '../cssFiles/homeNavModal.css';


class CourseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: null
        }
        this.openCourse = this.openCourse.bind(this);
    }


    componentWillMount() {
        if(localStorage.getItem("cookie1")==="student"){
            this.setState({role: "student"});
        }
        else{
            this.setState({role: "faculty"});
        }
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
        if (localStorage.getItem('cookie1') == "faculty") {
            window.location = "/faculty/course/my-courses";
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
                    <button type="button" className="btn btn-link float-left" onClick={this.openMyCourses}>My Courses</button>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-link float-left" onClick={this.openCourseCreationPage}>Create new course</button>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-link float-left" onClick={this.generatePermissionCode}>Generate Permission Code</button>
                </div>

            </ul>
        }
        
        return (
            <div className="modal" id="course" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" aria-live="assertive" aria-relevant="additions" aria-atomic="false">
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
                        {menuDiv}
                    </div>
                </div>
            </div>
        )
    }
}

export default CourseModal;