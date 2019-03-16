import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './FacultyCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';
import Question from './QuizQuestion';


class CreateQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quizDetails: [],
            index: 0,
            addQuestion: false,
            questionDiv: null,
            questions: []
        }
    }

    componentWillMount() {
        var courseID = this.props.match.params.courseID;
        axios({
            method: 'get',
            url: 'http://localhost:3001/quiz/list',
            params: { "courseID": courseID },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then((response) => {
                //update the state with the response data
                this.setState({
                    fiquizDetailsleDetails: this.state.quizDetails.concat(response.data)
                });
                console.log("details data", this.state.quizDetails);
            });
    }

    addQuestion = (event) => {
        event.preventDefault();
        this.setState({ addQuestion: true });
        if(this.state.index>1){
        }

        this.setState({ index: this.state.index+1 });
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let quizDetailsDiv = null;
        quizDetailsDiv = this.state.quizDetails.map((record, index) => {
            return (
                <tr key={index}>
                    <td>{record.title}</td>
                </tr>
            )
        });
        let question = null;
        let heading = null;
        if (this.state.addQuestion) {
           heading = <div className="form-group row">
                        <h6>Question {this.state.index}</h6>
                      </div>;
            question = <Question />;
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
                                    <h3>Course Files Upload</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <CourseNav />
                                    </div>
                                    <div className="col-10">
                                        <form onSubmit={this.addQuiz} method="post">
                                            {heading}
                                            {question}
                                            <div className="form-group row border-bottom">
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary text-center" style={{ marginBottom: "5%" }} onClick={this.addQuestion}>+New question</button>
                                                </div>
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary pull-right" style={{ marginBottom: "5%" }}>Submit</button>
                                                </div>

                                            </div>
                                        </form>
                                        <div>
                                            <h4 style={{ padding: "0.5em" }}>Published Quizzes</h4>
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
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
