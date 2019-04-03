import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';


class ShowAnnouncements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            announcementDetails : []
        }
    }

    componentWillMount(){
        var id = this.props.match.params.courseID;
        console.log(id);
        axios({
            method: 'get',
            url: 'http://localhost:3001/announcements',     
            params: { "courseID": id },
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

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
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
                                    <div>
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

export default ShowAnnouncements;