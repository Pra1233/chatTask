const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/Signup");
const sequelize = require("../util/database");
const app = express();

const Message=require("../models/Message");


const PostMessage=async(req,res)=>{
 try{
const {message}=req.body;
const id=req.user.id;
// const user=req.user;
const msg=await Message.create({message,UserId:id});
const user=await Message.findAll({where:{UserId:id},
attributes:['message'],
});
console.log("object,user",user);
res.status(201).json({msg:msg,user:user});

 } 
catch(e){
    console.log(e);
    res.status(404).json({success:false,msg:"Post Message fail"})
}

}

const getMessage=async(req,res)=>{
try{
 const id=req.user.id;
const message=await Message.findAll({where:{UserId:id},attributes:['message']});
console.log(message,"message");
res.status(200).json({message,success:true});
}
catch(e){
  console.log(e);
    res.status(500).json({ e }); 
}

}

module.exports = {
PostMessage,getMessage,
};
