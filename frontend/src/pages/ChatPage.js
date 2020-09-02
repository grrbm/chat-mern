import React, { useEffect } from 'react'
const io = require('socket.io-client');

function ChatPage(props){
    useEffect(()=>{
        const socket = io('http://localhost:4000')
        const username = props.location.state.username;
        const room = props.location.state.room;
        socket.emit('join', {username, room: room.toLowerCase()}, (error) => {
            if (error) {
                alert(error)
                props.location.href = '/'
            }
        })
    },[])
    return (
        <div id="chat-page" className="chat">
            <div id="sidebar" className="chat__sidebar">
                <h2 className="room-title"></h2>
                <h3 className="list-title">{props.location.state.room}</h3>
                <ul className="users">
                    <li>{props.location.state.username}</li>
                </ul>
            </div>
            <div className="chat__main">
                <div id="messages" className="chat__messages">
                    <div className="message">
                        <p>
                            <span className="message__name">Admin</span>
                            <span className="message__meta">9:20 am</span>
                        </p>
                        <p>Welcome!</p>
                    </div>
                </div>
                <div className="compose">
                    <form id="message-form">
                        <input name="message" placeholder="Message" required="" autoComplete="off"/>
                        <button>Send</button>
                    </form>
                    <button id="send-location">Send Location</button>
                </div>

            </div>
        </div>
    )
}

export default ChatPage


