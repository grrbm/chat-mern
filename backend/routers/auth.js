const express = require('express'),
      router = express.Router({mergeParams: true}),
      User = require('../models/user'),
      jwt = require('jsonwebtoken'),
      middleware = require('../middleware/index');

// validate the user credentials
router.post('/auth/signin', async function (req, res) {
  try{
    console.log("credentials: email-"+req.body.email+", password-"+req.body.password);
    const user = await User.findByCredentials(req.body.email, req.body.password);
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

router.post('/auth/signoutall', middleware.auth, async function (req, res) {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});


//user confirmation by token
router.post('/auth/validate/:token', async (req,res) => {
  try {
    const tk = req.params.token;
    const decoded = await jwt.verify(tk,process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    const token = user.tokens.find((e) => { e.token === req.params.token });
    if (!token)
    {
      return res.status(404).send("Your token has expired.");
    }
    if (token.validated)
    {
      user.set({ validated: true });
      await user.save();
      return res.status(200).send(user);
    }
  } catch(e){
    return res.status(500).send("Error: "+e.toString())
  }


});

module.exports = router;