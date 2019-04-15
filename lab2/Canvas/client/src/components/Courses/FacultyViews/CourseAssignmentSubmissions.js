import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import download from 'downloadjs';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';

class CourseAssignmentSubmissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submissionDetails: [],
            base64str: null,
            startIndex: 0,
            currentPage: 1,
            submissionsDisplaySet : [],
            pagesPerPage: 5
        }
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentWillMount() {
        var id = this.props.match.params.assignmentID;
        var courseID = this.props.match.params.courseID;
        console.log("id:", id);
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/assignmentsubmissions',
            params: { "assignmentID": id, "courseID": courseID },
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
                    submissionDetails: this.state.submissionDetails.concat(response.data),
                    submissionsDisplaySet : displaySet
                });
                console.log("details data", this.state.submissionDetails);
            });
    }

    openSubmissions = (event, record) => {
        event.preventDefault();
        let url = window.location.href;
        window.location = url + "/student/" + record.student_id + "/assignmentFile/" + record._id;
    }

    downloadFile = (event, file) => {
        event.preventDefault();
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/assignmentsubmission/file/base64str',
            params: { "fileName": file, "isAssignment": true },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                return response.data.base64str;
            }).then((base64str) => {
                this.setState({
                    base64str: base64str
                });
                let arr = null;
                if (this.state.base64str != null) {
                    arr = _base64ToArrayBuffer(this.state.base64str);
                    download(arr, file, "text/plain");
                }
            }).catch(function (err) {
                console.log(err)
            });

        function _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
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
            if (startIndex >= this.state.submissionDetails.length) {
                flag = false;
                swal("No more records to show");
            }
        }

        if (flag === true) {


            var endIndex = startIndex + this.state.pagesPerPage - 1;
            var results = this.state.submissionDetails;
            var displaySet = results.filter(function (element, index) {
                return index >= startIndex && index <= endIndex;
            });
            this.setState({
                submissionsDisplaySet: displaySet,
                startIndex: startIndex
            });
        }
    }

    render() {
        let redirectVar = null;
        let role = localStorage.getItem('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let submissionDiv = this.state.submissionsDisplaySet.map((record, index) => {
            let str = record.timestamp;
            let time = str.substring(0, str.indexOf('('));
            return (
                <tr key={record._id}>

                    <td>{record.student_id}</td>
                    <td>{record.student_name}</td>
                    <td><a href="" onClick={(event) => this.openSubmissions(event, record)}>{record.file_name}</a></td>
                    <td>{time}</td>
                    <td>{record.marks}</td>
                    <td><button type="button" className="btn btn-primary" onClick={(e) => this.downloadFile(e, record.file_name)}>Download</button> </td>
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
                                    <h3>Assignment Submissions</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>
                                            <div className="row">
                                                <Link to={assignmenturl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn active-tab">Assignments</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={announcementsurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Announcements</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={peopleurl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn">People</button>
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
                                        {this.state.submissionDetails.length > 0
                                            ?
                                            (
                                                <div>
                                                    <table className="table table-striped table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Student ID</th>
                                                                <th>Student Name</th>
                                                                <th>File</th>
                                                                <th>Time of Submission</th>
                                                                <th>Marks</th>
                                                                <th>Download File</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {submissionDiv}
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
                                            (
                                                <div class="alert alert-info" role="alert">
                                                    No submissions yet to display
                                                            </div>
                                            )
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

export default CourseAssignmentSubmissions;