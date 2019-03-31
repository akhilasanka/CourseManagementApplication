import React, { Component } from 'react';
import cookie from 'react-cookies';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { getEmailList , postMessage } from '../../actions/inboxAction';
import '../cssFiles/inboxEmailSuggestions.css';

class ComposeMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            emailList: [{}]
        }
    }

    async componentDidMount() {
        await this.props.getEmailList();
        this.setState({ emailList : this.props.emailListStore.emailList});
       // console.log(this.props);
    }



    getSuggestionValue = suggestion => suggestion.email;

    renderSuggestion = suggestion => (
        <div>
            {suggestion.email}
        </div>
    );

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    getSuggestions = value => {
        let inputValue = null;
         inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.emailList.filter(listItem =>
            listItem.email.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    onSuggestionsFetchRequested = ({ value }) => {  

        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    saveMessage = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        console.log("to",formData.get('to'));
        let data = { "to": formData.get('to'), 
                     "from": formData.get('from'), 
                     "message": formData.get('msg')
                    };
        this.props.postMessage(data);
        this.inputElement.click();
        
    }

    render() {
        var fromEmail = null;
        fromEmail = cookie.load('cookie4');

        const { value } = this.state;
        const inputProps = {
            value,
            onChange: this.onChange,
            className: "form-control",
            required:"required",
            name:"to"
        };
        console.log("emailList:",this.state.emailList);
        return (
            <div className="modal fade" id="composeMessage" tabIndex="-1" role="dialog" aria-labelledby="composeMessageLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="composeMessageLabel">New Message</h5>
                            <button type="button" className="close" ref={input => this.inputElement = input} data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.saveMessage} method="post">
                                <div className="form-group row">
                                    <label htmlFor="from" className="col-sm-2 col-form-label">From:</label>
                                    <div className="col-sm-7">
                                        <input type="email" className="form-control" name="from" value={fromEmail} readOnly required />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="to" className="col-sm-2 col-form-label">To:</label>
                                    <div className="col-sm-7">
                                    <Autosuggest
                                            suggestions={this.state.suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            inputProps={inputProps}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="mesg" className="col-sm-2 col-form-label">Message:</label>
                                    <div className="col-sm-7">
                                        <textarea className="form-control" id="msg" name="msg" rows="3" required></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer form-group">
                                    <button type="submit" className="btn btn-primary">Send Message</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    emailListStore : state.inbox.emailList
});

export default connect(mapStateToProps, { getEmailList , postMessage })(ComposeMessage);