const mongoose = require('mongoose');
const message = require('../models/messageschema');
const chatSchema = new mongoose.Schema({
    Admin:String,
    members:[
        {
            type:String
        }
    ],
    group:{
        type:Boolean,
        default:false
    },
    messages:[
        {
            type:mongoose.Types.ObjectId,
            ref:message
        }
    ]
})

const chat = mongoose.model('chat',chatSchema);

module.exports = chat;