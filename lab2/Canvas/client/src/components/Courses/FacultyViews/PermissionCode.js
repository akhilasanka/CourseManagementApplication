import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';


class PermissionCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            waitlistedStudents: []
        }
        this.generateCode = this.generateCode.bind(this);
    }

    componentWillMount() {
        var facultyID = cookie.load('cookie2');
        if (facultyID) {
            var token = localStorage.getItem("token");
            axios({
                method: 'get',
                url: 'http://localhost:3001/waitlistStudents',
                params: { "facultyID": facultyID },
                config: { headers: { 'Content-Type': 'application/json' } },
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
                    this.setState({
                        waitlistedStudents: this.state.waitlistedStudents.concat(responseData)
                    });
                    console.log(this.state.waitlistedStudents);
                }).catch(function (err) {
                    console.log(err)
                });
        }
    }

    generateCode = async (event,index) =>{
        event.preventDefault();
        let studentID = this.state.waitlistedStudents[index].student_id;
        let courseID = this.state.waitlistedStudents[index].course_id;
      await axios({
            method: 'put',
            url: 'http://localhost:3001/generateWaitlistCode',
            params: { "studentID": studentID, "courseID":courseID },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                return response.data;
            })
            .then((responseData) => {
                console.log(responseData);
                swal(responseData.responseMessage);
                window.location.reload();
            }).catch(function (err) {
                console.log(err)
            });
    }

    render() {

        let redirectVar = null;
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        //iterate over waitlisted students under a faculty to create a table rows
        let waitlistStudentsDiv = this.state.waitlistedStudents.map((student,index) => {
            return (
                <tr key={index}>
                    <td>{student.course_id}</td>
                    <td>{student.course_name}</td>
                    <td>{student.term}</td>
                    <td>{student.student_name}</td>
                    <td>{student.waitlistCapacity}</td>
                    <td>
                        {student.waitlistCode !== '' ?
                         <span>{student.waitlistCode}</span> 
                          :
                          <button type="button" className="btn btn-primary generate-code-btn" onClick={(e)=>this.generateCode(e,index)}>Generate & Save Code</button>
                        }
                    </td>
                </tr>
            )
        });
        let noRecordsMsgDiv = null;
        if(this.state.waitlistedStudents.length === 0){
            noRecordsMsgDiv = <tr><small>*No records to disply</small></tr>
        }
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                    <Navigation />

                    <div className="container">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop:"2%" }}>
                                    <h3>Waitlist Students</h3>
                                </div>
                                
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Course ID</th>
                                            <th>Course Name</th>
                                            <th>Term</th>
                                            <th>Student</th>
                                            <th>Waitlist Capacity</th>
                                            <th>Waitlist Code</th>
                                        </tr>
                                    </thead>
                                    {noRecordsMsgDiv}
                                    <tbody>
                                        {waitlistStudentsDiv}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PermissionCode;