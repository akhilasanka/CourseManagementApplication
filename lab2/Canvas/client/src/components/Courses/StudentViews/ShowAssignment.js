import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';

class ShowAssignments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentDetails : [],
            startIndex: 0,
            currentPage: 1,
            assignmentsDisplaySet : [],
            pagesPerPage: 5
        }
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentWillMount(){
        var id = this.props.match.params.courseID;
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/assignments',     
            params: { "courseID": id },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                var records = this.state.pagesPerPage - 1;
                    var results = response.data;
                    console.log(results);
                    var displaySet = results.filter(function (element, index) {
                        console.log(records);
                        return index <= records;
                    });

                    console.log(displaySet);

                this.setState({
                    assignmentDetails : this.state.assignmentDetails.concat(response.data),
                    assignmentsDisplaySet : displaySet 
                });
                console.log("details data",this.state.assignmentDetails);
            });
    }


    openSubmissions = (event,assignmentID) =>{
        event.preventDefault();
     let url = window.location.href;
     window.location = url + "/" + assignmentID;
    }

    handlePagination(event) {

        var target = event.target;
        var id = target.id;
        var flag = true;
        if (id == "prev") {
            if (this.state.startIndex > 0) {
                console.log("start index", this.state.startIndex);
                console.log("pages per page", this.state.pagesPerPage);
                var startIndex = this.state.startIndex - this.state.pagesPerPage;
            }
            else {
                flag = false;
                swal("No more records to show");
            }
        }
        else {
            var startIndex = this.state.startIndex + this.state.pagesPerPage;
            if (startIndex >= this.state.assignmentDetails.length) {
                flag = false;
                swal("No more records to show");
            }
        }

        if (flag === true) {


            var endIndex = startIndex + this.state.pagesPerPage - 1;
            var results = this.state.assignmentDetails;
            var displaySet = results.filter(function (element, index) {
                return index >= startIndex && index <= endIndex;
            });
            this.setState({
                assignmentsDisplaySet: displaySet,
                startIndex: startIndex
            });
        }
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let assignmentsDiv = this.state.assignmentsDisplaySet.map((record,index) => {
            return (
                <tr key={record._id}>
                    <td><a href="" onClick={(event)=>this.openSubmissions(event,record._id)}>{record.title}</a></td>
                    <td>{record.desc}</td>
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
                                            <div className="row">
                                                <Link to={gradesurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn">Grades</button>
                                                </Link>
                                            </div>
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                    {this.state.assignmentDetails.length > 0 ?
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
                                <div className="pagination-container center-content">
                                                <span className="col-lg-2 col-md-3 col-sm-12 col-xs-12 pad-bot-10">
                                                    <button className="btn btn-primary btn-sm" id="prev" onClick={this.handlePagination}>Prev</button>
                                                </span>
                                                <span className="col-lg-2 col-md-3 col-sm-12 col-xs-12 pad-bot-10">
                                                    <button className="btn btn-primary btn-sm float-right" style={{ marginRight: "1.5em" }} id="next" onClick={this.handlePagination} >Next</button>
                                                </span>
                                            </div>
                                        </div>
                                        :
                                        <div class="alert alert-info" role="alert">
                                            No assignments to display
                                        </div>}
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