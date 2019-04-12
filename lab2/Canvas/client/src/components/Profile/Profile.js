import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navigation from '../Nav/Nav';
import '../cssFiles/profile.css';
import { connect } from 'react-redux';
import { getProfile, removeProfilePic, updateProfile, uploadProfilePic } from '../../actions/profileAction';
import propTypes from 'prop-types';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            readonly: 'readOnly',
            isMale: false,
            isFemale: false,
            isDisabled: true,
            showButton: false,
            image: false,
            selectedFile: '',
            src: '',
            img: null,
            imgName: null
        }
        this.editProfile = this.editProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
    }

   async componentDidMount() {
       
        var role = localStorage.getItem('cookie1');
        var id = localStorage.getItem('cookie2');
        if (role) {
          await this.props.getProfile(id, role);
          if(this.props.profile.data.name !== null){
          this.setState({
            name : this.props.profile.data.name,
            profileHeading : this.props.profile.data.name + "'s Profile"
          });
        }
          if(this.props.profile.data.img !== null){
              console.log("has image");
            this.setState({ img : this.props.profile.img });
          }
          if(this.props.profile.data.gender !== null){
              let gender = this.props.profile.data.gender;
              console.log(this.props.profile.data.gender);
              if(gender === 'M'){
                  this.setState({isMale : true});
              }
              if(gender === 'F'){
                this.setState({isFemale : true});
            }
        }
        }
    }

    onClose() {
        this.setState({ preview: null })
    }

    onCrop(preview) {
        this.setState({ preview });
        console.log("preview", this.state.preview);
    }

    onGenderFemaleChanged = (e) => {
        console.log(e.target);
        this.setState({isFemale : true});
      }
    
      onGenderMaleChanged = (e) => {
        console.log(e.target);
        this.setState({isMale : true});
      }
    


    editProfile = () => {
        this.setState({
            readonly: null,
            isDisabled: false,
            showButton: true
        });
    }

    updateProfile = async (event) => {
        event.preventDefault();
        var role = localStorage.getItem('cookie1');
        var id = localStorage.getItem('cookie2');
        const formData = new FormData(event.target);
        let gender = 'M';
        if(this.state.isFemale){
            gender = 'F';
        }
        let data = {
            "id": id, "role": role, "name": formData.get('name'), "phoneNumber": formData.get('phoneNumber'),
            "aboutMe": formData.get('aboutMe'),"company": formData.get('company'),"city": formData.get('city'),
            "country": formData.get('country'), "school": formData.get('school'), "hometown": formData.get('hometown'),
            "languages": formData.get('languages'), "gender": gender, "img": this.state.imgName
        };
        await this.props.updateProfile(data);
        this.setState({
            readonly: 'readonly',
            isDisabled: true,
            showButton: false
        });
    }

    onPicUpload = async (e) => {
        //console.log(e.target.files[0]);
        this.setState({ selectedFile: e.target.files[0] });
        console.log("state",this.state.selectedFile);

        var id = localStorage.getItem('cookie2');
        var role = localStorage.getItem('cookie1');
        let formData = new FormData();
        formData.append('id', id);
        formData.append('role', role);
        formData.append('selectedFile', e.target.files[0]);

        await this.props.uploadProfilePic(formData);
    }

    removePic = async (e) => {
        console.log("inside remove pic method");
        var id = localStorage.getItem('cookie2');
        var role = localStorage.getItem('cookie1');

        await this.props.removeProfilePic(id, role);
    }



    render() {
        let redirectVar = null;
        if (!localStorage.getItem('cookie1')) {
            redirectVar = <Redirect to="/login" />;
        }
        let removePicButton = null;
        let divButton = null;
        if (this.state.showButton) {
            divButton = <button type="submit" className="btn btn-primary update-button" style={{marginLeft:"6.5em"}} >Update Profile</button>
            
        }
        let defaultIMGDiv = (<div className='buttons fadein'>
            <div className='button'>
                <label htmlFor='single'>
                    <div style={{ fontSize: "130px", marginLeft: "0.5em" }}>
                        <i className="fa fa-user fa-10x"></i>
                    </div>
                </label>
                <input type='file' id='single' name="selectedFile" onChange={this.onPicUpload} style={{ height: "0px", width: "0px" }} accept="image/x-png,image/gif,image/jpeg" />
            </div>

        </div>);
        let imgDiv = defaultIMGDiv;
        if (this.state.img != null) {
            console.log("has profile pic");
            imgDiv =  (<div className='buttons fadein'>
            <div className='button'>
                <label htmlFor='single'>
                    <div className="image-cropper">
                        <img src={this.state.img} alt="Profile pic"></img>

                    </div>
                </label>
                <input type='file' id='single' name="selectedFile" onChange={this.onPicUpload} style={{ height: "0px", width: "0px" }} accept="image/x-png,image/gif,image/jpeg" />
            </div>

        </div>);
        }
        
        
        return (
            <div>
                {redirectVar}
                <div>
                    <div className='rowC' style={{ display: "flex", flexDirection: "row" }}>

                        <Navigation />

                        <div className="container">
                            <div className="row justify-content-center align-items-center" style={{ height: '75vh' }}>


                                <div className="col-12">
                                    <div className="border-bottom row">
                                        <h3>{this.state.profileHeading}</h3>
                                    </div>
                                    {this.props.profile !== null &&
                                    <form onSubmit={this.updateProfile} method="post">
                                        <div className="form-group row">
                                            <div className="col-sm-11">
                                                <button type="button" className="btn btn-default pull-right" onClick={this.editProfile}>
                                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3">
                                                <div className="form-group row">

                                                {imgDiv}
                                                {this.state.img !== null && this.state.showButton === true &&
                                                    <button type="button" className="btn btn-primary btn-sm" style={{marginLeft:"4em"}} onClick={this.removePic}>Remove Pic</button>   
                                                }
                                                </div>
                                            </div>

                                            <div className="col-7">
                                            <div className="form-group row">
                                                    <label htmlFor="name" className="col-sm-2 col-form-label">Name:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="name" defaultValue={this.props.profile.data.name} required readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="phoneNumber" className="col-sm-2 col-form-label">Phone number:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="phoneNumber" defaultValue={this.props.profile.data.phoneNumber} required readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="aboutMe" className="col-sm-2 col-form-label">About Me:</label>
                                                    <div className="col-sm-6">
                                                    <textarea class="form-control" id="aboutMe" name="aboutMe" rows="3" defaultValue={this.props.profile.data.aboutMe} readOnly={this.state.readonly} ></textarea>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="company" className="col-sm-2 col-form-label">Company:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="company" defaultValue={this.props.profile.data.company} readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="city" className="col-sm-2 col-form-label">City:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="city" defaultValue={this.props.profile.data.city} readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="country" className="col-sm-2 col-form-label">Country:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="country" defaultValue={this.props.profile.data.country}  readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="school" className="col-sm-2 col-form-label">School:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="school" defaultValue={this.props.profile.data.school} readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="hometown" className="col-sm-2 col-form-label">Hometown:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="hometown" defaultValue={this.props.profile.data.hometown} readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="languages" className="col-sm-2 col-form-label">Languages:</label>
                                                    <div className="col-sm-6">
                                                        <input type="text" className="form-control" name="languages" defaultValue={this.props.profile.data.languages} readOnly={this.state.readonly} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="Gender" className="col-sm-2 col-form-label">Gender:</label>
                                                    <div className="col-sm-6 radio">
                                                        <label> <input type="radio" name="gender" checked={this.state.isMale} onChange={this.onGenderMaleChanged} disabled={this.state.isDisabled} />Male</label>&nbsp;&nbsp;
                                            <label> <input type="radio" name="gender" checked={this.state.isFemale} onChange={this.onGenderFemaleChanged} disabled={this.state.isDisabled}  />Female</label>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                            <div className="col-sm-8">
                                                {divButton}
                                                </div>
                                            </div>
                                            </div>

                                            
                                        </div>
                                    </form>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

Profile.propTypes = {
    getProfile : propTypes.func,
    profile : propTypes.object
}

const mapStateToProps = state => ({
    profile : state.profile.profileDetails,
    removeProfilePic : state.profile.responseMsg
});

export default connect(mapStateToProps, { getProfile , removeProfilePic, updateProfile, uploadProfilePic })(Profile);