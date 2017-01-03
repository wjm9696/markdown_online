//TODO: change way submit form

import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';


var currentRoomNum = -1;
var currentPos = -1;
var socket=io('http://localhost:3001');
var room = [];

class App extends Component {


  render() {
    return (
      <div className="App">
        <Main></Main>
      </div>
    );
  }
};

var Main = React.createClass({
  getInitialState: function () {
    return {
      mainVisible: true,
      joinVisible: false,
      createVisible: false
    };
  },

  onClickJoin : function(){
    this.setState({
      mainVisible:false,
      joinVisible:true
    });
  },
  onClickCreate : function(){
    console.log('...');
    this.setState({
      mainVisible:false,
      createVisible:true
    });
  },
  render(){
    return (
      <div>
      {this.state.mainVisible
      ?
      <div id="intro-interface-container">
        <button id="join-button" onClick={this.onClickJoin}>join</button>
        <button id="create-button" onClick={this.onClickCreate}>create</button>
      </div>
      :null}
      {this.state.joinVisible?<Join></Join>:null}
      {this.state.createVisible?<Create></Create>:null}
      </div>
    );
  }
});

var Join = React.createClass({
  getInitialState: function () {
    return {
      mainVisible: false,
      joinVisible: true,
      createVisible: false,
      gamePageVisible: false
    };
  },
  onClickJoin : function(){
    console.log('?');

    this.setState({
      joinVisible:false,
      gamePageVisible:true
    });
    var info = new Object();
    info.roomNum = this.state.roomNumber;
    info.name = this.state.nickName;
    socket.emit('join_room',JSON.stringify(info));
    var self = this;
    socket.on('success_room_info',function(info){
    	info = JSON.parse(info);
      console.log('?');

      console.log(info);
    	self.setState({roomNumber:info.roomNum,
                      members:info.members
      });
    });

  },
  onClickBack : function(){
    this.setState({
      mainVisible: true,
      joinVisible: false

    });
  },
  handleNameChange: function(e){
    this.setState({nickName: e.target.value});
  },
  handleRoomChange: function(e){
    this.setState({roomNumber: e.target.value});
  },
  render(){
    return(
      <div>
        {this.state.joinVisible?
        <div id="join-interface">
          	<p>What is the room number</p>
          	<p>Room number</p>
          	<input type="text" name="Room number" id="join-room-number" value={this.state.roomNumber} onChange={this.handleRoomChange}></input>
          	<p>Nickname</p>
          	<input type="text" name="Nickname" id="join-room-name" value={this.state.nickName} onChange={this.handleNameChange}></input>
          	<button id="inner-join-button" onClick={this.onClickJoin}>Join game</button>
            <button id="inner-join-button" onClick={this.onClickBack}>Back</button>
        </div>
        :null}
        {this.state.mainVisible?<Main></Main>:null}
        {this.state.gamePageVisible?<Game members={this.state.members} room={this.state.roomNumber} owner={this.state.nickName}></Game>:null}
      </div>

    )
  }
});

var Create = React.createClass({
  getInitialState: function () {
    return {
      mainVisible: false,
      joinVisible: false,
      createVisible: true,
      gamePageVisible: false,

    };
  },
  onClickCreate : function(){
    var self = this
    this.setState({
      createVisible : false,
      gamePageVisible: true

    });
    socket.emit('create_room',this.state.nickName);
    socket.on('creator_get_room_number',function(roomNum){
      currentRoomNum = roomNum;
      self.setState({room: currentRoomNum})
      console.log(currentRoomNum);

    	currentPos = 0;
    });
    socket.on('success_room_info',function(info){
    	info = JSON.parse(info);
      console.log('?');

      console.log(info);
    	self.setState({roomNumber:info.roomNum,
                      members:info.members
      });
    });

  },
  onClickBack : function(){
    this.setState({
      mainVisible: true,
      createVisible: false
    });
  },
  handleNameChange: function(e){
    this.setState({nickName: e.target.value});

  },
  render(){
    console.log(this.state.members);
    return(
      <div>
        {this.state.createVisible?
            <div id="create-interface">
        	   <p>Create new game</p>
        	    <input type="text" name="Nickname" id="create-room-name" onChange={this.handleNameChange}></input>
        	    <button id="inner-create-button" onClick={this.onClickCreate} >Create game</button>
              <button id="inner-join-button" onClick={this.onClickBack}>Back</button>
            </div>
          :null
        }
        {this.state.mainVisible?<Main></Main>:null}
        {this.state.gamePageVisible?<Game room={this.state.room} owner={this.state.nickName} members = {this.state.members}></Game>:null}
      </div>

    )
  }
});


var Game = React.createClass({
  getInitialState: function () {
    return {
      mainVisible: false,
      joinVisible: false,
      createVisible: true,
      gamePageVisible: false,
      names:this.props.members,
      texts:[]
    };
  },
  componentDidMount: function() {
    var e = document.getElementById('self-type-input');
    e.oninput = function(){
      var info = new Object();
      info.text = e.value;
      info.room = this.props.room;
      info.name = this.props.owner;
      info = JSON.stringify(info);
      socket.emit('type_change',info);
    }.bind(this);
    socket.on('text_update',function(msg){
      msg = JSON.parse(msg);
      var pos = msg.pos;
      var text =msg.text;
      console.log(text);
      var oldtexts = this.state.texts;
      oldtexts[pos]=text;
      this.setState({texts:oldtexts});
      console.log(this.state.texts);
    }.bind(this));
  },
  render(){
    var temp = this.props.members;
    let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);
    // console.log("...");
    // console.log(this.props.members);
    // console.log(this.state.texts);
    //var nested = zip(this.props.member,this.state.texts);
    var rows = [];
    if(this.props.members!==undefined){
    for(var i = 0; i<this.props.members.length;i++){
      rows.push(
        <div>
          <div>{this.props.members[i]}</div>
          <div>{this.state.texts[i]}</div>
        </div>
      );
    }};
    //var resultList = nested.map(function(name){
    //   return(
    //     <div>{name+"......"}</div>
    //   );
    // });
    var resultList = <div>{rows}</div>
    return(
      <div>
        <div id="room-number-container">Room {this.props.room}</div>
        <div>{this.props.owner}</div>
        <div>
         <input type="" name="" id="self-type-input"></input>
        </div>
        {resultList}
      </div>
    )
  }
});

var Player = React.createClass({
  render(){

  }
})

export default App;
