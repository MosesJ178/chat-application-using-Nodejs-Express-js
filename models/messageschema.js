const mongoose = require('mongoose');
const user = require('../models/userschema');
const messageSchema = new mongoose.Schema({
    sender:{
        type:String
    },
    msg:{
        type:String
    }
},{
    timestamps:true
})

const message = mongoose.model("message",messageSchema);

module.exports = message;