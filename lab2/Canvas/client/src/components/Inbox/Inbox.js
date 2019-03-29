import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import { connect } from 'react-redux';
import ComposeMessage from './ComposeMessage';


class Inbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let redirectVar = null;
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        return (
            <div>
                {redirectVar}
                <div>
                    <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                        <Navigation />

                        <div className="container">
                            <div className="row justify-content-center align-items-center" style={{ height: '10vh' }}>

                                <div className="col-12">
                                    <div className="border-bottom row">
                                        <h3>Inbox</h3>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary float-left" style={{marginTop:"10px"}} data-toggle="modal" data-target="#composeMessage">
                                            <i className="fa fa-plus" aria-hidden="true" style={{marginRight:"5px"}}> 
                                            </i>Message</button>
                                            <ComposeMessage />
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

export default Inbox;