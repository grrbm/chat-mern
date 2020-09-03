import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

function JoinPage(){
    const [toChatPage, setToChatPage] = useState(false);
    function handleClick(){
        async function signinUser(){
            const result = await axios.post('localhost:4000/auth/signin', {
                username: document.querySelectorAll('input')[0].value, 
                password: document.querySelectorAll('input')[1].value
            });
            console.log("Result: "+JSON.stringify(result));
            //setToChatPage(true);
        }
        signinUser();
    }
    if (toChatPage === true) {
        console.log("username: "+document.querySelectorAll('input')[0].value);
        return <Redirect to={{
            pathname: "/chat",
            state: { username: document.querySelectorAll('input')[0].value, 
                     room: 'DefaultRoom' }
          }} />
        
    }
    return (
        <div id="join-page" className="centered-form">
            <div className="centered-form__box">
                <h1>Join</h1>
                <form>
                    <label>Display name</label>
                    <input type="text" name="username" placeholder="Display name" required={true}></input>
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" required={true}></input>
                    <button onClick={handleClick}>Join</button>
                </form>
            </div>
        </div>
    )
}

export default JoinPage