import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';


class CreateQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quizDetails : []
        }
    }

    componentWillMount(){
        var courseID = this.props.match.params.courseID;
        console.log(courseID);
        var facultyID = cookie.load('cookie2');
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/quiz',     
            params: { "courseID": courseID , "facultyID" : facultyID },
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

    createNewQuiz = async (event) => {
        event.preventDefault();
        var id = this.props.match.params.courseID;
        console.log(this.props.match.params);
        const formData = new FormData(event.target);
        var token = localStorage.getItem("token");
       await axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/quiz',     
            data: { "courseID": id, "title": formData.get("title"), "points": formData.get("points")},
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

    publishQuiz = (event,quizID) => {
        var token = localStorage.getItem("token");
        axios({
            method: 'put',
            url: 'http://'+rooturl+':3001/quiz',     
            params: { quizID: quizID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
                .then((response) => {
                    swal(response.data.responseMessage);
            }).then(()=>{
                window.location.reload();
            }
                
            )

    }

    openQuestions = (event,quizID) =>{
        event.preventDefault();
     let url = window.location.href;
     window.location = url + "/" + quizID+"/question/1";
    }

    getRow = (isPublished) => {
        if(isPublished === 1){
            return "Yes";
        }
        else{
            return "No";
        }
    }
    getStyle = (isPublished) => {
        if(isPublished === 1){
            return {display:"none"};
        }
        else{
            return {display:"block"};
        }
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let quizDetailsDiv = this.state.quizDetails.map((record,index) => {
             var publishRow = null;
            if(record.isPublished){
                publishRow = <span>Published</span>;
            }
            else{
                publishRow = <button type="button" className="btn btn-primary" onClick={(event)=>this.publishQuiz(event,record._id)} style={this.getStyle(record.isPublished)}>Publish</button>;
            }
            return (
                <tr key={record.id}>
                    <td><a href="" onClick={(event)=>this.openQuestions(event,record._id)}>{record.title}</a></td>
                    <td>{record.points}</td>
                    <td>{this.getRow(record.isPublished)}</td>
                    <td>{publishRow}</td>
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
                                    <h3>Quizzes</h3>
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
                                        </ul>
                                    </div>
                                    <div className="col-10">
                                    <form onSubmit={this.createNewQuiz} method="post">
                                    <div className="form-group row">
                                            <label htmlFor="title" className="col-sm-2 col-form-label">Quiz Title:</label>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" name="title" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                                <label htmlFor="points" className="col-sm-2 col-form-label">Points:</label>
                                                <div className="col-sm-5">
                                                <input type="number" className="form-control" id="points" name="points"/>
                                                </div>
                                        </div>
                                        <div className="form-group row">
                                                <label htmlFor="publishTo" className="col-sm-2 col-form-label">Publish to:</label>
                                        <div className="col-sm-5">
                                                    <select className="form-control" name="publishTo" style={{padding:"0em",width:"50%"}}>
                                                        <option value="all">All Students</option>
                                                    </select>
                                                    </div>
                                                </div>
                                        <div className="form-group row border-bottom">
                                        <div className="col-sm-5">
                                         <button type="submit" className="btn btn-primary pull-right" style={{marginRight:"6em",marginBottom:"5%"}}>Create Quiz</button>
                                        </div>
                                        </div>

                                    </form>
                                    <div>
                                            <h4 style={{padding:"0.5em"}}>Quizzes</h4>
                                            <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Points</th>
                                            <th>Is Published?</th>
                                            <th>Publish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizDetailsDiv}
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

export default CreateQuiz;