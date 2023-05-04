const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());

app.use("/user",require('./routes/userRoute'));
app.use("/chatMsg",require('./routes/messageRoute'));


mongoose.connect("mongodb://127.0.0.1:27017/ChatApp?directConnection=true")
.then(()=>{
    console.log("connection sucessfull");
})
.catch((err)=>{
    console.log("err db",err);
})

app.listen(5000,()=>{
    console.log("server is listening on port 5000");
})