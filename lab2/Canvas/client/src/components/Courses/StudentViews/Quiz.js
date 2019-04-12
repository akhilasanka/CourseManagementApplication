import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import { rooturl } from '../../../config/settings';


class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quizDetails : []
        }
    }

    componentWillMount(){
        var courseID = this.props.match.params.courseID;
        console.log(courseID);
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/student/quiz',     
            params: { "courseID": courseID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    quizDetails : this.state.quizDetails.concat(response.data) 
                });
                console.log("details data",this.state.quizDetails);
            });
    }

    openQuizQuestionsPage = (event,quizID) =>{
        event.preventDefault();
     let url = window.location.href;
     window.location = url + "/" + quizID;
    }
    
    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let quizDetailsDiv = this.state.quizDetails.map((record,index) => {
            return (
                <tr key={record.id}>
                    <td><a href="" onClick={(event)=>this.openQuizQuestionsPage(event,record._id)}>{record.title}</a></td>
                    <td>{record.points}</td>
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
                                    <h3>Quizzes</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2"> 
                                    <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>
                                            <div className="row">
                                                <Link to={assignmenturl}>
                                                    <button type="button" className="btn  btn-link float-left course-nav-btn ">Assignments</button>
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
                                                    <button type="button" className="btn btn-link float-left course-nav-btn active-tab">Quiz</button>
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
                                    {this.state.quizDetails.length > 0 ?
                                   
                                   <div>
                                            <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizDetailsDiv}
                                    </tbody>
                                </table>
                                        </div>
                                        :
                                        <div class="alert alert-info" role="alert">
                                            No quizzes available to display
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

export default Quiz;