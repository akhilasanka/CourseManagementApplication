import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Course from './StudentCourseHome';
import { Page , Document ,pdfjs} from 'react-pdf';
//import pdf  from '../../../download/file.pdf';
var fs = require('fs');

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


class Assignments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            selectedFile: '',
            link: '',
            numPages: null,
            pageNumber: 1,
            pdf: ''
        };
    }

    componentWillMount() {
        axios({
            method: 'get',
            url: 'http://localhost:3001/pdf',
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                //var bitmap = new Buffer(responseData.base64str, 'base64');;
                //var pdf = fs.writeFileSync("../../../download/filename.pdf", bitmap);
                this.setState({
                    pdf : "data:application/pdf;base64,"+responseData.base64str
                });
            }).catch(function (err) {
                console.log(err)
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

    onSubmit = (e) => {
        e.preventDefault();
        const { description, selectedFile } = this.state;
        let formData = new FormData();

        formData.append('description', description);
        formData.append('selectedFile', selectedFile);

        axios.post('/assignments', formData)
            .then((result) => {
                // access results...
            });
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
      }

    render() {
        //download("http://localhost:3001/uploads/courseDocs/file.pdf");
        const { pageNumber, numPages } = this.state;
        let redirectVar = null;
        let role = cookie.load('cookie1');
        if (!role) {
            redirectVar = <Redirect to="/login" />;
        }
        const { description, selectedFile } = this.state;
        return (
            <div>
                {redirectVar}
                <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>
                    <Course />

                    <form onSubmit={this.onSubmit} encType="multipart/form-data" method="post">
                        <div className="col-7">
                            <div className="form-group row">
                                <div className="col-sm-5">
                                    <input
                                        type="text"
                                        name="description"
                                        value={description}
                                        onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-5">
                                    <input
                                        type="file"
                                        name="selectedFile"
                                        onChange={this.onChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col-sm-5">
                                    <button type="submit">Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="App">
                            <a href="http://localhost:3001/uploads/courseDocs/file.pdf" target="_blank" download> Download File >></a>
                        
                        </div>
                        <Document file={this.state.pdf} onLoadSuccess=
                       {this.onDocumentLoadSuccess} onLoadError={console.error}>
                        <Page pageNumber={pageNumber} />
                      </Document>
        <p>Page {pageNumber} of {numPages}</p>
                    </form>
                </div>
            </div>
        )
    }
}

export default Assignments;