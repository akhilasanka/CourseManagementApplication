import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import Header from './Header';
import { connect } from 'react-redux';
import { signup } from '../../actions/signupAction';
import propTypes from 'prop-types';

class Signup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isFaculty: null,
            redirect: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount() {
        this.setState({
            isFaculty: null
        })
    }

    isFacultyChangeHandler = (e) => {
        console.log(e.target.checked);
        if(e.target.checked){
            this.setState({isFaculty : e.target.value})
        }
        if(!e.target.checked){
            this.setState({isFaculty : null})
        }
        }

    handleSubmit = async (event) => {
        event.preventDefault();
        let isFaculty = false;
        if(this.state.isFaculty === "faculty"){
            isFaculty = true;
        }
        console.log(this.state.isFaculty);
        event.preventDefault();
        const formData = new FormData(event.target);
        let data = { "name": formData.get('name'), "email": formData.get('email'), "password": formData.get('password'), "isFaculty": isFaculty };
        this.props.signup(data);
    }

    render() {
        let redirectVar = null;
        if (this.props.redirect === true) {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div>
                {redirectVar}

                <div>

                    <Header />
                    <div className="container">
                        <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>
                            <div className="col-7">
                                <div className="card">
                                    <h5 className="card-title text-center border-bottom"><span className="appName">Canvas</span></h5>
                                    <div className="card-body">
                                        <form onSubmit={this.handleSubmit} method="post">
                                            <div className="form-group text-center">
                                                <span className="" style={{ color: '#5e5e5e', fontWeight: '600' }}>Sign Up</span>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Name:</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" name="name" placeholder="Enter your full name" pattern="^[a-zA-Z ]*$" required />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email:</label>
                                                <div className="col-sm-10">
                                                    <input type="email" className="form-control" name="email" placeholder="Enter your email" required />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password:</label>
                                                <div className="col-sm-10">
                                                    <input type="password" className="form-control" name="password" placeholder="Enter password" minLength='6' required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value="faculty" name="isFaculty"
                                                        style={{ marginTop: '0.5em' }} onChange={this.isFacultyChangeHandler}/>
                                                    <label className="form-check-label" htmlFor="isFaculty">
                                                        <small>Signup as faculty</small>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col text-center">
                                                    <button type="submit" className="btn btn-primary" style={{ width: '60%', backgroundColor: '#005a8b', borderColor: '#004b75' }}>Sign Up</button>
                                                </div>
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

Signup.propTypes = {
    signup : propTypes.func,
    redirect : propTypes.object
}

const mapStateToProps = state => ({
    redirect : state.signup.redirect
});

//export Login Component
export default connect(mapStateToProps, { signup })(Signup);