import React from 'react'

function JoinPage(){
    return (
        <div id="join-page" className="centered-form">
            <div className="centered-form__box">
                <h1>Join</h1>
                <form>
                    <label>Display name</label>
                    <input type="text" name="username" placeholder="Display name" required=""></input>
                    <label>Room</label>
                    <input type="text" name="room" placeholder="Room" required=""></input>
                    <button>Join</button>
                </form>
            </div>
        </div>
    )
}

export default JoinPage