import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';

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
        var studentID = cookie.load('cookie2');
        var assignmentID = this.props.match.params.assignmentID;
        axios({
            method: 'get',
            url: 'http://localhost:3001/myassignmentSubmissions',     
            params: { "courseID": courseID , "studentID" : studentID, "assignmentID": assignmentID },
            config: { headers: { 'Content-Type': 'application/json' } }
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

    submitAssignment = async (event) => {
        event.preventDefault();
        const formDataCurrent = new FormData(event.target);
        var courseID = this.props.match.params.courseID;
        var studentID = cookie.load('cookie2');
        var assignmentID = this.props.match.params.assignmentID;
        var comments = formDataCurrent.get('desc');

        let formData = new FormData();
        formData.append('courseID', courseID);
        formData.append('studentID', studentID);
        formData.append('assignmentID', assignmentID);
        formData.append('comments', comments);
        formData.append('selectedFile', this.state.selectedFile);

        console.log(this.props.match.params);
        await axios({
            method: 'post',
            url: 'http://localhost:3001/assignments/upload',     
            data: formData,
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
                alert(responseData.responseMessage);
                window.location.reload();
            }).catch(function (err) {
                console.log(err)
            }); 
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let submissionDiv = this.state.assignmentDetails.map((record,index) => {
            return (
                <tr key={record.id}>
                    <td>{record.file_name}</td>
                    <td>{record.comments}</td>
                </tr>
            )
            });
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
                                        <CourseNav />
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
                                            <div className="form-group row border-bottom">
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary pull-right" style={{ marginBottom: "5%" }}>Submit</button>
                                                </div>
                                            </div>

                                        </form>
                                        <div>
                                            <h4 style={{ padding: "0.5em" }}>Past Submissions</h4>
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>File</th>
                                                        <th>Comments</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {submissionDiv}
                                                </tbody>
                                            </table>
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

export default SubmitAssignments;
