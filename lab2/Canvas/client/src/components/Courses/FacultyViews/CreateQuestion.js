import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';
import { rooturl } from '../../../config/settings';


class CreateQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionNo: 1,
            addQuestion: false,
            questionDiv: null,
            questions: [],
            question: '',
            optA: '',
            optB: '',
            optC: '',
            isoptA: false,
            isoptB: false,
            isoptC: false
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        var questionID = this.props.match.params.questionID;
        var quizID = this.props.match.params.quizID;
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://'+rooturl+':3001/question',
            params: { "quizID": quizID, "questionID": questionID },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                //update the state with the response data
                console.log("details data", response.data);
                if(response.data.question !== null){
                    this.setState({ question: response.data.question });
                    console.log(this.state.question);
                }
                if(response.data.optA !== null){
                    this.setState({ optA: response.data.optA });
                }
                if(response.data.optB !== null){
                    this.setState({ optB: response.data.optB });
                }
                if(response.data.optC !== null){
                    this.setState({ optC: response.data.optC });
                }
                if(response.data.answer === "a"){
                    this.setState({ isoptA: true });
                }
                if(response.data.answer === "b"){
                    this.setState({ isoptB: true });
                }
                if(response.data.answer === "c"){
                    this.setState({ isoptC: true });
                }
            });
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
        var token = localStorage.getItem("token");
        await axios({
            method: 'post',
            url: 'http://'+rooturl+':3001/question',
            data: {
                questionID: questionID,
                quizID: quizID, question: formData.get('question'), optA: formData.get("optA"),
                optB: formData.get("optB"), optC: formData.get("optC"), answer: formData.get("answer")
            },
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                let nextQuestion = parseInt(questionID) + 1;
                swal(responseData.responseMessage);
                window.location = '/faculty/course/' + courseID + '/quiz/' + quizID + '/question/' + (nextQuestion);
            }).catch(function (err) {
                console.log(err)
            });

    }

    redirect = () => {
        var courseID = this.props.match.params.courseID;
        window.location = '/faculty/course/' + courseID + '/quiz';
    }

    handleChange(event) {
        console.log(event.target.value);
        this.setState({question: event.target.value});
    }

    onOptASelected = (e) => {
        console.log(e.target);
        this.setState({isoptA : true});
      }

      onOptBSelected = (e) => {
        console.log(e.target);
        this.setState({isoptB : true});
      }

      onOptCSelected = (e) => {
        console.log(e.target);
        this.setState({isoptC : true});
      }

    render() {
        var questionID = this.props.match.params.questionID;
        let redirectVar = null;
        let role = localStorage.getItem('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let heading = <div className="form-group row">
            <h6>Question {questionID}</h6>
        </div>;
        //let  question = <Question />;
        console.log("ques:",this.state.question);
        var ques= this.state.question;
        let submitButton = null;
        if (questionID > 0) {
            submitButton = <div className="col-sm-5">
                <button type="button" className="btn btn-primary pull-right" onClick={(e) => this.redirect(e)} style={{ marginBottom: "5%" }}>Exit</button>
            </div>;
        }
        let assignmenturl = "/faculty/course/" + this.props.match.params.courseID + "/assignments";
        let filesurl = "/faculty/course/" + this.props.match.params.courseID + "/files";
        let announcementsurl = "/faculty/course/" + this.props.match.params.courseID + "/announcements";
        let peopleurl = "/faculty/course/" + this.props.match.params.courseID + "/people";
        let quizurl = "/faculty/course/" + this.props.match.params.courseID + "/quiz";
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
                                        <form onSubmit={this.addQuestion} method="post">
                                            {heading}
                                            <div>
                                                <div className="form-group row">
                                                    <label htmlFor="question" className="col-sm-2 col-form-label">Question:</label>
                                                    <div className="col-sm-5">
                                                        <textarea type="text" className="form-control" id="question" name="question" rows="3" value={this.state.question}  onChange={this.handleChange} required ></textarea>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="optA" className="col-sm-2 col-form-label">Option A:</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" className="form-control" name="optA" defaultValue={this.state.optA} required />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="optB" className="col-sm-2 col-form-label">Option B:</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" className="form-control" name="optB" defaultValue={this.state.optB} required />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="optC" className="col-sm-2 col-form-label">Option C:</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" className="form-control" name="optC" defaultValue={this.state.optC} required />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="answer" className="col-sm-2 col-form-label">Correct option:</label>
                                                    <div className="col-sm-5 radio">
                                                        <label> <input type="radio" name="answer" value="a" checked={this.state.isoptA} onChange={this.onOptASelected} required />A</label>&nbsp;&nbsp;
                                                <label> <input type="radio" name="answer" value="b" checked={this.state.isoptB} onChange={this.onOptBSelected} />B</label>&nbsp;&nbsp;
                                        <label> <input type="radio" name="answer" value="c" checked={this.state.isoptC} onChange={this.onOptCSelected} />C</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row border-bottom">
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary text-center" style={{ marginBottom: "5%" }} > Save and Next</button>
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
