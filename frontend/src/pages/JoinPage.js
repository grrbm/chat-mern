import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function JoinPage() {
  const [toChatPage, setToChatPage] = useState(false);
  function handleClick(e) {
    e.preventDefault();
    async function signinUser() {
      const API_URL = "http://localhost:4000";
      try {
        const requestBody = {
          method: "post",
          url: `${API_URL}/auth/signin`,
          data: {
            username: document.querySelectorAll("input")[0].value,
            password: document.querySelectorAll("input")[1].value,
          },
        };
        console.log("this is the request body: " + JSON.stringify(requestBody));
        const result = await axios(requestBody);
        setToChatPage(true);
      } catch (error) {
        console.log("Failed logging in.");
        //Handling error

        if (error.response) {
          if (error.response.status === 401) {
            Swal.fire("Error 401: " + error.response.data.message);
          } else if (error.toString().includes(400)) {
            Swal.fire("Wrong password.");
          } else {
            Swal.fire("Other error: " + error.message);
          }
        } else if (error.request) {
          Swal.fire(
            "The request was made but no response was received. API_URL= " +
              API_URL +
              ", NODE_ENV= " +
              process.env.REACT_APP_ENVIRONMENT
          );
          console.log(error.request);
        } else {
          Swal.fire("Internal Server Error !");
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      }
    }
    signinUser();
  }
  if (toChatPage === true) {
    console.log("username: " + document.querySelectorAll("input")[0].value);
    return (
      <Redirect
        to={{
          pathname: "/chat",
          state: {
            username: document.querySelectorAll("input")[0].value,
            room: "DefaultRoom",
          },
        }}
      />
    );
  }
  return (
    <div id="join-page" className="centered-form">
      <div className="centered-form__box">
        <h1>Join</h1>
        <form>
          <label>Display name</label>
          <input
            type="text"
            name="username"
            placeholder="Display name"
            required={true}
          ></input>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required={true}
          ></input>
          <button onClick={handleClick}>Join</button>
        </form>
      </div>
    </div>
  );
}

export default JoinPage;
