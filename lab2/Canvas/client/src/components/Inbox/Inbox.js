import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import { connect } from 'react-redux';
import ComposeMessage from './ComposeMessage';
import { getInboxMessages } from '../../actions/inboxAction';
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import '../cssFiles/inbox.css';


class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sentMsgs: [],
            inboxMsgs: []
        }
    }

    async componentDidMount() {
        var email = null;
        email = localStorage.getItem('cookie4');
        await this.props.getInboxMessages(email);
        let array = this.props.msgs.msgs;
        let arrayLength = array.length;
        console.log("array length", arrayLength);
        let inbox = [];
        let sent = [];
        for (var i = 0; i < arrayLength; i++) {
            if (array[i].to === email) {
                inbox.push(array[i]);
            }
            if (array[i].from === email) {
                sent.push(array[i]);
            }
        }
        console.log("inbox", inbox);
        console.log("sent", sent);
        this.setState({ inboxMsgs: inbox, sentMsgs: sent });
    }

    handleSelect = async (key) => {
        var email = null;
        email = localStorage.getItem('cookie4');
        if (key === "second") {
            await this.props.getInboxMessages(email);
            let array = this.props.msgs.msgs;
            let arrayLength = array.length;
            console.log("array length", arrayLength);
            let sent = [];
            for (var i = 0; i < arrayLength; i++) {
                if (array[i].from === email) {
                    sent.push(array[i]);
                }
            }
            console.log("sent", sent);
            this.setState({ sentMsgs: sent });
        }
        if (key === "first") {
            await this.props.getInboxMessages(email);
            let array = this.props.msgs.msgs;
            let arrayLength = array.length;
            console.log("array length", arrayLength);
            let inbox = [];
            for (var i = 0; i < arrayLength; i++) {
                if (array[i].to === email) {
                    inbox.push(array[i]);
                }
            }
            console.log("inbox", inbox);
            this.setState({ inboxMsgs: inbox });
        }
    }

    render() {
        let redirectVar = null;
        if (!localStorage.getItem('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        let inboxDiv = this.state.inboxMsgs.map((record, index) => {
            let hrefLink = "#href" + index;
            let id = "href" + index;
            let str = record.timestamp;
            let time = str.substring(0, str.indexOf('('));

            return (

                <div class="card">
                    <div class="card-header">
                        <a class="card-link" data-toggle="collapse" href={hrefLink}>
                            <div className="row">
                                <div className="col">
                                    From: {record.from}
                                </div>
                                <div className="col float-right">
                                    {time}
                                </div>

                            </div>

                        </a>
                    </div>
                    <div id={id} class="collapse" data-parent="#accordion">
                        <div class="card-body">
                            {record.message}
                        </div>
                    </div>
                </div>
            )
        });

        let sentboxDiv = this.state.sentMsgs.map((record, index) => {
            let hrefLink = "#href" + index;
            let id = "href" + index;
            let str = record.timestamp;
            let time = str.substring(0, str.indexOf('('));

            return (

                <div class="card">
                    <div class="card-header">
                        <a class="card-link" data-toggle="collapse" href={hrefLink}>
                            <div className="row">
                                <div className="col">
                                    To: {record.to}
                                </div>
                                <div className="col float-right">
                                    {time}
                                </div>

                            </div>

                        </a>
                    </div>
                    <div id={id} class="collapse" data-parent="#accordion">
                        <div class="card-body">
                            {record.message}
                        </div>
                    </div>
                </div>
            )
        });
        console.log(this.state.sentMsgs.length);
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
                                    <div className="col-3">
                                        <Row>
                                            <button className="btn btn-primary float-left" style={{ marginTop: "10px" }} data-toggle="modal" data-target="#composeMessage">
                                                <i className="fa fa-plus" aria-hidden="true" style={{ marginRight: "5px" }}>
                                                </i>Message</button>
                                            <ComposeMessage />
                                        </Row>
                                    </div>
                                    <Tab.Container id="left-tabs-example" defaultActiveKey="first" onSelect={this.handleSelect}>
                                        <Row>
                                            <Col sm={3}>
                                                <Nav variant="pills" className="flex-column">
                                                    <Nav.Item>
                                                        <Nav.Link eventKey="first">Inbox</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link eventKey="second">Sent</Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </Col>
                                            <Col sm={9}>
                                                <Tab.Content>
                                                    <Tab.Pane eventKey="first">
                                                        {this.state.inboxMsgs.length>0
                                                        ?
                                                        (<div id="accordion">
                                                            {inboxDiv}
                                                        </div>)
                                                        :
                                                        (
                                                            <div class="alert alert-info" role="alert">
                                                                No messages to display
                                                            </div>
                                                        )
                                                    }

                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="second">
                                                        {this.state.sentMsgs.length>0
                                                        ?
                                                        (<div id="accordion">
                                                            {sentboxDiv}
                                                        </div>)
                                                        :
                                                        (
                                                            <div class="alert alert-info" role="alert">
                                                                No messages to display
                                                            </div>
                                                        )
                                                    }
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </Col>
                                        </Row>
                                    </Tab.Container>

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
    msgs: state.inbox.msgs
});

export default connect(mapStateToProps, { getInboxMessages })(Inbox);