import React, { useState, useEffect, useRef } from "react";
const io = require("socket.io-client");
const moment = require("moment");
const Datetime = require("react-datetime");

const autoscroll = () => {
  const $messages = document.querySelector("#messages");

  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //Visible height
  const visibleHeight = $messages.offsetHeight;

  //Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled ?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

function ChatPage(props) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [usernameFilter, setUsernameFilter] = useState();
  const [dateFilter, setDateFilter] = useState();
  const [sorting, setSorting] = useState("newest");
  const socket = useRef(null);

  function handleSendMessage(e) {
    e.preventDefault();

    const $messageForm = document.querySelector("#message-form");
    const $messageFormButton = $messageForm.querySelector("button");
    const $messageFormInput = $messageForm.querySelector("input");
    const message = $messageFormInput.value;

    $messageFormButton.setAttribute("disabled", "disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    socket.current.emit("sendMessage", message, (error) => {
      $messageFormButton.removeAttribute("disabled");
      if (error) {
        return console.log(error);
      }
    });
  }
  function handleChangeUsernameFilter(e) {
    console.log(e.target.value); //logs the user event to the console
    setUsernameFilter(e.target.value);
  }
  function handleChangeDateFilter(date) {
    console.log("date is " + date);
    setDateFilter(date);
  }
  function handleSortingChange(e) {
    console.log("sorting changed to " + e.target.value);
    setSorting(e.target.value);
  }
  useEffect(() => {
    const socketURL =
      process.env.REACT_APP_ENVIRONMENT === "production"
        ? "https://guilhermechatapp.xyz/socket.io"
        : "http://localhost:4000";
    socket.current = io(socketURL);
    const username = props.location.state.username;
    const room = props.location.state.room;
    // client-side
    socket.current.on("connect", () => {
      console.log("Connected: " + socket.current.id); // x8WIv7-mJelg7on_ALbx
    });
    socket.current.on("connected", () => {
      console.log("Connected 2: " + socket.current.id); // x8WIv7-mJelg7on_ALbx
    });
    socket.current.on("hello", (arg1, arg2, arg3) => {
      console.log("Just caught hello from server !");
      console.log(arg1); // 1
      console.log(arg2); // "2"
      console.log(arg3); // { 3: '4', 5: ArrayBuffer (1) [ 6 ] }
    });

    socket.current.on("disconnect", () => {
      console.log("Diconnected: " + socket.current.id); // undefined
    });
    socket.current.on("roomData", ({ room, users }) => {
      setUsers(users);
    });
    socket.current.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
      autoscroll();
    });
    console.log(
      "emitting join. username: " + username + ", room: " + room.toLowerCase()
    );
    socket.current.emit(
      "join",
      { username, room: room.toLowerCase() },
      (error, users) => {
        if (error) {
          alert(error);
          props.location.href = "/";
          return;
        }
        setUsers(users);
        console.log("These are the users: " + JSON.stringify(users));
      }
    );
  }, []);
  function apply(message, filter) {
    var comparison = moment(message.createdAt).isSame(
      filter.createdAt,
      "minute"
    );
    if (filter.createdAt === undefined || filter.createdAt.length === 0) {
      comparison = true;
    }
    console.log(
      "checking " +
        message.createdAt +
        " against " +
        moment(filter.createdAt).format() +
        ": " +
        comparison
    );
    return (
      (message.username.lastIndexOf(filter.username, 0) === 0 || //checks if is prefix
        filter.username === undefined ||
        filter.username.length === 0) &&
      comparison
    );
  }
  return (
    <div id="chat-page" className="chat">
      <div id="sidebar" className="chat__sidebar">
        <div id="room-area">
          <h2 className="room-title">
            Welcome,{" "}
            {props.location.state.username === "admin"
              ? "Admin"
              : props.location.state.username}
          </h2>
          <h3 className="list-title">In this Room:</h3>
          <ul className="users">
            {users.map((user) => (
              <li>{user.username}</li>
            ))}
          </ul>
        </div>
        {props.location.state.username === "admin" ? (
          <div id="admin-area">
            <div className="content">
              <h3 className="list-title">Admin Area</h3>
              <input
                id="username-filter"
                type="text"
                onChange={handleChangeUsernameFilter}
                placeholder="Filter username"
                autoComplete="off"
              />
              <Datetime
                inputProps={{ placeholder: "Pick a date and time" }}
                timeFormat={"HH:mm"}
                onChange={handleChangeDateFilter}
              />
              <select
                id="sorting"
                onChange={handleSortingChange}
                value={sorting}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="chat__main">
        <div id="messages" className="chat__messages">
          {sorting === "newest"
            ? messages
                .filter((message) =>
                  apply(message, {
                    username: usernameFilter,
                    createdAt: dateFilter,
                  })
                )
                .map((message) => (
                  <div className="message">
                    <p>
                      <span className="message__meta">
                        {moment(message.createdAt).format("DD/MM/YYYY")}
                      </span>
                      <span className="message__name">{message.username}</span>
                      <span className="message__meta">
                        {moment(message.createdAt).format("HH:mm")}
                      </span>
                    </p>
                    <p>{message.text}</p>
                  </div>
                ))
            : messages
                .filter((message) =>
                  apply(message, {
                    username: usernameFilter,
                    createdAt: dateFilter,
                  })
                )
                .map((message) => (
                  <div className="message">
                    <p>
                      <span className="message__meta">
                        {moment(message.createdAt).format("DD/MM/YYYY")}
                      </span>
                      <span className="message__name">{message.username}</span>
                      <span className="message__meta">
                        {moment(message.createdAt).format("HH:mm")}
                      </span>
                    </p>
                    <p>{message.text}</p>
                  </div>
                ))
                .reverse()}
        </div>
        <div className="compose">
          <form id="message-form">
            <input
              name="message"
              placeholder="Message"
              required={true}
              autoComplete="off"
            />
            <button onClick={handleSendMessage}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
