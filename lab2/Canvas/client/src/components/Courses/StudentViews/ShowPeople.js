import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseNav.css';
import swal from 'sweetalert';


class ShowPeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentDetails: [],
            startIndex: 0,
            currentPage: 1,
            pagesPerPage: 5,
            studentDisplaySet: []
        }
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentWillMount() {
        var id = this.props.match.params.courseID;
        console.log(id);
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://localhost:3001/course/students',
            params: { "courseID": id },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                //update the state with the response data
                var records = this.state.pagesPerPage - 1;
                var students = this.state.studentDetails.concat(response.data);
                var studentsResult = students.filter(function (student, index) {
                    return index <= records;
                });

                console.log(studentsResult);
                this.setState({
                    studentDisplaySet: studentsResult,
                    studentDetails: response.data
                });
                console.log("details data", this.state.studentDetails);
            });
    }

    handlePagination(event) {

        var target = event.target;
        var id = target.id;
        var flag = true;
        if (id == "prev") {
            if (this.state.startIndex > 0) {
                console.log("start index", this.state.startIndex);
                console.log("pages per page", this.state.pagesPerPage);
                var startIndex = this.state.startIndex - this.state.pagesPerPage;
            }
            else {
                flag = false;
                swal("No more records to show");
            }
        }
        else {
            var startIndex = this.state.startIndex + this.state.pagesPerPage;
            if (startIndex >= this.state.studentDetails.length) {
                flag = false;
                swal("No more records to show");
            }
        }

        if (flag === true) {


            var endIndex = startIndex + this.state.pagesPerPage - 1;
            var students = this.state.studentDetails;
            var studentsResult = this.state.studentDetails.filter(function (student) {
                var index = students.indexOf(student);
                return index >= startIndex && index <= endIndex;
            });
            this.setState({
                studentDisplaySet: studentsResult,
                startIndex: startIndex
            });
        }
    }

    render() {
        var id = this.props.match.params.courseID;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let studentDetailsDiv = this.state.studentDisplaySet.map((record, index) => {
            return (
                <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.dept} {id}</td>
                    <td>Student</td>
                </tr>
            )
        });
        let assignmenturl = "/student/course/" + this.props.match.params.courseID + "/assignments";
        let filesurl = "/student/course/" + this.props.match.params.courseID + "/files";
        let announcementsurl = "/student/course/" + this.props.match.params.courseID + "/announcements";
        let peopleurl = "/student/course/" + this.props.match.params.courseID + "/people";
        let quizurl = "/student/course/" + this.props.match.params.courseID + "/quiz";
        let gradesurl = "/student/course/" + this.props.match.params.courseID + "/grade";
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />

                    <div className="container">

                        <div className="row justify-content-center align-items-center" >

                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>People</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>
                                            <div className="row">
                                                <Link to={assignmenturl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn ">Assignments</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={announcementsurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Announcements</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={peopleurl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn active-tab">People</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={filesurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Files</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={quizurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Quiz</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={gradesurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Grades</button>
                                                </Link>
                                            </div>
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                        <div>
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Course</th>
                                                        <th>Role</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {studentDetailsDiv}
                                                </tbody>
                                            </table>
                                            <div className="pagination-container center-content">
                                                <span className="col-lg-2 col-md-3 col-sm-12 col-xs-12 pad-bot-10">
                                                    <button className="btn btn-primary btn-sm" id="prev" onClick={this.handlePagination}>Prev</button>
                                                </span>
                                                <span className="col-lg-2 col-md-3 col-sm-12 col-xs-12 pad-bot-10">
                                                    <button className="btn btn-primary btn-sm float-right" style={{ marginRight: "1.5em" }} id="next" onClick={this.handlePagination} >Next</button>
                                                </span>
                                            </div>
                                        </div>
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

export default ShowPeople;




