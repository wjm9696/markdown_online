/* global gapi */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import GoogleLogin from 'react-google-login';
import Script from 'react-load-script'
var ReactDOM = require('react-dom');
//var socket = io.connect('http://localhost:3000/');
var pdfApi = require('./apiRequest/requestPDF.js');
var userApi = require('./apiRequest/signInOut.js')
var showdown = require('showdown');

class App extends Component {
  render() {
    return (<div><Main></Main></div>);
  }
}

var Main = React.createClass({
  getInitialState: function () {
    return {
      currentText: ''
    };
  },
  responseGoogle: (response) => {
    console.log(response);
  },
  render() {
    return (
      <div>
        
        <TextField parentState={this}></TextField>
        <Display currentText={this.state.currentText}></Display>
        <Signin></Signin>
      </div>
    )
  }
})

var TextField = React.createClass({
  onClickGetPdf: function () {
    let content = document.getElementById("markdown_input").value;
    console.log("getCliked");
    pdfApi.requestForPdf(content, "12356", "file123456")
  },
  onchange: function () {
    let content = document.getElementById("markdown_input").value;
    this.props.parentState.setState({ currentText: content });
  },
  render() {
    return (
      <div>
        <textarea name="Text1" cols="40" rows="5" id="markdown_input" onChange={this.onchange}></textarea>
        <button onClick={this.onClickGetPdf}>button</button>
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

var Signout = React.createClass({
  signOut: function () {
    var auth2 = gapi.auth2.getAuthInstance();
    console.log("?")
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  },
  render() {
    return (
      <button onClick={this.signOut}></button>
    )
  }
})

var Signin = React.createClass({
  onSignIn: function () {
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
      <Script url="./google.js"/>
      <div id="g-signin2" data-longtitle="true"></div>
      </div>
    )
  }
})

export default App;
