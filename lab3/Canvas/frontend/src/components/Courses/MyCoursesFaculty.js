import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import swal from 'sweetalert';
import { Query, Mutation } from 'react-apollo';
import {graphql} from 'react-apollo';
import { facultycoursequery } from '../../queries/coursequery';

class MyCoursesFaculty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseDetails : []
        }
    }
    componentWillMount(){
        
    }

    drop = async (event,courseID,status) => {
        event.preventDefault();
      
    }

    render() {
        let redirectVar = null;
        if (!localStorage.getItem('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        let courseDetailsDiv = null;
        console.log(this.props);
        if(this.props.data.facultycourses){
            console.log(this.props.data.facultycourses);
        courseDetailsDiv = this.props.data.facultycourses.courses.map((record,index) => {
            
            return (
                <tr key={record.id} className="course-list">
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.dept}</td>
                    <td>{record.courseTerm}</td>
                    <td>{record.description}</td>
                    <td>{record.room}</td>
                    <td>{record.capacity}</td>
                    
                    <td>{record.waitlistCapacity}</td>
                    <td>{record.currentEnrolledStudents}</td>
                </tr>
            )
        });
    }
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                    <Navigation />

                    <div className="container">
                        <div className="row justify-content-center align-items-center" >


                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Created Courses</h3>
                                </div>
                                {this.props.data.facultycourses && this.props.data.facultycourses.courses.length>0
                                                        ?
                                                        (
                                                        
                                                            <div>
                                <table className="table table-striped table-bordered course-table">
                                
                                    <thead>
                                        <tr>
                                            <th>Course ID</th>
                                            <th>Course Name</th>
                                            <th>Department</th>
                                            <th>Term</th>
                                            <th>Description</th>
                                            <th>Room</th>
                                            <th>Capacity</th>
                                            
                                            <th>Waitlist Capacity</th>
                                            <th>Current Enrolled Students</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseDetailsDiv}
                                    </tbody>
                                </table>
                                </div>
                                )
                                :
                                (
                                    <div class="alert alert-info" role="alert">
                                                                Please create courses to view details
                                    </div>
                                )
                                }
                            </div>
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
})(MyCoursesFaculty);