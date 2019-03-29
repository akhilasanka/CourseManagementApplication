import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      expression : ''
    }
    this.calculateExpression = this.calculateExpression.bind(this);
  }

  handleEntry = () =>{
    this.setState({
      expression : this.refs.textbox.value
    });
  }

  handleClick = (operation) =>{
    let val = this.refs.textbox.value+operation;
    console.log(val);
    this.setState({
      expression : val
  });
  this.refs.textbox.focus();
  }

  calculateExpression = (event)=>{
    event.preventDefault();
    let input = this.refs.textbox.value;
    axios({
      method: 'post',
      url: 'http://localhost:3001/calculate',
      data: {expression : input}
    })
      .then((response) => { 
          
       if (response.status === 200) {
          return response.data.result 
       }
      })
      .then((result) => {
              console.log(result);
              this.setState({
                expression : result
              });
      }).catch(function (err) {
          console.log(err)
      });
      console.log(this.state.expression);
  }


  render() {
    return (
      <div className="container">
        <div className="row justify-content-center align-items-center">
            <div className="col-4">
                <div className="card">
                    <h5 className="card-title text-center">Calculator</h5>
                    <div className="card-body">
                        <form onSubmit={this.calculateExpression} method="post" autoComplete="off">
                            <div className="form-group">
                                <input type="text" className="form-control" ref="textbox" name="expression" onChange={this.handleEntry} placeholder="Enter a mathematical expression"
                                  pattern="^[0-9+-/*.]*$"  value={this.state.expression} required/>
                            </div>
                            <div className="form-group">
                                <div className="col text-center">
                                    <input type="button" className="btn btn-danger align-items-center" onClick={e => this.handleClick(e.target.name)}
                                     name="+" value="+"/>
                                    <input type="button" className="btn btn-danger align-items-center" onClick={e => this.handleClick(e.target.name)}
                                    name="-" value="-"/>
                                    <input type="button" className="btn btn-danger align-items-center" onClick={e => this.handleClick(e.target.name)}
                                    name="/" value="/"/>
                                    <input type="button" className="btn btn-danger align-items-center" name="*" onClick={e => this.handleClick(e.target.name)}
                                    value="*"/>
                                    <input type="submit" className="btn btn-info align-items-center" /*onClick={e=>this.calculateExpression(e)}*/ value="="/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
  }
}

export default App;
