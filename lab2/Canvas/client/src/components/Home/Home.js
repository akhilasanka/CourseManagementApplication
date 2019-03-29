import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import '../cssFiles/homeCards.css';


class Home extends Component {

    constructor(){
        super();
        this.state = {  
            courses : [],
        }
    }  
    //get the courses from backend  
    componentDidMount(){
        var role = cookie.load('cookie1');
        var id = cookie.load('cookie2');
        let url = '';
        if(role === "faculty"){
            url = "http://localhost:3001/faculty/home";
        }
        else{
            url = "http://localhost:3001/student/home";
        }
        axios({
            method: 'get',
            url: url,     
            params: { "id": id },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    courses : this.state.courses.concat(response.data) 
                });
                console.log(this.state.courses);
            });
    }


    render() {
        //iterate over courses to create a table row
        let coursesDiv = this.state.courses.map(course => {
            return(
                 <div className="card card-custom mx-5 mb-5" key={course.course_id} style={{ boxShadow: "2px 2px 2px #888888"}}>
                                <div className="color-div" style={{ padding: "4rem", background: "wheat" }}>
                                </div>
                                <div className="card-body" >
                                    <p className="card-text"><a href="#">{course.dept}&nbsp;{course.course_id}</a></p>
                                    <i className="fa fa-bullhorn fa-list" aria-hidden="true"></i>
                                    <i className="fa fa-file-text fa-list" aria-hidden="true"></i>
                                    <i className="fa fa-comments-o fa-list" aria-hidden="true"></i>
                                    <i className="fa fa-folder-o" aria-hidden="true"></i>
                                </div>
                                </div>
            )
        });
        let redirectVar = '';
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />
                    <div className="container">
                        <div className="row mt-5">
                            {coursesDiv} 
                            </div>
                </div>
                </div>
            </div>
        )
    }
}

export default Home;