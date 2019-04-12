import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Header from './Header';
import { connect } from 'react-redux';
import { authLogin } from '../../actions/loginAction';
import propTypes from 'prop-types';

//Define a Login Component
export class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            isFaculty: null
        }
        //Bind the handlers to this class
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            isFaculty: null
        })
    }

    isFacultyChangeHandler = (e) => {
        //console.log(e.target.checked);
        if(e.target.checked){
            this.setState({isFaculty : e.target.value})
        }
        if(!e.target.checked){
            this.setState({isFaculty : null})
        }
        }

    //submit Login handler to send a request to the node backend
    submitLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let isFaculty = false;
        if(this.state.isFaculty === "faculty"){
            isFaculty = true;
        }
        console.log(this.state.isFaculty);
        let data = { "email": formData.get('email'), 
                        "password": formData.get('password'), 
                        "isFaculty": this.state.isFaculty 
                    };
        this.props.authLogin(data);
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        let msgDiv = null;
        if (cookie.load('cookie1') === "student") {
            redirectVar = <Redirect to="/student/home" />
        }
        if (cookie.load('cookie1') === "faculty"){
            redirectVar = <Redirect to="/faculty/home" />
        }
        if (this.props.displayErrorMsg == true) {
           msgDiv = <div class="alert alert-warning text-center" role="alert" style={{marginTop:'4%'}}>
                Invalid email or password. Please try again.
            </div>
        }
        return (
            <div>
                {redirectVar}
                <div>
                    <Header />
                    <div className="container">
                        <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>
                            <div className="col-4">
                            {msgDiv}
                                <div className="card">
                                    <h5 className="card-title text-center border-bottom"><span className="appName">Canvas</span></h5>
                                    <div className="card-body">
                                        <form onSubmit={this.submitLogin} method="post" autoComplete="off">
                                            <div className="form-group text-center">
                                                <span className="" style={{ color: '#5e5e5e', fontWeight: '600' }}>Sign In</span>
                                            </div>
                                            <div className="form-group">
                                                <input type="email" className="form-control" name="email" id="uname"
                                                    placeholder="Email" required />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control" name="password" id="pwd"
                                                    placeholder="Password" required />
                                            </div>
                                            <div className="form-group">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value="faculty" name="isFaculty"
                                                        style={{ marginTop: '0.5em' }} onChange={this.isFacultyChangeHandler} />
                                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                                        <small>Login as faculty</small>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col text-center">
                                                    <input type="submit" className="btn btn-primary align-items-center" value="Sign In"
                                                        style={{ width: '100%', backgroundColor: '#005a8b', borderColor: '#004b75' }} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <small> <span className="label">New user? Click <a href="/signup">here</a> to sign up</span>
                                                </small>
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


Login.propTypes = {
    authLogin : propTypes.func,
    displayErrorMsg : propTypes.object
}

const mapStateToProps = state => ({
    displayErrorMsg : state.login.displayErrorMsg
});

//export Login Component
export default connect(mapStateToProps, { authLogin })(Login);