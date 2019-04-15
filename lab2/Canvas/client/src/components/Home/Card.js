import React, { Component } from 'react';
import {rooturl, clienturl} from '../../config/settings';
import '../cssFiles/homeCards.css';
export default class Card extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    //let coursePath= (this.props.item.isWaitlist) ? '#' :"/coursedetails/"+this.props.item.course_uid+"/home"
    //let isWaitlist= (this.props.item.isWaitlist) ? "(waitlist)" : ""

    let url = "http://"+clienturl+":3000/"+localStorage.getItem('cookie1')+"/course/"+this.props.item.course_id+"/files";
    console.log(url);

    return (
      <div className="card card-indi mx-5 mb-5" key={this.props.item.course_id} style={{ boxShadow: "2px 2px 2px #888888" }}>
                        <div className="color-div" style={{ padding: "4rem", background: "wheat" }}>
                        </div>
                        <div className="card-body" key={this.props.item.course_id} >
                            <p className="card-text"><a href={url}>{this.props.item.dept}&nbsp;{this.props.item.course_id}</a></p>
                            <i className="fa fa-bullhorn fa-list" aria-hidden="true"></i>
                            <i className="fa fa-file-text fa-list" aria-hidden="true"></i>
                            <i className="fa fa-comments-o fa-list" aria-hidden="true"></i>
                            <i className="fa fa-folder-o" aria-hidden="true"></i>
                        </div>
                    </div>
    );
  }
}