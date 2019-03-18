import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './FacultyCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';


class CourseFileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: '',
            fileDetails:[]
        }
    }

    componentWillMount(){
        var courseID = this.props.match.params.courseID;
        axios({
            method: 'get',
            url: 'http://localhost:3001/files',     
            params: { "courseID": courseID },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
                .then((response) => {
                //update the state with the response data
                this.setState({
                    fileDetails : this.state.fileDetails.concat(response.data) 
                });
                console.log("details data",this.state.fileDetails);
            });
    }
    
    onChange = (e) => {
        switch (e.target.name) {
            case 'selectedFile':
                this.setState({ selectedFile: e.target.files[0] });
                break;
            default:
                this.setState({ [e.target.name]: e.target.value });
        }
    }

    uploadFile = async (event) => {
        event.preventDefault();
        const formDataCurrent = new FormData(event.target);
        var courseID = this.props.match.params.courseID;

        let formData = new FormData();
        formData.append('courseID', courseID);
        formData.append('selectedFile', this.state.selectedFile);

        console.log(this.props.match.params);
        await axios({
            method: 'post',
            url: 'http://localhost:3001/files/upload',     
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                alert(responseData.responseMessage);
                window.location.reload();
            }).catch(function (err) {
                console.log(err)
            }); 
    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "faculty") {
            redirectVar = <Redirect to="/login" />;
        }
        let fileDetailsDiv = null;
        fileDetailsDiv = this.state.fileDetails.map((record,index) => {
            return (
                <tr key={index}>
                    <td><a href="">{record.file_name}</a></td>
                </tr>
            )
            });
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Navigation />

                    <div className="container">

                        <div className="row justify-content-center align-items-center" >

                            <div className="col-12">
                                <div className="border-bottom row" style={{ marginBottom: "3%", marginTop: "2%" }}>
                                    <h3>Course Files Upload</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <CourseNav />
                                    </div>
                                    <div className="col-10">
                                        <form onSubmit={this.uploadFile} encType="multipart/form-data" method="post">
                                            <div className="form-group row">
                                                <label htmlFor="file" className="col-sm-2 col-form-label">File Upload:</label>
                                                <div className="col-sm-5">
                                                    <input type="file" className="form-control" name="selectedFile" required onChange={this.onChange} />
                                                </div>
                                            </div>
                                            <div className="form-group row border-bottom">
                                                <div className="col-sm-5">
                                                    <button type="submit" className="btn btn-primary pull-right" style={{ marginBottom: "5%" }}>Submit</button>
                                                </div>
                                            </div>

                                        </form>
                                        <div>
                                            <h4 style={{ padding: "0.5em" }}>Uploaded Files</h4>
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>File</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {fileDetailsDiv}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default CourseFileUpload;
