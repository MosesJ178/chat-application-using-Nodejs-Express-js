const express = require('express');
const user = require('../models/userschema');

const router = express.Router();

router.post('/registerUser',async(req,res)=>{
    const newUserDetails = new user({...req.body});
    const newUser = await newUserDetails.save();
    res.status(200).json(newUser);
})

router.get('/searchUser',async(req,res)=>{
    const {name} = req.body;
    const searchResult = await user.findOne({name}).select("-password -chatList -__v");
    res.status(200).json(searchResult);
})

module.exports = router;