import React, { useState, useEffect, useRef } from 'react'
const io = require('socket.io-client');
const moment = require('moment');

const autoscroll = () => {

    const $messages = document.querySelector('#messages');

    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

function ChatPage(props){
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const socket = useRef(null);

    function handleSendMessage(e){
        e.preventDefault();

        const $messageForm = document.querySelector('#message-form')
        const $messageFormButton = $messageForm.querySelector('button')
        const $messageFormInput = $messageForm.querySelector('input')
        const message = $messageFormInput.value;
    
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
        socket.current.on('message',(message) => {
            setMessages(messages => [...messages,message]);
            autoscroll();
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
                    {
                        messages.map((message)=>(
                            <div className="message">
                                <p>
                                    <span className="message__name">{ message.username }</span>
                                    <span className="message__meta">
                                        { moment(message.createdAt).format('h:mm a') }
                                    </span>
                                </p>
                                <p>{ message.text }</p>
                            </div>
                        ))
                    }
                    
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


