const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    sender:String,
    statusMsg:String
})

const status = mongoose.model("status",statusSchema);

module.exports = status;