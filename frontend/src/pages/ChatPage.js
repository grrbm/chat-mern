import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
const io = require('socket.io'),
      Qs = require('qs');

function ChatPage(props){
    // const location = useLocation();
    // useEffect(()=>{
    //     const socket = io()
    //     const {username, room} = Qs.parse(location.search.slice(1))
    //     socket.emit('join', {username, room: room.toLowerCase()}, (error) => {
    //         if (error) {
    //             alert(error)
    //             location.href = '/'
    //         }
    //     })
    // },[])
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
                        <input name="message" placeholder="Message" required="" autocomplete="off"/>
                        <button>Send</button>
                    </form>
                    <button id="send-location">Send Location</button>
                </div>

            </div>
        </div>
    )
}

export default ChatPage


