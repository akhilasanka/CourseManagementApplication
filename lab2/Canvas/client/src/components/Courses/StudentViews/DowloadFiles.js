import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import download from 'downloadjs';
import { rooturl } from '../../../config/settings';


class DownloadFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileDetails: [],
            base64str: null
        }
    }

    componentWillMount() {
        var courseID = this.props.match.params.courseID;
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/files',
            params: { "courseID": courseID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                //update the state with the response data
                this.setState({
                    fileDetails: this.state.fileDetails.concat(response.data)
                });
                console.log("details data", this.state.fileDetails);
            });
    }

    downloadFile = (event, file) => {
        event.preventDefault();
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/base64str',
            params: { "fileName": file },
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

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let fileDetailsDiv = null;
        fileDetailsDiv = this.state.fileDetails.map((record, index) => {
            return (
                <tr key={index}>
                    <td><a href="" onClick={(e) => this.downloadFile(e, record.file_name)}>{record.file_name}</a></td>
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
                                    <h3>Download Files</h3>
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
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn">People</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={filesurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn active-tab">Files</button>
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
                                        {this.state.fileDetails.length > 0
                                            ?
                                            <div>
                                                <small>*click on link to download</small>
                                                <table className="table table-striped table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>File</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {fileDetailsDiv}
                                                    </tbody>
                                                </table>
                                            </div>
                                            :
                                            <div>
                                                <div class="alert alert-info" role="alert">
                                                    No files to display
                                                            </div>
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

export default DownloadFiles;

