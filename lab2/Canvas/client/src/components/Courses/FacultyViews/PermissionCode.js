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
            waitlistedStudents: [],
            waitlistCode: null,
            codeRecord: []
        }
        this.generateCode = this.generateCode.bind(this);
        this.sendCodes = this.sendCodes.bind(this);
    }

    componentWillMount() {
        var facultyID = cookie.load('cookie2');
        if (facultyID) {

            axios({
                method: 'get',
                url: 'http://localhost:3001/waitlistStudents',
                params: { "facultyID": facultyID },
                config: { headers: { 'Content-Type': 'application/json' } }
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
        let studentID = this.state.waitlistedStudents[index].student_id;
        let courseID = this.state.waitlistedStudents[index].course_id;
      await axios({
            method: 'get',
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
                this.setState({
                    waitlistCode : responseData.responseMessage
                });
                let element = JSON.stringify({studentID: studentID, courseID: courseID, waitListCode: this.state.waitlistCode});
                console.log("element",element);
                let records = this.state.codeRecord;
                records.push(element);
               console.log(records);
                this.setState = ({
                    codeRecord : records
                });
                
            }).catch(function (err) {
                console.log(err)
            });
    }

    sendCodes = async () =>{
        let data = this.state.codeRecord;
        await axios({
            method: 'put',
            url: 'http://localhost:3001/waitlistCode',
            params: { "records" : data },
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
        let code = null;
        let hide = null;
        let buttonDiv = null;
        if(this.state.waitlistCode !=null){
            code = <span>{this.state.waitlistCode}</span>;
            hide = {display : "none"};
            buttonDiv =  <button type="button" className="btn btn-primary" onClick={this.sendCodes}>Send Code(s)</button>;
        }
        else{
           
        }
        //iterate over waitlisted students under a faculty to create a table rows
        let waitlistStudentsDiv = this.state.waitlistedStudents.map((student,index) => {
            return (
                <tr key={index}>
                    <td>{student.course_id}</td>
                    <td>{student.course_name}</td>
                    <td>{student.student_id}</td>
                    <td>{student.waitlistCapacity}</td>
                    <td>
                        <button type="button" className="btn btn-primary" onClick={(e)=>this.generateCode(e,index)} style={hide}>Generate Code</button>
                        {code}
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
                                            <th>Student</th>
                                            <th>Waitlist Capacity</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {noRecordsMsgDiv}
                                    <tbody>
                                        {waitlistStudentsDiv}
                                    </tbody>
                                </table>
                               {buttonDiv}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PermissionCode;