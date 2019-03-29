import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import CourseNav from './StudentCourseNav';
import Navigation from '../../Nav/Nav';
import '../../cssFiles/courseAssignment.css';
import download from 'downloadjs';


class DownloadFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileDetails: [],
            base64str: null
        }
    }

    componentWillMount() {
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
                    fileDetails: this.state.fileDetails.concat(response.data)
                });
                console.log("details data", this.state.fileDetails);
            });
    }

    downloadFile = (event, file) => {
        event.preventDefault();
        axios({
            method: 'get',
            url: 'http://localhost:3001/file/base64str',
            params: { "fileName": file },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then((response) => {
                return response.data.base64str;
            }).then((base64str) => {
                this.setState({
                    base64str: base64str
                });
                let arr = null;
                if (this.state.base64str != null) {
                    arr = _base64ToArrayBuffer(this.state.base64str);
                    download(arr,file,"text/plain");
                }
            }).catch(function (err) {
                console.log(err)
            }); 

        function _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }


    }

    render() {
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (role != "student") {
            redirectVar = <Redirect to="/login" />;
        }
        let fileDetailsDiv = null;
        fileDetailsDiv = this.state.fileDetails.map((record, index) => {
            return (
                <tr key={index}>
                    <td><a href="" onClick={(e) => this.downloadFile(e, record.file_name)}>{record.file_name}</a></td>
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
                                    <h3>Download Files</h3>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <CourseNav />
                                    </div>
                                    <div className="col-10">
                                        <small>*click on link to download</small>
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
        )
    }

}

export default DownloadFiles;

