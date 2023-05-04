const mongoose = require('mongoose');
const chat = require('../models/chatschema');
const userschema = new mongoose.Schema({
    name:{
        type:String
    },
    password:{
        type:String
    },
    chatListDetails:[
        {
            chatListName:{
                type:String
            },
            chatListConversationId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:chat
            }
        }
    ]
})
const user = mongoose.model("user",userschema);
module.exports = user;