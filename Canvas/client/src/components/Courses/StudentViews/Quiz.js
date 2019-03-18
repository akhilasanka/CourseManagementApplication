import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';
import swal from 'sweetalert';


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
        axios({
            method: 'get',
            url: 'http://localhost:3001/student/quiz',     
            params: { "courseID": courseID },
            config: { headers: { 'Content-Type': 'application/json' } }
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
                    <td><a href="" onClick={(event)=>this.openQuizQuestionsPage(event,record.id)}>{record.title}</a></td>
                    <td>{record.points}</td>
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
                                    <h3>Quizzes</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2"> 
                                    <CourseNav />
                                    </div>
                                    <div className="col-10">
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