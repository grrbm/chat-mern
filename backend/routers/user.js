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
  



module.exports = router;