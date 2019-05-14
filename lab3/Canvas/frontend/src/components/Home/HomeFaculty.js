import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import '../cssFiles/homeCards.css';
//import Draggable, { DraggableCore } from 'react-draggable';
import Reorder from 'react-reorder';
import Card from './Card';
import { Query, Mutation } from 'react-apollo';
import {graphql} from 'react-apollo';
import { facultycoursequery } from '../../queries/coursequery';

class HomeFaculty extends Component {

    constructor() {
        super();
        this.state = {
            courses: [],
        }
    }
    //get the courses from backend  
    async componentDidMount() {

    }


    render() {
        let coursesDiv = null
        console.log(this.props);
        if(this.props.data.facultycourses){
        console.log(this.props.data.facultycourses);
        //iterate over courses to create a table row
         coursesDiv = this.props.data.facultycourses.courses.map((course, index) => {
            let url = "http://localhost:3000/"+localStorage.getItem('cookie1')+"/course/"+course.course_id+"/files";
            console.log(url);
            return (
                /*<SortableItem key={`course-${index}`} index={index} >*/
                    <div className="card card-custom mx-5 mb-5" key={index} style={{ boxShadow: "2px 2px 2px #888888" }}>
                        <div className="color-div" style={{ padding: "4rem", background: "wheat" }}>
                        </div>
                        <div className="card-body" key={course._id} >
                            <p className="card-text"><a href={url}>{course.dept}&nbsp;{course.id}</a></p>
                            <i className="fa fa-bullhorn fa-list" aria-hidden="true"></i>
                            <i className="fa fa-file-text fa-list" aria-hidden="true"></i>
                            <i className="fa fa-comments-o fa-list" aria-hidden="true"></i>
                            <i className="fa fa-folder-o" aria-hidden="true"></i>
                        </div>
                    </div>
               /* </SortableItem> */
            )
        });
    }
        let redirectVar = '';
        if (!localStorage.getItem('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }
        return (
             <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />
                    <div className="container">
                        <div className="row mt-5">
                            {coursesDiv} 
                            </div>
                </div>
                </div>
            </div>
        )
    }
}

export default graphql(facultycoursequery, {
    options : (props)=>({
        variables: {id : localStorage.getItem('cookie2')}
    })
})(HomeFaculty);