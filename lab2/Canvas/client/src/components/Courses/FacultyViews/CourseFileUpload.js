import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import swal from 'sweetalert';
import download from 'downloadjs';
import { rooturl } from '../../../config/settings';


class CourseFileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: '',
            fileDetails:[],
            base64str: null
        }
    }

    componentWillMount(){
        var courseID = this.props.match.params.courseID;
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/files',     
            params: { "courseID": courseID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    fileDetails : this.state.fileDetails.concat(response.data) 
                });
                console.log("details data",this.state.fileDetails);
            });
    }
    
    onChange = (e) => {
        switch (e.target.name) {
            case 'selectedFile':
                this.setState({ selectedFile: e.target.files[0] });
                break;
            default:
                this.setState({ [e.target.name]: e.target.value });
        }
    }

    uploadFile = async (event) => {
        event.preventDefault();
        var courseID = this.props.match.params.courseID;

        let formData = new FormData();
        formData.append('courseID', courseID);
        formData.append('selectedFile', this.state.selectedFile);
        var token = localStorage.getItem("token");

        console.log(this.props.match.params);
        await axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/files/upload',     
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                swal(responseData.responseMessage);
                window.location.reload();
            }).catch(function (err) {
                console.log(err)
            }); 
    }

    downloadFile = (event, file) => {
        event.preventDefault();
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/file/base64str',
            params: { "fileName": file },
            config: { headers: { 'Content-Type': 'application/json' } }
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
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let fileDetailsDiv = null;
        fileDetailsDiv = this.state.fileDetails.map((record,index) => {
            return (
                <tr key={index}>
                    <td><button className="btn btn-link" onClick={(e)=>this.downloadFile(e, record.file_name)}>{record.file_name}</button></td>
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
                                    <h3>Course Files Upload</h3>
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
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                        <form onSubmit={this.uploadFile} encType="multipart/form-data" method="post">
                                            <div className="form-group row">
                                                <label htmlFor="file" className="col-sm-2 col-form-label">File Upload:</label>
                                                <div className="col-sm-5">
                                                    <input type="file" className="form-control" name="selectedFile" required onChange={this.onChange} accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary pull-right" style={{ marginBottom: "5%" }}>Submit</button>
                                                </div>
                                            </div>

                                        </form>
                                        {this.state.fileDetails.length > 0 &&
                                        <div className="border-top">
                                            <h4 style={{ padding: "0.5em" }}>Uploaded Files</h4>
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

export default CourseFileUpload;
