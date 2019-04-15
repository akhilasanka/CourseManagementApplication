import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import '../cssFiles/homeCards.css';
//import Draggable, { DraggableCore } from 'react-draggable';
import Reorder from 'react-reorder';
import Card from './Card';
import {rooturl, clienturl} from '../../config/settings';
import { connect } from 'react-redux';
import { getCourses } from '../../actions/courseAction';

class Home extends Component {

    constructor() {
        super();
        this.state = {
            courses: [],
        }
    }
    //get the courses from backend  
    async componentDidMount() {
        var role = localStorage.getItem('cookie1');
        console.log(role);
        var id = localStorage.getItem('cookie2');
        var token = localStorage.getItem("token");
        let url = '';
        if (role === "faculty") {
            url = "http://"+rooturl+":3001/faculty/home";
            console.log(url);
        }
        else {
            url = "http://"+rooturl+":3001/student/home";
            console.log(url);
        }
        await this.props.getCourses(url, id);
        let courses = [];
        courses = this.props.courseList;
        //console.log(this.props.courseList);
        this.setState({
            courses: this.state.courses.concat(courses)
        });
        //console.log(this.state.courses);
    }


    render() {
        //iterate over courses to create a table row
        let coursesDiv = this.state.courses.map((course, index) => {
            let url = "http://"+clienturl+":3000/"+localStorage.getItem('cookie1')+"/course/"+course.course_id+"/files";
            console.log(url);
            return (
                /*<SortableItem key={`course-${index}`} index={index} >*/
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
               /* </SortableItem> */
            )
        });
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
                        {this.state.courses.length > 0 ?
                            <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                            <Reorder
              // The key of each object in your list to use as the element key
              itemKey='reorderable-cards'
              // The milliseconds to hold an item for before dragging begins
              holdTime={200}
              // The list to display
              list={this.state.courses}
              // A template to display for each list item
              template={Card}
              // Function that is called once a reorder has been performed
              callback={this.callback}
              // Class to be applied to the outer list element
              listClass='row'
              // Class to be applied to each list item's wrapper element
              itemClass=''
/>
</div>
                            :
                            <div>
                                <h2 style={{margin: "3em"}}>Welcome to Canvas!</h2>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    courseList: state.courses.courseList
});

export default connect(mapStateToProps, { getCourses })(Home);