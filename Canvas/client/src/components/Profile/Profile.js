import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileHeading: "Profile",
            name: '',
            phoneNumber : '',
            country : '',
            school : '',
            hometown : '',
            languages : '',
            gender : 'M',
            readonly: 'readOnly',
            isMale: false,
            isFemale: false,
            isDisabled: true,
            showButton: false,
        }
        this.editProfile = this.editProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentWillMount() {
        var role = cookie.load('cookie1');
        var id = cookie.load('cookie2');
        if (role) {
            console.log("able to read cookie");
            let profileHeading = cookie.load('cookie3');
            let name= cookie.load('cookie3');
            console.log(name);
            this.setState({
                profileHeading: profileHeading+"'s Profile",
                name: name
            });
        

        axios({
            method: 'get',
            url: 'http://localhost:3001/profile',     
            params: { "id": id , "table": role },
            config: { headers: { 'Content-Type': 'application/json' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
                return response.data;
            })
            .then((responseData) => {
                if(responseData.name != null){
                    this.setState({
                        name : name
                    });
                }
                if(responseData.phoneNumber != null){
                    this.setState({
                        phoneNumber : responseData.phoneNumber
                    });
                }
                if(responseData.country != null){
                    this.setState({
                        country : responseData.country
                    });
                }
                if(responseData.school != null){
                    this.setState({
                        school : responseData.school
                    });
                }
                if(responseData.hometown != null){
                    this.setState({
                        hometown : responseData.hometown
                    });
                }
                if(responseData.languages != null){
                    this.setState({
                        languages : responseData.languages
                    });
                }
                if(responseData.gender != null){
                    if(responseData.gender === 'F'){
                    this.setState({
                        isFemale : true
                    });
                }
                else{
                    this.setState({
                        isMale : true
                    });
                }
                }
            }).catch(function (err) {
                console.log(err)
            });
    }
}

editProfile = () =>{
  this.setState({
    readonly: null,
    isDisabled: false,
    showButton: true
  });
}

updateProfile = async (event) => {
    event.preventDefault();
    var role = cookie.load('cookie1');
    var id = cookie.load('cookie2');
    const formData = new FormData(event.target);
   await axios({
        method: 'post',
        url: 'http://localhost:3001/profile',     
        data: { "id":id, "table": role, "name": formData.get('name'), "phoneNumber": formData.get('phoneNumber'), 
        "country" : formData.get('country'), "school" : formData.get('school'), "hometown" : formData.get('hometown'), 
        "languages" : formData.get('languages'), "gender" : this.state.gender },
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
            alert("Sucessfully edited");
            window.location.reload();
        }).catch(function (err) {
            console.log(err)
        }); 
}

    render(){
        let redirectVar = null;
        if (!cookie.load('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        let divButton = null;
        if(this.state.showButton) {
            divButton = <button type="submit" class="btn btn-primary" >Update Profile</button>
        }
        return(
            <div>
            {redirectVar}
            <div>
            <div className='rowC' style={{display: "flex", flexDirection:"row"}}>
                
            <Navigation />
            
                <div className="container">
                    <div className="row justify-content-center align-items-center" style={{height : '75vh'}}>
                
                    
                        <div className="col-12">
                            <div className="border-bottom row">
                        <h3>{this.state.profileHeading}</h3>
                        </div>
                                    <form onSubmit={this.updateProfile} method="post">
                                    <div className="form-group row">
                                    <div className="col-sm-11">
                                    <button type="button" class="btn btn-default pull-right" onClick={this.editProfile}>
                                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</button>
                                            </div>
                                            </div>
                                        <div className="form-group row">
                                            <label htmlFor="name" className="col-sm-2 col-form-label">Name:</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" name="name" defaultValue={this.state.name}  pattern="^[a-zA-Z ]*$" required readOnly={this.state.readonly}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="country" className="col-sm-2 col-form-label">Phone number:</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" name="phoneNumber" defaultValue={this.state.phoneNumber}  required readOnly={this.state.readonly}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="country" className="col-sm-2 col-form-label">Country:</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" name="country" defaultValue={this.state.country} required readOnly={this.state.readonly}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="school" className="col-sm-2 col-form-label">School:</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" name="school" defaultValue={this.state.school}  required readOnly={this.state.readonly}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="hometown" className="col-sm-2 col-form-label">Hometown:</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" name="hometown" defaultValue={this.state.hometown} required readOnly={this.state.readonly}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="languages" className="col-sm-2 col-form-label">Languages:</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" name="languages" defaultValue={this.state.languages}  required readOnly={this.state.readonly}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="Gender" className="col-sm-2 col-form-label">Gender:</label>
                                            <div className="col-sm-6 radio">
                                            <label> <input type="radio" name="gender" checked={this.state.isMale} disabled={this.state.isDisabled}/>Male</label>&nbsp;&nbsp;
                                            <label> <input type="radio" name="gender" checked={this.state.isFemale} disabled={this.state.isDisabled}/>Female</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                        {divButton}
                                        </div>
                                    </form>
                                   
                        </div>
                    </div>
                </div>
            </div>
            
            </div>

            </div>
        )
    }
}

export default Profile;