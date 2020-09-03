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
    res.status(200).send(user);
  } catch(e){
    res.status(400).send(e.toString());
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