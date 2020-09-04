<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This project is a straightforward chat application. It uses websockets for communication between server and clients, and updates the chat screen in real time.

### Built With
The project was built with the MERN stack for web development (MongoDB, Express, React.js, Node.js)
* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [React.js](https://reactjs.org/)
* [Node.js](https://nodejs.org/)



### Installation (Windows)
The application can be installed and tested in a few simple steps.

1. Clone the repo, and open the cloned repo's folder.
  ```sh
git clone https://github.com/grrbm/chat-mern.git
  ```
2. Open 'backend' folder and install
  ```sh
  npm install
  ```
3. Open 'frontend' folder and install
  ```sh
  npm install
  ```
4. Open a new terminal and run MongoDB
  ```JS
  mongod
  ```
5. Open a second new terminal, and run the server from the project root
  ```JS
  npm run server
  ```
6. Open a third new terminal, and run the client from the project root
  ```JS
  npm start
  ```


<!-- USAGE EXAMPLES -->
## Usage

As a Regular User, your basic use case is to join the chat room to send/receive messages. When a new username and password combination is used on the Join Screen (one that the server hasn't seen before),
a new User is created in the database via a call to the backend.

You can also login as an Admin, for testing purposes. The admin credentials are populated in the database the first time you run the server. The admin credentials are the following:

  ```sh
username: admin
password: adminpass
  ```
[![Product Name Screen Shot][join-screenshot]](https://example.com)

As an admin, you have access to the Admin Area panel.

You can use this panel to filter the chat's messages by Date and Time, as well as by username. It's also possible to reverse the order the chat's messages appear, Newest or Oldest messages first.

[![Product Name Screen Shot][feature-screenshot]](https://example.com)


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Guilherme Reis - [LinkedIn](https://www.linkedin.com/in/guilherme-reis-1691b597/) - [Portfolio](https://guilhermereisrbm.netlify.app/) -  grrbm2@gmail.com

Project Link: [https://github.com/grrbm/chat-mern](https://github.com/grrbm/chat-mern)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Socket.io](https://socket.io/)
* [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
* [Mongoose](https://mongoosejs.com/)
* [Axios](https://github.com/axios/axios)
* [react-datetime](https://github.com/YouCanBookMe/react-datetime)
* [sweetalert2](https://sweetalert2.github.io/)
* [moment](https://momentjs.com/)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=flat-square
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[feature-screenshot]: images/filterby.png
[join-screenshot]: images/joinscreen.PNG
