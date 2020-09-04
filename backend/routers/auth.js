const express = require('express'),
      router = express.Router({mergeParams: true}),
      User = require('../models/user'),
      jwt = require('jsonwebtoken'),
      middleware = require('../middleware/index');

// validate the user credentials
router.post('/auth/signin', async function (req, res) {
  try{
    console.log("credentials: username-"+req.body.username+", password-"+req.body.password);
    const user = await User.findByCredentials(req.body.username, req.body.password);
    console.log("tokens: "+JSON.stringify(user.tokens));
    return res.status(200).send(user);
  } catch(e){
    console.log("Couldn't find user with these credentials. Creating new...");
    const newUser = await User.addUser(req.body.username, req.body.password);
    if(!newUser){
      return res.status(400).json({
        error: true,
        message: e.toString()
      });
    }
    return res.status(201).send(newUser);
  }   
});

router.post('/auth/signout', middleware.auth, async function (req, res) {
  try {
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token
    })
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;