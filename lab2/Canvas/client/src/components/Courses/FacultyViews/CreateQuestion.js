import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './FacultyCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import Question from './QuizQuestion';


class CreateQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionNo: 1,
            addQuestion: false,
            questionDiv: null,
            questions: []
        }
    }


    addQuestion = async (event) => {
        event.preventDefault();
        var questionID = this.props.match.params.questionID;
        this.setState({ addQuestion: true });
        this.setState({ index: this.state.index + 1 });
        var quizID = this.props.match.params.quizID;
        var courseID = this.props.match.params.courseID;
        console.log(this.props.match.params);
        const formData = new FormData(event.target);
        console.log(formData.get('question'));
        await axios({
            method: 'post',
            url: 'http://localhost:3001/question',
            data: {
                quizID: quizID, question: formData.get('question'), optA: formData.get("optA"),
                optB: formData.get("optB"), optC: formData.get("optC"), answer: formData.get("answer")
            },
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                let nextQuestion = parseInt(questionID)+1;
                alert(responseData.responseMessage);
                window.location = '/faculty/course/' + courseID + '/quiz/'+quizID+'/question/'+(nextQuestion);
            }).catch(function (err) {
                console.log(err)
            });

    }

    redirect = () => {
        var courseID = this.props.match.params.courseID;
        window.location = '/faculty/course/' + courseID + '/quiz';
    }

    render() {
        var questionID = this.props.match.params.questionID;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let heading  = <div className="form-group row">
                <h6>Question {questionID}</h6>
            </div>;
         let  question = <Question />;

        let submitButton = null;
        if (questionID > 0) {
            submitButton = <div className="col-sm-5">
                <button type="button" className="btn btn-primary pull-right" onClick={(e) => this.redirect(e)} style={{ marginBottom: "5%" }}>Exit</button>
            </div>;
        }

        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />

                    <div className="container">

                        <div className="row justify-content-center align-items-center" >

                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Quiz Questions</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <CourseNav />
                                    </div>
                                    <div className="col-10">
                                        <form onSubmit={this.addQuestion} method="post">
                                            {heading}
                                            {question}
                                            <div className="form-group row border-bottom">
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary text-center" style={{ marginBottom: "5%" }} >+New question</button>
                                                </div>
                                                {submitButton}

                                            </div>
                                        </form>
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

export default CreateQuestion;
