import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';

class ShowAssignments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentDetails : []
        }
    }

    componentWillMount(){
        var id = this.props.match.params.courseID;
        axios({
            method: 'get',
            url: 'http://localhost:3001/myassignments',     
            params: { "courseID": id },
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


    openSubmissions = (event,assignmentID) =>{
        event.preventDefault();
     let url = window.location.href;
     window.location = url + "/" + assignmentID;
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let assignmentsDiv = this.state.assignmentDetails.map((record,index) => {
            return (
                <tr key={record.id}>
                    <td><a href="" onClick={(event)=>this.openSubmissions(event,record.id)}>{record.title}</a></td>
                    <td>{record.desc}</td>
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
                                    <h3>Assignments</h3>
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
                                            <th>Title</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignmentsDiv}
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

export default ShowAssignments;