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
      fileID: this.makeid(),
      files:[]
    };
  },
  responseGoogle: (response) => {
    console.log(response);
  },
  render() {
    return (
      <div>
        <User mainState={this}></User>
        <Toolbar mainState={this} makeid={this.makeid}></Toolbar>
        <TextField mainState={this}></TextField>
        <Display currentText={this.state.currentText}></Display>
        <FileList mainState={this}></FileList>

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
  onClickSave: async (mainState) => {
    
    const fileContent = document.getElementById("markdown_input").value;
    const fileTitle = document.getElementById("file_name").value;
    const currentGoogleUser = gapi.auth2.getAuthInstance().currentUser.get();
    const userToken = currentGoogleUser.getAuthResponse().id_token;
    fileApi.saveFile(fileTitle, fileContent, mainState.state.fileID, userToken).then(()=>{
      return fileApi.getFile(userToken)
    }).then((files)=>{
      mainState.setState({files: files});;
    });
    
  },
  createNewFile: (mainState, makeid) =>{
    document.getElementById("markdown_input").value = '';
    document.getElementById("file_name").value = '';
    const newID = makeid();
    mainState.setState({fileID: newID,
                        currentText:''
    });
  },

  render() {
    return (
      <div>
        <input type="text" id="file_name"></input>
        <button onClick={()=>this.onClickSave(this.props.mainState)}>save</button>
        <button onClick={this.onClickGetPdf}>generate PDF</button>
        <button onClick={()=>this.createNewFile(this.props.mainState, this.props.makeid)}>new file</button>
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
    const currentGoogleUser = gapi.auth2.getAuthInstance().currentUser.get();
    const currentToken = currentGoogleUser.getAuthResponse().id_token;
    fileApi.getFile(currentToken).then((files)=>{
      this.props.mainState.setState({files: files});
    });
    this.props.mainState.setState({
      loggedin: true,
      userInfo: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile(),
    });
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

var FileList = React.createClass({
  updateCurrentFile: function(file){
    this.props.mainState.setState({
      currentText: file.fileContent,
      fileID: file.fileID
    
  });
    document.getElementById("markdown_input").value = file.fileContent;
    document.getElementById("file_name").value = file.fileTitle;


  },
  render() {
    var resultNodes = this.props.mainState.state.files.map((file)=>{
      return(
        <FileListNode file={file} updateCurrentFile={this.updateCurrentFile}/>
      );
    });
    return (
      <div>
        {resultNodes}
      </div>
    )
  }
})

var FileListNode = React.createClass({
  render(){
    return(
      <div onClick={()=>this.props.updateCurrentFile(this.props.file)}>
        {this.props.file.fileTitle}
      </div>
    )
  }
})

export default App;
