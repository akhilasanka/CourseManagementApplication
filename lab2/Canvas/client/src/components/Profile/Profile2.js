import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import '../cssFiles/profile.css';
import { connect } from 'react-redux';
import { getProfile } from '../../actions/profileAction';
import propTypes from 'prop-types';


class Profile2 extends Component {

    constructor(props) {
        super(props);
    }
    //async 
    componentDidMount(){
        var role = cookie.load('cookie1');
            var id = cookie.load('cookie2');
            //await 
            this.props.getProfile(id, role);
    
    }

    render(){
        console.log("profile",this.props.profile);
        if(this.props.profile !== null){
            console.log('not null');
        }
        let redirectVar = null;
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        let removePicButton = null;
        let divButton = null;
        //if (this.state.showButton) {
            divButton = <button type="submit" className="btn btn-primary update-button" style={{marginLeft:"6.5em"}} >Update Profile</button>
            removePicButton = <button type="button" className="btn btn-primary btn-sm" style={{marginLeft:"4em"}} onClick={this.removePic}>Remove Pic</button>
        //}
        let defaultIMGDiv = (<div className='buttons fadein'>
            <div className='button'>
                <label htmlFor='single'>
                    <div style={{ fontSize: "130px", marginLeft: "0.5em" }}>
                        <i className="fa fa-user fa-10x"></i>
                    </div>
                </label>
                <input type='file' id='single' name="selectedFile" onChange={this.onPicUpload} style={{ height: "0px", width: "0px" }} accept="image/x-png,image/gif,image/jpeg" />
            </div>

        </div>);
        let imgDiv = defaultIMGDiv;
        return (
            <div>
                {redirectVar}
                <div>
                    <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                        <Navigation />

                        <div className="container">
                            <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>


                                <div className="col-12">
                                    <div className="border-bottom row">
                                     {  /*<h3>{this.state.profileHeading}</h3> */ }
                                    </div>
                                    {this.props.profile !== null &&
                                    <form method="post">
                                        <div className="form-group row">
                                            <div className="col-sm-11">
                                                <button type="button" className="btn btn-default pull-right">
                                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3">
                                                <div className="form-group row">
                                                </div>
                                            </div>

                                            <div className="col-7">
                                            <div className="form-group row">
                                                    <label htmlFor="country" className="col-sm-2 col-form-label">Name:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="name"  required  />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                            <div className="col-sm-8">
                                                </div>
                                            </div>
                                            </div>

                                            
                                        </div>
                                    </form>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    profile : state.profile.profileDetails,
    test : state.profile.test,
    login: state.login.authFlag
})

export default connect(mapStateToProps, { getProfile })(Profile2);