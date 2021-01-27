import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css'

class App extends Component {

  state = {
    isConnected:false,
    id: null,
    name: 'Maher',
    friends: [],
    text: '',
    oldMessages: []
  }
  socket = null
  componentDidMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({id: this.socket.id, name: this.state.name})
      this.setState({isConnected:true})
    })

    // this.socket.on('youare', (answer) => {
    //   this.setState({id: answer.id})
    //   console.log(answer.id)
    // })

    this.socket.on('next', (message_from_server) => console.log(message_from_server))

    this.socket.on('pong!', () => {
      console.log('the server answered!')
    })
    this.socket.on('new disconnection', (oldPeep) => {
      this.setState({friends:   this.state.friends.filter(peep =>peep !== oldPeep )})
    })
    
    this.socket.on('new connection', (newPeep) => {
      this.setState({friends: [...this.state.friends, newPeep]})
    })

    this.socket.on('peeps', (friends) => {
      this.setState({friends: [...friends]})
    })
    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

    this.socket.on('room', (old_messages )=> this.setState({oldMessages: [...old_messages]} ))

  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    return (
      <div className="App">
          <div className="status">
          {this.state.isConnected ? 'Connected' : 'disconnected'} as <span>{this.state.name}</span> with id: <span>{this.state.id}</span>
          </div>    
          <div className="container">
          <div className="message-field">
        <input type="text" id='blah' onChange={(e) =>this.setState({ text: e.target.value })} />
        </div>
        <button onClick={() => {this.socket.emit('message', {id: this.state.id, name: this.state.name, text: this.state.text})}}>Send</button>   
        </div>
          <div className="messages">
          <ul>
        {this.state.oldMessages.map(item => 
          <li><span className="names">{item.name}</span> @ <span className="date"> {item.date}</span><br></br><span className="user-message">{typeof item.text === "string" ? item.text : ""}</span></li>
          )}
      </ul>
          </div>
          </div>
    );
  }
}

export default App;