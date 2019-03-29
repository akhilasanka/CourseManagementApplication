import React, { Component } from 'react';
import cookie from 'react-cookies';

class ComposeMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        
    }

    render() {
        console.log("cookies");
        var fromEmail = null;
        fromEmail = cookie.load('cookie4');
        return (
            <div class="modal fade" id="composeMessage" tabindex="-1" role="dialog" aria-labelledby="composeMessageLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="composeMessageLabel">New Message</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                        <form onSubmit={this.createNewCourse} method="post">
                                         <div className="form-group row">
                                            <label htmlFor="name" className="col-sm-2 col-form-label">From:</label>
                                            <div className="col-sm-7">
                                                <input type="email" className="form-control" name="name" value={fromEmail} readOnly required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="dept" className="col-sm-2 col-form-label">To:</label>
                                            <div className="col-sm-7">
                                                <input type="email" className="form-control" name="dept" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                                <label htmlFor="desc" className="col-sm-2 col-form-label">Message:</label>
                                                <div className="col-sm-7">
                                                <textarea class="form-control" id="desc" rows="3"></textarea>
                                                </div>
                                        </div>
                                        <div class="modal-footer form-group">
                                            <button type="submit" class="btn btn-primary">Send Message</button>
                                    </div>

                                    </form>
                       </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default ComposeMessage;