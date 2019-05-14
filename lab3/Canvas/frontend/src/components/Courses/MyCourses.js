import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import swal from 'sweetalert';
import { Query, Mutation } from 'react-apollo';
import {graphql} from 'react-apollo';
import { coursequery } from '../../queries/coursequery';

class MyCourses extends Component {
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
        if(this.props.data.courses){
            console.log(this.props.data.courses);
        courseDetailsDiv = this.props.data.courses.courses.map((record,index) => {
            
            const getStyle = (status) =>{
                if(status === 'W'){
                    return {display : 'block'};
                }else{
                    return {display : 'none'};
                }

            }
            return (
                <tr key={record.index} className="course-list">
                    <td>{record.course_id}</td>
                    <td>{record.course_name}</td>
                    <td>{record.dept}</td>
                    <td>{record.term}</td>
                    <td>{record.status}</td>
                    <td>{record.grade}</td>
                    <td>{record.faculty_name}</td>
                    
                    <td>
                    <button type="button" className="btn btn-primary" onClick={(e)=>this.drop(e,record.course_id, record.status)}>Drop</button> 
                    </td>
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
                                    <h3>My Courses</h3>
                                </div>
                                {this.props.data.courses && this.props.data.courses.courses.length>0
                                                        ?
                                                        (
                                                            <div>
                                <small>*W indicates waitlist, E indicates enrolled</small>
                                <table className="table table-striped table-bordered course-table">
                                
                                    <thead>
                                        <tr>
                                            <th>Course ID</th>
                                            <th>Course Name</th>
                                            <th>Department</th>
                                            <th>Term</th>
                                            <th>Status</th>
                                            <th>Grade</th>
                                            <th>Faculty Name</th>
                                            <th>Drop Course</th>
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
                                                                Please register to courses to view details
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

export default graphql(coursequery, {
    options : (props)=>({
        variables: {id : localStorage.getItem('cookie2')}
    })
})(MyCourses);