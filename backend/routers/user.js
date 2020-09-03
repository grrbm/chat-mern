const express = require('express'),
      router = express.Router({mergeParams: true}),
      User = require('../models/user');

//INDEX - GET all users
router.get('/users', async (req,res) => {
    console.log("REQUEST ::  get all users");
    try{
      const users = await User.find({})
      console.log(JSON.stringify(users));
      return res.send(users)
    } catch(error) {
      return res.status(500).json({
        error: true,
        message: e.toString()
      });
    }
});

// SHOW - get specific user
router.get('/users/:id', async (req,res) => {
  try{
      const user = await User.findById(req.params.id)
      if (!user)
      {
        return res.status(404).send()
      }
      console.log("RETURNING A USER: "+user)
      res.send(user);
  } catch(error) {
      return res.status(500).send(error)
  }
})
  
// CREATE - post a new user
router.post('/users', async (req,res) => {
    console.log(`REQUEST :: create user  ${req.body.username}`);
  
    const newUser = {
      username: req.body.username,
      password: req.body.password,
    };
  
    const alreadyExistent = await User.find({'username': newUser.username});
    
    console.log("alreadyExistent: "+alreadyExistent.username);
    if (alreadyExistent.length > 0)
    {
      console.error(`STATUS :: Conflict`);
      return res.status(409).send();
    }
    
    try{
      const user = new User(newUser);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
      console.log(`STATUS :: Success`);
     } catch (e) {
        console.error(`STATUS :: Oops. Something went wrong. `+e.toString());
        res.status(500).json({
          error: true,
          message: e.toString()
        });
     }
});


module.exports = router;