import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import Header from './Header';
import { graphql } from "react-apollo";
import { loginmutation } from '../../mutations/signupLoginProfilemutations';

//Define a Login Component
export class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            isFaculty: null,
            displayErrorMessage: false
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
        if (e.target.checked) {
            this.setState({ isFaculty: e.target.value })
        }
        if (!e.target.checked) {
            this.setState({ isFaculty: null })
        }
    }

    //submit Login handler to send a request to the node backend
    submitLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let role = "student";
        if (this.state.isFaculty === "faculty") {
            role = "faculty";
        }
        console.log(this.state.isFaculty);
        let data = {
            "email": formData.get('email'),
            "password": formData.get('password'),
            "role": role
        };
        console.log(data);
        this.props.mutate({ variables: data })
            .then(res => {
                console.log(res);
                localStorage.setItem("cookie1", res.data.login.cookie1);
                    localStorage.setItem("cookie2", res.data.login.cookie2);
                    localStorage.setItem("cookie3", res.data.login.cookie3);
                    localStorage.setItem("cookie4", res.data.login.cookie4);
                if(!res.data.login.isValidUser)
                this.setState({ displayErrorMessage: true});
                else
                this.setState({ displayErrorMessage: false});
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        let msgDiv = null;
        console.log(localStorage.getItem('cookie1'));
        if (localStorage.getItem('cookie1') === "student") {
            redirectVar = <Redirect to="/student/home" />
        }
        if (localStorage.getItem('cookie1') === "faculty") {
            redirectVar = <Redirect to="/faculty/home" />
        }
        if (this.state.displayErrorMessage) {
            msgDiv = <div class="alert alert-warning text-center" role="alert" style={{ marginTop: '4%' }}>
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

const loginqueryoptions = {
    options: props => ({
      variables: {
        "email": this.state.data.email,
        "password": this.state.data.password,
        "role": this.state.data.role
      },
    }),
  }

Login = graphql (loginmutation) (Login)
//export Login Component
export default Login;