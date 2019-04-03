import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/activeTab.css';
import { Page, Document, pdfjs } from 'react-pdf';
import '../../cssFiles/pdfGrade.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ViewAssignmentFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
            pdf: ''
        }
    }

    componentWillMount() {
        var submissionID = this.props.match.params.submissionID;
        console.log(this.props.match.params);
        axios({
            method: 'get',
            url: 'http://localhost:3001/assignmentsubmissionfile',
            params: { submissionID: submissionID },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    pdf: "data:application/pdf;base64," + responseData.base64str
                });
            }).catch(function (err) {
                console.log(err)
            });
    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    render() {
        const { pageNumber, numPages } = this.state;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
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
                                    <h3>Assignment Submissions</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <CourseNav />
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

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default ViewAssignmentFile;