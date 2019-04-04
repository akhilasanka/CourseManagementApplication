import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './FacultyCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import { Page, Document, pdfjs } from 'react-pdf';
import '../../cssFiles/pdfGrade.css';
import swal from 'sweetalert';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class GradeAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
            pdf: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        var submissionID = this.props.match.params.submissionID;
        console.log(this.props.match.params);
        var token = localStorage.getItem("token");
        axios({
            method: 'get',
            url: 'http://localhost:3001/assignmentsubmission/details',
            params: { submissionID: submissionID },
            config: { headers: { 'Content-Type': 'application/json' } },
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
                console.log("response",responseData);
                this.setState({
                    pdf: "data:application/pdf;base64," + responseData.base64str,
                    marks: responseData.marks
                });
            }).catch(function (err) {
                console.log(err)
            });

    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    nextPage = () => {
        if(this.state.pageNumber < this.state.numPages){
            this.setState({ pageNumber: this.state.pageNumber+1 });
        }
    }

    previousPage = () => {
        if(this.state.pageNumber > 1){
            this.setState({ pageNumber: this.state.pageNumber-1 });
        }
    }

    handleChange(event) {
        this.setState({marks: event.target.value});
      }

    updateMarks = async(event) => {
        event.preventDefault();
        var assignmentID = this.props.match.params.assignmentID;
        var studentID = this.props.match.params.studentID;
        const formData = new FormData(event.target);
        var marks = formData.get('marks');
        var token = localStorage.getItem("token");
       await axios({
            method: 'put',
            url: 'http://localhost:3001/assignmentsubmission/marks',     
            params: { assignmentID: assignmentID, studentID: studentID, marks:marks},
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
                //window.location.reload();
            }).catch(function (err) {
                console.log(err)
            }); 
    }

    render() {
        const { pageNumber, numPages } = this.state;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let assignmenturl = "/faculty/course/" + this.props.match.params.courseID + "/assignments";
        let filesurl = "/faculty/course/" + this.props.match.params.courseID + "/files";
        let announcementsurl = "/faculty/course/" + this.props.match.params.courseID + "/announcements";
        let peopleurl = "/faculty/course/" + this.props.match.params.courseID + "/people";
        let quizurl = "/faculty/course/" + this.props.match.params.courseID + "/quiz";
        let gradesurl = "/faculty/course/" + this.props.match.params.courseID + "/grade";
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />

                    <div className="container">

                        <div className="row justify-content-center align-items-center" >

                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Assignment Submissions</h3>
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
                                    <div className="col-7">
                                        <div className="row">
                                            <button type="button" className="btn btn-default pull-left" onClick={this.previousPage}>
                                               &nbsp; <i className="fa fa-arrow-circle-left" aria-hidden="true"></i>Previous</button>
                                            <div className="col-10">
                                                <button type="button" className="btn btn-default pull-right" onClick={this.nextPage}>
                                                    Next<i className="fa fa-arrow-circle-right" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                        <div className="col-10">
                                            <Document file={this.state.pdf} onLoadSuccess=
                                                {this.onDocumentLoadSuccess} onLoadError={console.error}>
                                                <Page pageNumber={pageNumber} />
                                            </Document>
                                            <p>Page {pageNumber} of {numPages}</p>
                                        </div>
                                    </div>
                                    <div className="col-2">
                                    <form onSubmit={this.updateMarks} method="put" style={{margin:"1.3em"}}>
                                    <div className="form-group row">
                                            <div className="col">
                                                <div className="row">
                                                    <label htmlFor="marks">Marks:&nbsp;</label>
                                                <input type="number" className="form-control" name="marks" style={{width:"50%"}} value={this.state.marks} onChange={this.handleChange} required />
                                                <label>/10</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                        <div className="float-right">
                                         <button type="submit" className="btn btn-primary btn-sm pull-left" style={{marginLeft:"80%"}}>Submit</button>
                                        </div>
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

export default GradeAssignment;