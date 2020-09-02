import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

function JoinPage(){
    const [toChatPage, setToChatPage] = useState(false);
    function handleClick(){
        setToChatPage(true);
    }
    if (toChatPage === true) {
        console.log("username: "+document.querySelectorAll('input')[0].value);
        return <Redirect to={{
            pathname: "/chat",
            state: { username: document.querySelectorAll('input')[0].value, 
                     room: document.querySelectorAll('input')[1].value }
          }} />
        
    }
    return (
        <div id="join-page" className="centered-form">
            <div className="centered-form__box">
                <h1>Join</h1>
                <form>
                    <label>Display name</label>
                    <input type="text" name="username" placeholder="Display name" required="true"></input>
                    <label>Room</label>
                    <input type="text" name="room" placeholder="Room" required="true"></input>
                    <button onClick={handleClick}>Join</button>
                </form>
            </div>
        </div>
    )
}

export default JoinPage