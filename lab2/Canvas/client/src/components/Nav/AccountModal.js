import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import '../cssFiles/homeNavModal.css';


class AccountModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            url: ""
        }
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'});
        cookie.remove('cookie2', {path: '/'});
        cookie.remove('cookie3', {path: '/'});
        console.log("All cookies removed!");
        window.location = "/";
    }

    openProfilePage = () => {
        if(cookie.load('cookie1')=="student"){
            window.location = "/student/profile";
        }else{
            window.location = "/faculty/profile";
        }
       
    }

    componentWillMount() {
        if (cookie.load('cookie1')) {
            console.log("able to read cookie");
            let name = cookie.load('cookie3');
            console.log(name);
            this.setState({
                name: name
            });
        }
        if(cookie.load('cookie1')=="student"){
            this.setState({url: "/student/profile"});
        }
        if(cookie.load('cookie1')=="faculty"){
            this.setState({url: "/faculty/profile"});
        }

    }


    render() {
        console.log(this.state.url);
        var name = this.state.name;
        return (
            <div className="modal" id="profile" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="false" aria-live="assertive" aria-relevant="additions" aria-atomic="false">
                <div className="modal-dialog nav-dialog" role="document">
                    <div className="modal-content nav-content">
                    
                        <div className="container border-bottom">
                            <div className="row ">
                                
                            <button type="button" className="close w-100 pull-right" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" className="pull-right">&times;</span>
                                    </button>
                                <h4 className="modal-title w-100 text-center">{name}
                                    
                                    </h4>
                                </div>
                                <button type="button" className="btn btn-sm text-center logout-btn" onClick = {this.logout}>Log out</button>
                            </div>

                                <ul>
                                    <Link to={this.state.url}>
                                    <button type="button" className="btn btn-link float-left" onClick={this.openProfilePage}>Profile</button>
                                    </Link>
                                </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default AccountModal;