const express = require('express'),
      User = require('../models/user'),
      jwt = require('jsonwebtoken')

// all the middleare goes here
let middleware = {};

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

middleware.auth = async (req,res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next()
    } catch (e){

    }

};

module.exports = middleware;