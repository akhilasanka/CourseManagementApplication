import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';


class QuizQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quizDetails: []
        }
    }

    componentWillMount() {
        var quizID = this.props.match.params.quizID;
        console.log(quizID);
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/student/quiz/questions',
            params: { "quizID": quizID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then((response) => {
                //update the state with the response data
                this.setState({
                    quizDetails: this.state.quizDetails.concat(response.data)
                });
                console.log("details data", this.state.quizDetails);
            });
    }

    evaluate = (event) => {
        event.preventDefault();
        let quizDetails = this.state.quizDetails;
        let totalquestions = quizDetails.length;
        const formData = new FormData(event.target);
        let correct = 0;
        let index=0;
        while (index < quizDetails.length) { 
           let questionID = quizDetails[index].id;
           if(quizDetails[index].answer === formData.get(questionID)){
               correct++;
           }
           index++;
        }
        console.log(correct);
        swal("Score : "+correct+"/"+totalquestions);
        var token = localStorage.getItem("token");
        var quizID = this.props.match.params.quizID;
        var studentID = localStorage.getItem('cookie2');
        var courseID = this.props.match.params.courseID;
        axios({
            method: 'put',
            url: 'http://'+rooturl+':3001/student/quiz/grade',
            params: { "quizID": quizID, "studentID": studentID, "courseID": courseID,
                 "marks": correct, "total": totalquestions },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then((response) => {
                console.log(response);
            });

    }

    render() {
        let redirectVar = null;
        let role = localStorage.getItem('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let quiz = null;
        quiz = this.state.quizDetails.map((record, index) => {
            return (
                <div className="form-group row">
                    <li key={record.id}>
                        <label htmlFor={record.id} className="row" style={{marginLeft:"1em",marginBottom:"1.5em"}}>{record.question}</label>
                        <div className="row">
                            <ul style={{listStyleType:"none"}}>
                                <li style={{marginBottom:"0.5em"}}>
                            <label> <input type="radio" name={record.id} value="a" required style={{marginLeft:"2em"}}/>{record.optA}</label>&nbsp;&nbsp;
                            </li>
                            <li style={{marginBottom:"0.5em"}}>
                            <label> <input type="radio" name={record.id} value="b" style={{marginLeft:"2em"}}/>{record.optB}</label>&nbsp;&nbsp;
                            </li>
                            <li style={{marginBottom:"0.5em"}}>
                            <label> <input type="radio" name={record.id} value="c" style={{marginLeft:"2em"}}/>{record.optC}</label>
                            </li>
                            </ul>
                         </div>
                    </li>
                </div>
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
                                    <h3>Quiz</h3>
                                </div>
                                <div className="row">
                                    <form onSubmit={this.evaluate}>
                                    <div className="col-12">
                                        <ol>
                                            {quiz}
                                        </ol>
                                        <div className="form-group row ">
                                         <button type="submit" class="btn btn-primary pull-right" style={{marginLeft:"5em",marginTop:"2em"}}>Submit</button>
                                        </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default QuizQuestions;