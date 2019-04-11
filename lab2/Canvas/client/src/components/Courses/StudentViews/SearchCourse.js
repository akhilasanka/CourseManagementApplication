import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../../Nav/Nav';
import swal from 'sweetalert';

class SearchCourse extends Component {
    constructor(props) {
        super(props);
        this.state={
            searchResults : [],
            showResults : false,
            startIndex: 0,
            currentPage: 1,
            searchResultsDisplaySet : [],
            pagesPerPage: 3
        }
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentWillMount(){
        this.setState({
            searchResults : [],
            showResults : false
        });
    }

    searchCourse = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let validInput = true;
        var token = localStorage.getItem("token");
        if(formData.get("courseID")=='' && formData.get("dept")=='' && formData.get("term")==null){
            swal("Alteast one feild must be entered/selected");
            validInput = false;
        }
        if(validInput == true){
        await axios({
            method: 'get',
            url: 'http://localhost:3001/course/search',     
            params: { "course_id": formData.get("courseID"), "dept": formData.get("dept"), 
                    "operation": formData.get("operation"), "term": formData.get("term")},
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                return response.data;
            })
            .then((responseData) => {
                console.log("responseData", responseData);
                if(responseData.dataFound === false){
                    swal("No results found for given entry. Please try with different values.");
                }else{
                    var records = this.state.pagesPerPage - 1;
                    var results = responseData;
                    console.log(results);
                    var displaySet = results.filter(function (element, index) {
                        console.log(records);
                        return index <= records;
                    });

                    console.log(displaySet);
                    this.setState({
                        searchResultsDisplaySet: displaySet,
                        searchResults: responseData
                    });
                }
            }).catch(function (err) {
                console.log(err)
            }); 
        }
    }


    enroll = async (event,courseID,seatsLeft) => {
        event.preventDefault();
        let studentID = cookie.load('cookie2');
        let status = 'W';
        if(seatsLeft>0){
            status = 'E';
        }
        let studentName = cookie.load('cookie3');
        var token = localStorage.getItem("token");
        await axios({
            method: 'post',
            url: 'http://localhost:3001/student/enroll',     
            data: {courseID : courseID, studentID : studentID, status : status, studentName: studentName},
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
                //console.log(responseData);
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
            if (startIndex >= this.state.searchResults.length) {
                flag = false;
                swal("No more records to show");
            }
        }

        if (flag === true) {


            var endIndex = startIndex + this.state.pagesPerPage - 1;
            var results = this.state.searchResults;
            var displaySet = results.filter(function (element, index) {
                return index >= startIndex && index <= endIndex;
            });
            this.setState({
                searchResultsDisplaySet: displaySet,
                startIndex: startIndex
            });
        }
    }

    render() {
        let searchResults = this.state.searchResultsDisplaySet.map((record,index) => {
            const getButtonValue = (seatsLeft) =>{
                if(seatsLeft>0){
                    return "Enroll";
                }else{
                    return "Waitlist";
                }

            }
            return (
                <tr key={record.id}>
                <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.dept}</td>
                    <td>{record.courseTerm}</td>
                    <td>{record.faculty_name}</td>
                    <td>{record.capacity}</td>
                    <td>{record.capacity-record.currentEnrolledStudents}</td>
                    <td>{record.waitlistCapacity}</td>
                    <td>
                    <button type="button" className="btn btn-primary" onClick={(e)=>this.enroll(e,record.id,record.capacity-record.currentEnrolledStudents)}>{getButtonValue(record.capacity-record.currentEnrolledStudents)}</button>
                    </td>
                </tr>
            )
        });
        
        let redirectVar = null;
        if (!cookie.load('cookie1')) {
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
                                    <h3>Search/Add Courses</h3>
                                </div>
                                <form onSubmit={this.searchCourse} method="post">
                                    <div className="row">
                                        <div className="col-7">
                                            <div className="form-group row">
                                                <div className="col-sm-5">
                                                    <div className="row">
                                                    <label htmlFor="courseID" className="col-form-label" style={{marginLeft:"1em"}}>Course ID:&nbsp;&nbsp;</label>
                                                    <select className="form-control" name="operation" style={{padding:"0em",width:"50%"}}>
                                                        <option value="=">exactly equals</option>
                                                        <option value=">">greater than</option>
                                                        <option value="<">less than</option>
                                                    </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <input type="number" className="form-control" name="courseID" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="dept" className="col-sm-5 col-form-label">Department:</label>
                                                <div className="col-sm-6">
                                                    <input type="text" className="form-control" name="dept" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="Term" className="col-sm-5 col-form-label">Term:</label>
                                                <div className="col-sm-6 radio">
                                                    <label> <input type="radio" name="term" value="fall" />Fall</label>&nbsp;&nbsp;
                                        <label> <input type="radio" name="term" value="spring" />Spring</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row text-center">
                                            <div className="col-2" style={{ marginTop: "1.5em" }}>
                                                <button type="submit" className="btn btn-primary align-center">Search</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <br></br>
                                {this.state.searchResultsDisplaySet.length > 0 &&
                                <div>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Course ID</th>
                                            <th>Course Name</th>
                                            <th>Department</th>
                                            <th>Term</th>
                                            <th>Faculty Name</th>
                                            <th>Class Capacity</th>
                                            <th>Seats Left for Enrollment</th>
                                            <th>Waitlist Capacity</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResults}
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
        )
    }
}

export default SearchCourse;