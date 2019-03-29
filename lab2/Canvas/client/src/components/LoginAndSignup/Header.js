import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import '../cssFiles/header.css';

class Header extends Component{
    render(){
        return(
            <div className="header">
                <div className="pb-1 border-bottom">
                    <h4 className="text-center">Connecting to <span className="appName">Canvas</span></h4>
                </div>
            </div>
        )
    }
}
export default Header;