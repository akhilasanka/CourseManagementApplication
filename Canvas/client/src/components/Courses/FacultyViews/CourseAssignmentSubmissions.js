import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './FacultyCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';

class CourseAssignmentSubmissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submissionDetails : []
        }
    }

    componentWillMount(){
        var id = this.props.match.params.assignmentID;
        var courseID = this.props.match.params.courseID;
        console.log("id:",id);
        axios({
            method: 'get',
            url: 'http://localhost:3001/assignmentsubmissions',     
            params: { "assignmentID": id , "courseID":courseID },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    submissionDetails : this.state.submissionDetails.concat(response.data) 
                });
                console.log("details data",this.state.submissionDetails);
            });
    }

    openSubmissions = (event,record) =>{
        event.preventDefault();
     let url = window.location.href;
     window.location = url + "/student/" + record.student_id;
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let submissionDiv = this.state.submissionDetails.map((record,index) => {
            return (
                <tr key={record.id}>
                    
                    <td>{record.student_id}</td>
                    <td><a href="" onClick={(event)=>this.openSubmissions(event,record)}>{record.file_name}</a></td>
                    <td>{record.marks}</td>
                </tr>
            )
            });
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation/>
                   
                    <div className="container">
                        
                        <div className="row justify-content-center align-items-center" >
                        
                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Assignment Submissions</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2"> 
                                    <CourseNav/>
                                    </div>
                                    <div className="col-10">
                                    <div>
                                            <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>File</th>
                                            <th>Marks</th>
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

export default CourseAssignmentSubmissions;