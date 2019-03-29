import React, { Component } from 'react';

class Quiz extends Component {
    render() {
        return (
            <div>
            <div className="form-group row">
                <label htmlFor="question" className="col-sm-2 col-form-label">Question:</label>
                <div className="col-sm-5">
                    <textarea className="form-control" id="question" name="question" rows="3"></textarea>
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="optA" className="col-sm-2 col-form-label">Option A:</label>
                <div className="col-sm-5">
                    <input type="text" className="form-control" name="optA" required />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="optB" className="col-sm-2 col-form-label">Option B:</label>
                <div className="col-sm-5">
                    <input type="text" className="form-control" name="optB" required />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="optC" className="col-sm-2 col-form-label">Option C:</label>
                <div className="col-sm-5">
                    <input type="text" className="form-control" name="optC" required />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="answer" className="col-sm-2 col-form-label">Correct option:</label>
                <div className="col-sm-5 radio">
                    <label> <input type="radio" name="answer" value="c" required />A</label>&nbsp;&nbsp;
                                                <label> <input type="radio" name="answer" value="b" />B</label>&nbsp;&nbsp;
                                        <label> <input type="radio" name="answer" value="c" />C</label>
                </div>
            </div>
            </div>
        )
    }
}
export default Quiz;