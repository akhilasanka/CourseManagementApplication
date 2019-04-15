import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseNav.css';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';

class ShowStudents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentDetails: [],
            startIndex: 0,
            currentPage: 1,
            studentsDisplaySet : [],
            pagesPerPage: 5
        }
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentWillMount() {
        var id = this.props.match.params.courseID;
        console.log(id);
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/course/students',
            params: { "courseID": id },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {

                var records = this.state.pagesPerPage - 1;
                var results = response.data;
                console.log(results);
                var displaySet = results.filter(function (element, index) {
                    console.log(records);
                    return index <= records;
                });

                console.log(displaySet);

                //update the state with the response data
                this.setState({
                    studentDetails: this.state.studentDetails.concat(response.data),
                    studentsDisplaySet : displaySet
                });
                console.log("details data", this.state.studentDetails);
            });
    }


    drop = async (event, studentID, status) => {
        event.preventDefault();
        var courseID = this.props.match.params.courseID;
        await axios({
            method: 'delete',
            url: 'http://'+rooturl+':3001/student/course/delete',
            params: { courseID: courseID, studentID: studentID, status: status },
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                //console.log(responseData);
                swal(responseData.responseMessage);
                window.location.reload();
            }).catch(function (err) {
                console.log(err)
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
            var results = this.state.studentDetails;
            var displaySet = results.filter(function (element, index) {
                return index >= startIndex && index <= endIndex;
            });
            this.setState({
                studentsDisplaySet: displaySet,
                startIndex: startIndex
            });
        }
    }

    render() {
        var id = this.props.match.params.courseID;
        let redirectVar = null;
        let role = localStorage.getItem('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let noRecordsMsgDiv = null;
        if (this.state.studentDetails.length === 0) {
            noRecordsMsgDiv = <tr><small>*No records to disply</small></tr>
        }
        let studentDetailsDiv = this.state.studentsDisplaySet.map((record, index) => {
            let arr = record.courses;
            var course = arr.filter(function (element, index) {
                return element.course_id == id;
            });
            console.log(course);
            console.log(course[0].status);
            return (
                <tr key={record._id}>
                    <td>{record.name}</td>
                    <td>{course[0].dept} {id}</td>
                    <td>{course[0].status}</td>
                    <td>Student</td>
                    <td><button type="button" className="btn btn-primary" onClick={(e) => this.drop(e, record._id, course[0].status)}>Drop</button> </td>
                </tr>
            )
        });
        let assignmenturl = "/faculty/course/" + this.props.match.params.courseID + "/assignments";
        let filesurl = "/faculty/course/" + this.props.match.params.courseID + "/files";
        let announcementsurl = "/faculty/course/" + this.props.match.params.courseID + "/announcements";
        let peopleurl = "/faculty/course/" + this.props.match.params.courseID + "/people";
        let quizurl = "/faculty/course/" + this.props.match.params.courseID + "/quiz";
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
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                    {this.state.studentDetails.length>0
                                                        ?
                                                        (
                                        <div>
                                            {noRecordsMsgDiv}
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Course</th>
                                                        <th>Status</th>
                                                        <th>Role</th>
                                                        <th></th>
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
                                                        )
                                                        :
                                                        <div class="alert alert-info" role="alert">
                                                                There are no registered students yet
                                                            </div>
                                    }
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

export default ShowStudents;