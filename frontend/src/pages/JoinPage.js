import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

function JoinPage(){
    const [toChatPage, setToChatPage] = useState(false);
    function handleClick(e){
        e.preventDefault();
        async function signinUser(){
            try {
                const result = await axios({
                    method:'post',
                    url:'http://localhost:4000/auth/signin', 
                    data: { 
                        username: document.querySelectorAll('input')[0].value, 
                        password: document.querySelectorAll('input')[1].value
                    }
                });
                setToChatPage(true);
            } catch(e) {
                if (e.toString().includes(400))
                {                
                    Swal.fire("Wrong password.");
                }
            }
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