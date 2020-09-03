import React, { useState, useEffect, useRef } from 'react'
const io = require('socket.io-client');

function ChatPage(props){
    const [users, setUsers] = useState([]);
    const socket = useRef(null);

    function handleSendMessage(e){
        e.preventDefault();
    
        const message = e.target.elements.message.value;

        const $messageForm = document.querySelector('#message-form')
        const $messageFormButton = $messageForm.querySelector('button')
        const $messageFormInput = $messageForm.querySelector('input')
    
        $messageFormButton.setAttribute('disabled','disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    
    
        
        socket.current.emit('sendMessage', message, (error) => {
            $messageFormButton.removeAttribute('disabled')
            if (error){
                return console.log(error)
            }
        })
        
    }
    useEffect(()=>{
        socket.current = io('http://localhost:4000');
        const username = props.location.state.username;
        const room = props.location.state.room;
        socket.current.on('roomData', ({room, users}) => {
            setUsers(users);
        })
        socket.current.emit('join', {username, room: room.toLowerCase()}, (error, users) => {
            if (error) {
                alert(error)
                props.location.href = '/'
                return;
            }
            setUsers(users)
            console.log("These are the users: "+JSON.stringify(users));
        })
    },[])
    return (
        <div id="chat-page" className="chat">
            <div id="sidebar" className="chat__sidebar">
                <h2 className="room-title"></h2>
                <h3 className="list-title">{props.location.state.room}</h3>
                <ul className="users">
                    {users.map((user)=> (<li>{user.username}</li>))}
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
                        <input name="message" placeholder="Message" required={true} autoComplete="off"/>
                        <button onClick={handleSendMessage}>Send</button>
                    </form>
                    <button id="send-location">Send Location</button>
                </div>

            </div>
        </div>
    )
}

export default ChatPage


