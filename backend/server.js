const path = require("path");
const http = require("http");
const https = require("https");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const mongoose = require("mongoose");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
require("dotenv").config({ path: __dirname + "/.env" });
const User = require("./models/user");
const UserRouter = require("./routers/user"),
  AuthRouter = require("./routers/auth");

const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();

const app = express();
const isProd = process.env.ENVIRONMENT === "production";
const server = isProd ? https.createServer(app) : http.createServer(app);
const io = socketio(server);
console.log("Environment: " + process.env.ENVIRONMENT + ", isProd: " + isProd);

const port = process.env.PORT || 4000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

const proxy = "";

app
  .use(cors())
  .use(bodyParser.json({ limit: "50mb" }))
  .use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
  .use(proxy, router);

app.use(proxy, AuthRouter);
app.use(proxy, UserRouter);

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("join", ({ username, room }, callback) => {
    console.log(
      "Join event has been called. username: " + username + ", room: " + room
    );
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    //socket.emit('message', generateMessage('ChatBot','Welcome!'))
    //socket.broadcast.to(room).emit('message', generateMessage('ChatBot',`${user.username} has joined!`))
    const users = getUsersInRoom(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: users,
    });

    return callback(undefined, users);
  });

  socket.on("sendMessage", (message, callback) => {
    console.log("sendMessage called");
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback();
    }
  });
  socket.on("sendLocation", (coords, callback) => {
    console.log("sendLocation called");
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    console.log("disconnect called");
    const user = removeUser(socket.id);
    if (user) {
      //io.to(user.room).emit('message',generateMessage('ChatBot',`${user.username} has left!`))
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

// --------------------------------------------------------------------
// MONGODB/MONGOOSE
// --------------------------------------------------------------------
const databaseUri = "mongodb://localhost:27017/test-database";
async function connectDB() {
  const connection = await mongoose
    .connect(databaseUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
    })
    .then(() => console.log(`connected to ${databaseUri}`))
    .catch((err) => console.log(`Error on db connection:  ${err.message}`));
  try {
    const user = new User({ username: "admin", password: "adminpass" });
    const token = await user.generateAuthToken();
    await user.save();
    console.log(`Admin user created successfully !`);
  } catch (e) {
    if (e.toString().substring(0, 18) === "MongoError: E11000") {
      console.log("Admin has already been created.");
    }
  }
}
connectDB();

// --------------------------------------------------------------------
// SERVER LISTENER
// --------------------------------------------------------------------
server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
