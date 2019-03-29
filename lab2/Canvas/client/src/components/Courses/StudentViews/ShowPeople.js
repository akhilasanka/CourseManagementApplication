import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';


class ShowPeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentDetails : []
        }
    }

    componentWillMount(){
        var id = this.props.match.params.courseID;
        console.log(id);
        axios({
            method: 'get',
            url: 'http://localhost:3001/people',     
            params: { "courseID": id },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    studentDetails : this.state.studentDetails.concat(response.data) 
                });
                console.log("details data",this.state.studentDetails);
            });
    }

    render() {
        var id = this.props.match.params.courseID;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let studentDetailsDiv = this.state.studentDetails.map((record,index) => {
            return (
                <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.dept} {id}</td>
                    <td>Student</td>
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
                                    <h3>People</h3>
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
                                            <th>Name</th>
                                            <th>Course</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentDetailsDiv}
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

export default ShowPeople;