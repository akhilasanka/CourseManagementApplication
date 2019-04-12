import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';


class CreateAnnouncements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            announcementDetails : [],
            startIndex: 0,
            currentPage: 1,
            announcementsDisplaySet : [],
            pagesPerPage: 5
        }
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentWillMount(){
        var id = this.props.match.params.courseID;
        console.log(id);
        var facultyID = localStorage.getItem('cookie2');
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/announcements',     
            params: { "courseID": id , "facultyID" : facultyID },
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

                console.log("display set:",displaySet);

                //update the state with the response data
                this.setState({
                    announcementDetails : this.state.announcementDetails.concat(response.data) ,
                    announcementsDisplaySet : displaySet
                });
                console.log("details data",this.state.announcementDetails);
            });
    }

    createNewAnnouncement = async (event) => {
        event.preventDefault();
        var id = this.props.match.params.courseID;
        console.log(this.props.match.params);
        const formData = new FormData(event.target);
        var token = localStorage.getItem("token");
       await axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/announcements',     
            data: { "courseID": id, "title": formData.get("title"), "announcement": formData.get("desc")},
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
            if (startIndex >= this.state.announcementDetails.length) {
                flag = false;
                swal("No more records to show");
            }
        }

        if (flag === true) {


            var endIndex = startIndex + this.state.pagesPerPage - 1;
            var results = this.state.announcementDetails;
            var displaySet = results.filter(function (element, index) {
                return index >= startIndex && index <= endIndex;
            });
            this.setState({
                announcementsDisplaySet: displaySet,
                startIndex: startIndex
            });
        }
    }

    render() {
        let redirectVar = null;
        let role = localStorage.getItem('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let announcementDetailsDiv = this.state.announcementsDisplaySet.map((record,index) => {
            let str = record.timestamp;
            let time = str.substring(0, str.indexOf('('));
            return (
                <tr key={record._id}>
                    <td>{record.title}</td>
                    <td>{record.desc}</td>
                    <td>{time}</td>
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
                                    <h3>Announcements</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2"> 
                                    <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>
                                            <div className="row">
                                                <Link to={assignmenturl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn">Assignments</button>
                                                </Link>
                                            </div>
                                            <div className="row">
                                                <Link to={announcementsurl}>
                                                    <button type="button" className="btn btn-link float-left course-nav-btn active-tab">Announcements</button>
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
                                    <form onSubmit={this.createNewAnnouncement} method="post">
                                    <div className="form-group row">
                                            <label htmlFor="title" className="col-sm-2 col-form-label">Announcement Title:</label>
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
                                         <button type="submit" className="btn btn-primary pull-right" style={{marginBottom:"5%"}}>Create Announcement</button>
                                        </div>
                                        </div>

                                    </form>
                                    {this.state.announcementDetails.length > 0 &&
                                    <div className="border-top">
                                            <h4 style={{padding:"0.5em"}}>Published Announcements</h4>
                                            <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Announcement</th>
                                            <th>Date/Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {announcementDetailsDiv}
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

export default CreateAnnouncements;