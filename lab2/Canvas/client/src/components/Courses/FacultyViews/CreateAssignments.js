import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';


class CreateAssignments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentDetails : []
        }
    }

    componentWillMount(){
        var id = this.props.match.params.courseID;
        console.log(id);
        //var facultyID = cookie.load('cookie2');
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/assignments',     
            params: { "courseID": id },
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

    createNewAssignment = async (event) => {
        event.preventDefault();
        var id = this.props.match.params.courseID;
        console.log(this.props.match.params);
        //var facultyID = cookie.load('cookie2');
        const formData = new FormData(event.target);
        var token = localStorage.getItem("token");
       await axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/assignments',     
            data: { "courseID": id, "title": formData.get("title"), "desc": formData.get("desc")},
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

    openSubmissions = (event,assignmentID) =>{
        event.preventDefault();
     let url = window.location.href;
     window.location = url + "/" + assignmentID;
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let assignmentsDiv = this.state.assignmentDetails.map((record,index) => {
            return (
                <tr key={record._id}>
                    <td><a href="" onClick={(event)=>this.openSubmissions(event,record._id)}>{record.title}</a></td>
                    <td>{record.desc}</td>
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
                    <Navigation/>
                   
                    <div className="container">
                        
                        <div className="row justify-content-center align-items-center" >
                        
                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Assignments</h3>
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
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                    <form onSubmit={this.createNewAssignment} method="post">
                                    <div className="form-group row">
                                            <label htmlFor="title" className="col-sm-2 col-form-label">Assignmnet Title:</label>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" name="title" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                                <label htmlFor="desc" className="col-sm-2 col-form-label">Description:</label>
                                                <div className="col-sm-5">
                                                <textarea className="form-control" id="desc" name="desc" rows="3"></textarea>
                                                </div>
                                        </div>
                                        <div className="form-group row">
                                        <div className="col-sm-5">
                                         <button type="submit" className="btn btn-primary pull-right" style={{marginBottom:"5%"}}>Create Assignment</button>
                                        </div>
                                        </div>

                                    </form>
                                    {this.state.assignmentDetails.length > 0 &&
                                    <div className="border-top">
                                            <h4 style={{padding:"0.5em"}}>Uploaded Assignments</h4>
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

export default CreateAssignments;