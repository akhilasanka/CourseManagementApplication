import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import '../cssFiles/homeCards.css';
import Draggable, { DraggableCore } from 'react-draggable';
//import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
//import {sortableContainer, sortableElement} from 'react-sortable-hoc';
//import arrayMove from 'array-move';

/*const SortableItem = sortableElement(({value}) => <div>{value}</div>);

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>;
});*/
import {rooturl} from '../../config/settings';

class Home extends Component {

    constructor() {
        super();
        this.state = {
            courses: [],
        }
    }
    //get the courses from backend  
    componentDidMount() {
        var role = cookie.load('cookie1');
        var id = cookie.load('cookie2');
        var token = localStorage.getItem("token");
        let url = '';
        if (role === "faculty") {
            url = "http://"+rooturl+":3001/faculty/home";
        }
        else {
            url = "http://"+rooturl+":3001/student/home";
        }
        axios({
            method: 'get',
            url: url,
            params: { "id": id },
            config: { headers: { 'Content-Type': 'application/json' } },
            headers: {"Authorization" : `Bearer ${token}`}
        })
            .then((response) => {
                //update the state with the response data
                if(response.data.courses){
                this.setState({
                    courses: this.state.courses.concat(response.data.courses)
                });
                console.log(this.state.courses);
            }
            });
    }

    /*onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({courses}) => ({
            courses: arrayMove(courses, oldIndex, newIndex),
        }));
      };*/

    render() {
        //iterate over courses to create a table row
        let coursesDiv = this.state.courses.map((course, index) => {
            let url = "http://"+rooturl+":3001"+cookie.load('cookie1')+"/course/"+course.course_id+"/files";
            return (
                /*<SortableItem key={`course-${index}`} index={index} >*/
                <Draggable>
                    <div className="card card-custom mx-5 mb-5" key={index} style={{ boxShadow: "2px 2px 2px #888888" }}>
                        <div className="color-div" style={{ padding: "4rem", background: "wheat" }}>
                        </div>
                        <div className="card-body" key={course.course_id} >
                            <p className="card-text"><a href={url}>{course.dept}&nbsp;{course.course_id}</a></p>
                            <i className="fa fa-bullhorn fa-list" aria-hidden="true"></i>
                            <i className="fa fa-file-text fa-list" aria-hidden="true"></i>
                            <i className="fa fa-comments-o fa-list" aria-hidden="true"></i>
                            <i className="fa fa-folder-o" aria-hidden="true"></i>
                        </div>
                    </div>
                    </Draggable>
               /* </SortableItem> */
            )
        });
        let redirectVar = '';
        /*if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />
        }*/
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />
                    <div className="container">
                            <div className="row mt-5">
                               {/* <SortableContainer onSortEnd={this.onSortEnd} axis="xy"> */}
                                    {coursesDiv}
                                {/*</SortableContainer> */}
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;