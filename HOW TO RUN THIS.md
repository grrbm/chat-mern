# Locally

Open a terminal:

mongod --config /opt/homebrew/etc/mongod.conf
(use this on a new terminal to run mongod on a MacOS)

Open other terminal:

cd backend && yarn start

Open other terminal:

cd frontend && yarn start

# If you need to debug Socket.IO on the browser

## Type this on chrome console and refresh the page !!

localStorage.debug = '\*';

In order to see all the client debug output, run the above command on the browser console – including the desired scope – and reload your app page:
