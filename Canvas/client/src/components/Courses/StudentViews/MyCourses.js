import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../../Nav/Nav';

class MyCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseDetails : []
        }
    }
    componentWillMount(){
        var id = cookie.load('cookie2');
        axios({
            method: 'get',
            url: 'http://localhost:3001/student/course/details',     
            params: { "id": id },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    courseDetails : this.state.courseDetails.concat(response.data) 
                });
                console.log("details data",this.state.courseDetails);
            });
    }

    drop = async (event,courseID) => {
        event.preventDefault();
        let studentID = cookie.load('cookie2');
        await axios({
            method: 'delete',
            url: 'http://localhost:3001/student/course/delete',     
            params: {courseID : courseID, studentID : studentID},
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
                alert(responseData.responseMessage);
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
        let courseDetailsDiv = this.state.courseDetails.map((record,index) => {
            const getStyle = (status) =>{
                if(status === 'W'){
                    return {display : 'block'};
                }else{
                    return {display : 'none'};
                }

            }
            return (
                <tr key={record.index} className="course-list">
                    <td>{record.courseID}</td>
                    <td>{record.courseName}</td>
                    <td>{record.dept}</td>
                    <td>{record.courseTerm}</td>
                    <td>{record.status}</td>
                    <td>{record.room}</td>
                    <td>{record.facultyName}</td>
                    <td>{record.facultyEmail}</td>
                    
                    <td>
                    <button type="button" className="btn btn-primary" onClick={(e)=>this.drop(e,record.courseID)}>Drop</button> 
                    </td>
                    <td >
                        <div style={getStyle(record.status)}>
                    <button type="button" className="btn btn-primary" onClick={(e)=>this.enroll(e)}>Apply Code</button>
                    </div>
                    </td>
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
                                    <h3>My Courses</h3>
                                </div>
                                <small>*W indicates waitlist, E indicates enrolled</small>
                                <table className="table table-striped table-bordered course-table">
                                    <thead>
                                        <tr>
                                            <th>Course ID</th>
                                            <th>Course Name</th>
                                            <th>Department</th>
                                            <th>Term</th>
                                            <th>Status</th>
                                            <th>Class Room</th>
                                            <th>Faculty Name</th>
                                            <th>Faculty Email</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseDetailsDiv}
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

export default MyCourses;