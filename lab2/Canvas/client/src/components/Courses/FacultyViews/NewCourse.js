import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';
import { rooturl, clienturl } from '../../../config/settings';

class NewCourse extends Component {
    constructor(props) {
        super(props);
    }

    createNewCourse = async (event) => {
        event.preventDefault();
        var facultyID = localStorage.getItem('cookie2');
		var facultyName = localStorage.getItem('cookie3');
        const formData = new FormData(event.target);
        var token = localStorage.getItem("token");
       await axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/course/new',     
            data: { "id": formData.get("courseID"), "name": formData.get("name"), "dept": formData.get("dept"), 
                    "desc": formData.get("desc"), "room": formData.get("room"), "capacity": formData.get("capacity"), 
                    "waitlistCapacity": formData.get("waitlistCapacity"), "courseTerm": formData.get("term"),"faculty_id" : facultyID , "faculty_name" : facultyName },
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
                //document.getElementById("newCourseForm").reset();
                if(responseData.responseMessage === "Successfully Added!"){
                window.location.href = 'http://'+clienturl+":3000/faculty/home";
                swal(responseData.responseMessage);
                }
                else{
                swal(responseData.responseMessage);   
                }
            }).catch(function (err) {
                console.log(err)
            }); 
    }

    render() {

        let redirectVar = null;
        if (!localStorage.getItem('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        return (
            <div>
                {redirectVar}
                    <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                        <Navigation />

                        <div className="container">
                            <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>


                                <div className="col-12">
                                    <div className="border-bottom row" style={{ marginBottom: "3%" }}>
                                        <h3 >New Course</h3>
                                    </div>
                                    <form onSubmit={this.createNewCourse} id="newCourseForm" method="post">
                                    <div className="form-group row">
                                            <label htmlFor="courseID" className="col-sm-2 col-form-label">Course ID:</label>
                                            <div className="col-sm-5">
                                                <input type="number" className="form-control" name="courseID" required />
                                            </div>
                                        </div>
                                    <div className="form-group row">
                                            <label htmlFor="name" className="col-sm-2 col-form-label">Course Name:</label>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" name="name" required />
                                            </div>
                                        </div>
                                    <div className="form-group row">
                                            <label htmlFor="dept" className="col-sm-2 col-form-label">Department:</label>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" name="dept" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                                <label htmlFor="desc" className="col-sm-2 col-form-label">Description:</label>
                                                <div className="col-sm-5">
                                                <textarea class="form-control" id="desc" name="desc" rows="3"></textarea>
                                                </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="room" className="col-sm-2 col-form-label">Room No:</label>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" name="room" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="capacity" className="col-sm-2 col-form-label">Total Class Capacity:</label>
                                            <div className="col-sm-5">
                                                <input type="number" className="form-control" name="capacity" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="waitlistCapacity" className="col-sm-2 col-form-label">Waitlist Capacity:</label>
                                            <div className="col-sm-5">
                                                <input type="number" className="form-control" name="waitlistCapacity" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="Term" className="col-sm-2 col-form-label">Term:</label>
                                            <div className="col-sm-5 radio">
                                                <label> <input type="radio" name="term" value="fall" required/>Fall</label>&nbsp;&nbsp;
                                        <label> <input type="radio" name="term" value="spring"/>Spring</label>
                                            </div>
                                        </div>
                                        <div className="form-group row text-center">
                                         <button type="submit" class="btn btn-primary align-center">Create Course</button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

            </div>
        )
    }
}

export default NewCourse;