const express = require('express');
const message = require('../models/messageschema');
const chat = require('../models/chatschema');
const user = require('../models/userschema');
const status = require('../models/statusschema');
const router = express.Router();

router.post('/createGroup',async(req,res)=>{
    const {Admin,members,group,groupName} = req.body;
    try{
        const newGroup = await chat.create({Admin,members,group});
        // await user.updateMany({name:{$in:members}},{$push:{chatList:newGroup}},{new:true});
        await user.updateMany({name:{$in:members}},{$push:{chatListDetails:{chatListName:groupName}}},{new:true});
        return res.status(200).json(newGroup);
    }
    catch(err){
        return res.status(400).json({error: 'err while creating group', details: err});
    }
})


router.post('/',async(req,res)=>{
    const {sender,receiver,msg,group,chatId} = req.body;
    if(!group){//handle individual conversation
        try{
            const { _id } = await message.create({ sender, msg });
            if(chatId == undefined){//new chat conversation
                const chatRoomMembers = [sender,receiver];
                const newChatID = await chat.create({ members: chatRoomMembers, group,messages:[_id]});
                // await user.updateMany({name:{$in:[sender,receiver]}},{$push:{chatListDetails:newChatID,chatUser:receiver}})
                await user.updateOne({name:sender},{$addToSet:{chatListDetails:{chatListName:receiver,chatListConversationId:newChatID}}})
                await user.updateOne({name:receiver},{$addToSet:{chatListDetails:{chatListName:sender,chatListConversationId:newChatID}}})
                return res.status(200).json(newChatID);
            }
            else{//old conversation
                const oldChatID = await chat.findByIdAndUpdate(chatId,{$push:{messages:_id}},{ new: true })
                return res.status(200).json(oldChatID);
            }
        }
        catch(err){
            return res.status(400).json('err while posting msg',err);
        }
    }else{//handle group conversation
        try{
            const groupMsg = await message.create({sender,msg});
            const group_msg_ref = await chat.findByIdAndUpdate(chatId,{$push:{messages:groupMsg}},{new:true});
            return res.status(200).json(group_msg_ref);
        }
        catch(err){
            return res.status(400).json('err while posting msg in group',err);
        }
    }
})

router.delete('/',async(req,res)=>{
    const {msg_id} = req.body;
    try{
        const deletedMessage = await message.findByIdAndUpdate(msg_id,{msg:"You deleted this message"},{new:true})
        return res.status(200).json(deletedMessage);
    }
    catch(err){
        return res.status(400).json('err while deleting msg',err);
    }
})


router.post('/Status',async(req,res)=>{
    try{
        const {sender,statusMsg} = req.body;
        const statusDoc = await status.create({sender,statusMsg})
        return res.status(200).json(statusDoc);
    }
    catch(err){
        return res.status(400).json({error:"err while uploading status",details:err})
    }
})

router.get('/Status',async(req,res)=>{
    const {currUser,neighbourUsers} = req.body;
    const allUsers = [...neighbourUsers,currUser]
    try{
        const allStatus = await status.find({sender:{$in:allUsers}});
        return res.status(200).json(allStatus);
    }
    catch(err){
        return res.status(400).json({error:"err while fetching all status",details:err})
    }
})

router.post('/deleteStatus',async(req,res)=>{
    const {statusDocId} = req.body;
    try{
        await status.findByIdAndDelete(statusDocId);
        return res.status(200).json("status deleted successfully");
    }
    catch(err){
        return res.status(400).json({error:"err while deleting status",details:err})
    }
})


module.exports = router;