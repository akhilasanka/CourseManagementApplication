import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './FacultyCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';


class CreateAnnouncements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            announcementDetails : []
        }
    }

    componentWillMount(){
        var id = this.props.match.params.courseID;
        console.log(id);
        var facultyID = cookie.load('cookie2');
        axios({
            method: 'get',
            url: 'http://localhost:3001/faculty/announcements',     
            params: { "courseID": id , "facultyID" : facultyID },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    announcementDetails : this.state.announcementDetails.concat(response.data) 
                });
                console.log("details data",this.state.announcementDetails);
            });
    }

    createNewAnnouncement = async (event) => {
        event.preventDefault();
        var id = this.props.match.params.courseID;
        console.log(this.props.match.params);
        //console.log("id",id);
        var facultyID = cookie.load('cookie2');
        const formData = new FormData(event.target);
       await axios({
            method: 'post',
            url: 'http://localhost:3001/announcements',     
            data: { "courseID": id, "title": formData.get("title"), "announcement": formData.get("desc")},
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
                alert(responseData.responseMessage);
                window.location.reload();
            }).catch(function (err) {
                console.log(err)
            }); 
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let announcementDetailsDiv = this.state.announcementDetails.map((record,index) => {
            return (
                <tr key={record.id}>
                    <td>{record.title}</td>
                    <td>{record.desc}</td>
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
                                    <h3>Announcements</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2"> 
                                    <CourseNav/>
                                    </div>
                                    <div className="col-10">
                                    <form onSubmit={this.createNewAnnouncement} method="post">
                                    <div className="form-group row">
                                            <label htmlFor="title" className="col-sm-2 col-form-label">Announcement Title:</label>
                                            <div className="col-sm-5">
                                                <input type="text" className="form-control" name="title" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                                <label htmlFor="desc" className="col-sm-2 col-form-label">Description:</label>
                                                <div className="col-sm-5">
                                                <textarea className="form-control" id="desc" name="desc" rows="3"></textarea>
                                                </div>
                                        </div>
                                        <div className="form-group row border-bottom">
                                        <div className="col-sm-5">
                                         <button type="submit" className="btn btn-primary pull-right" style={{marginBottom:"5%"}}>Create Assignment</button>
                                        </div>
                                        </div>

                                    </form>
                                    <div>
                                            <h4 style={{padding:"0.5em"}}>Published Announcements</h4>
                                            <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Announcement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {announcementDetailsDiv}
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

export default CreateAnnouncements;