import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';

class SubmitAssignments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: '',
            assignmentDetails:[]
        }
    }

    componentWillMount(){
        var courseID = this.props.match.params.courseID;
        var studentID = localStorage.getItem('cookie2');
        var assignmentID = this.props.match.params.assignmentID;
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/student/assignmentSubmissions',     
            params: { "courseID": courseID , "studentID" : studentID, "assignmentID": assignmentID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    assignmentDetails : this.state.assignmentDetails.concat(response.data) 
                });
                console.log("details data",this.state.assignmentDetails);
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

    openSubmissions = (event,record) =>{
        event.preventDefault();
     let url = window.location.href;
     window.location = url + "/assignmentFile/"+record._id;
    }

    submitAssignment = async (event) => {
        event.preventDefault();
        const formDataCurrent = new FormData(event.target);
        var courseID = this.props.match.params.courseID;
        var studentID = localStorage.getItem('cookie2');
        var studentName = localStorage.getItem('cookie3');
        var assignmentID = this.props.match.params.assignmentID;
        var comments = formDataCurrent.get('desc');

        let formData = new FormData();
        formData.append('courseID', courseID);
        formData.append('studentID', studentID);
        formData.append('studentName', studentName);
        formData.append('assignmentID', assignmentID);
        formData.append('comments', comments);
        formData.append('selectedFile', this.state.selectedFile);

        console.log(this.props.match.params);
        var token = localStorage.getItem("token");
        await axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/assignments/upload',     
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

    render() {
        let redirectVar = null;
        let role = localStorage.getItem('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let submissionDiv = this.state.assignmentDetails.map((record,index) => {
            let str = record.timestamp;
            let time = str.substring(0, str.indexOf('('));
            return (
                <tr key={record._id}>
                    <td><a href="" onClick={(event)=>this.openSubmissions(event,record)}>{record.file_name}</a></td>
                    <td>{record.comments}</td>
                    <td>{time}</td>
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
                                    <h3>Assignment Submission</h3>
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
                                            <div className="row">
                                                <Link to={gradesurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Grades</button>
                                                </Link>
                                            </div>
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                        <form onSubmit={this.submitAssignment} encType="multipart/form-data" method="post">
                                            <div className="form-group row">
                                                <label htmlFor="file" className="col-sm-2 col-form-label">File Upload:</label>
                                                <div className="col-sm-5">
                                                    <input type="file" className="form-control" name="selectedFile" required onChange={this.onChange} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="desc" className="col-sm-2 col-form-label">Comments:</label>
                                                <div className="col-sm-5">
                                                    <textarea className="form-control" id="desc" name="desc" rows="3"></textarea>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary pull-right" style={{ marginBottom: "5%" }}>Submit</button>
                                                </div>
                                            </div>

                                        </form>
                                        {this.state.assignmentDetails.length > 0 &&
                                        <div className="border-top">
                                            <h4 style={{ padding: "0.5em" }}>Past Submissions</h4>
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>File</th>
                                                        <th>Comments</th>
                                                        <th>Time of submission</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {submissionDiv}
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

export default SubmitAssignments;
