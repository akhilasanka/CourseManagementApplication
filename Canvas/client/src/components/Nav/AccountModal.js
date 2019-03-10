import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import '../cssFiles/homeNavModal.css';


class AccountModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
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
    }


    render() {
        var name = this.state.name;
        return (
            <div className="modal" id="profile" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="false" aria-live="assertive" aria-relevant="additions" aria-atomic="false">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    
                        <div className="container border-bottom">
                            <div className="row ">
                                
                            <button type="button" className="close w-100 pull-right" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" className="pull-right">&times;</span>
                                    </button>
                                <h4 className="modal-title w-100 text-center">{name}
                                    
                                    </h4>
                                </div>
                                <button type="button" className="btn btn-sm text-center" onClick = {this.logout}>Log out</button>
                            </div>

                                <ul>
                                    <button type="button" className="btn btn-link float-left" onClick = {this.openProfilePage}>Profile</button>
                                </ul>



                      { /* <div className="modal-header text-center">
                            <div className="row">
                                <h4 className="modal-title w-100">{name}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>

                            </div>
                            <br />
                            <div className="row">
                                <div class="col text-center">
                                    <button class="btn btn-default text-center">Log out</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-body mx-3">
                            <div class="md-form mb-5">
                                <i class="fas fa-user prefix grey-text"></i>
                                <input type="text" id="orangeForm-name" class="form-control validate" />
                                <label data-error="wrong" data-success="right" for="orangeForm-name">Your name</label>
                            </div>
                            <div class="modal-footer d-flex justify-content-center">
                                <button class="btn btn-deep-orange">Sign up</button>
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default AccountModal;