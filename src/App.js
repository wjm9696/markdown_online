/* global gapi */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import GoogleLogin from 'react-google-login';
import Script from 'react-load-script'
var ReactDOM = require('react-dom');
//var socket = io.connect('http://localhost:3000/');
var fileApi = require('./apiRequest/file.js');
var userApi = require('./apiRequest/signInOut.js')
var showdown = require('showdown');

class App extends Component {
  render() {
    return (<div><Main></Main></div>);
  }
}

var Main = React.createClass({
  makeid: function () {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },
  getInitialState: function () {
    return {
      currentText: '',
      loggedin: false,
      userInfo: null,
      fileID: this.makeid()
    };
  },
  responseGoogle: (response) => {
    console.log(response);
  },
  render() {
    return (
      <div>
        <User mainState={this}></User>
        <Toolbar fileID={this.state.fileID}></Toolbar>
        <TextField mainState={this}></TextField>
        <Display currentText={this.state.currentText}></Display>

      </div>
    )
  }
})

var Toolbar = React.createClass({
  onClickGetPdf: () => {
    const content = document.getElementById("markdown_input").value;
    console.log("getCliked");
    fileApi.requestForPdf(content, "12356", "file123456")

  },
  onClickSave: (fileID) => {
    const fileContent = document.getElementById("markdown_input").value;
    const fileTitle = document.getElementById("file_name").value;
    const currentGoogleUser = gapi.auth2.getAuthInstance().currentUser.get();
    const userToken = currentGoogleUser.getAuthResponse().id_token;
    fileApi.saveFile(fileTitle, fileContent, fileID, userToken);
  },

  render() {
    return (
      <div>
        <input type="text" id="file_name"></input>
        <button onClick={()=>this.onClickSave(this.props.fileID)}>save</button>
        <button onClick={this.onClickGetPdf}>generate PDF</button>
        <button></button>
      </div>
    )
  }
})

var TextField = React.createClass({
  onchange: function () {
    let content = document.getElementById("markdown_input").value;
    this.props.mainState.setState({ currentText: content });
  },
  render() {
    return (
      <div>
        <textarea name="Text1" cols="40" rows="5" id="markdown_input" onChange={this.onchange}></textarea>
      </div>
    );
  }
})

var Display = React.createClass({
  getConstructor: function () {
    var converter = new showdown.Converter();
    var text = this.props.currentText;
    return converter.makeHtml(text);
  },
  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.getConstructor() }}></div>
    )
  }
})

var User = React.createClass({
  getInitialState: function () {
    return {
      message: ''
    };
  },
  render() {
    if (this.props.mainState.state.loggedin) {
      return (
        <div>
          <div>welcome {this.props.mainState.state.userInfo && this.props.mainState.state.userInfo.ig}</div><Signout mainState={this.props.mainState}></Signout>
        </div>
      )
    } else {
      return (
        <Signin mainState={this.props.mainState}></Signin>
      )
    }
  }
})

var Signout = React.createClass({
  signOut: function () {
    var auth2 = gapi.auth2.getAuthInstance();
    console.log("?")
    auth2.signOut().then(() => {
      console.log('User signed out.');
      this.props.mainState.setState({ loggedin: false });
    });

  },
  render() {
    return (
      <button onClick={this.signOut}>Sign out</button>
    )
  }
})

var Signin = React.createClass({
  onSignIn: function () {
    this.props.mainState.setState({
      loggedin: true,
      userInfo: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile(),
    });
    console.log("sigin");
    const currentGoogleUser = gapi.auth2.getAuthInstance().currentUser.get();
    const currentToken = currentGoogleUser.getAuthResponse().id_token;
    userApi.signin(currentToken);
  },
  componentDidMount: function () {
    gapi.signin2.render('g-signin2', {
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'width': 400,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onSignIn
    });
  },

  render() {
    return (
      <div>
        <Script url="https://apis.google.com/js/platform.js" />
        <div id="g-signin2" data-longtitle="true"></div>
      </div>
    )
  }
})

export default App;
