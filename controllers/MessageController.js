const Message=require("../models/Message");
const Sequelize=require("../util/database")


const PostMessage=async(req,res)=>{
 try{
const {message,gid}=req.body;
const id=req.user.id;
// const user=req.user;
if(gid){ //if gid exist
 const msg=await Message.create({message,UserId:id,GroupId:gid}); 
const user=await Message.findAll({where:{UserId:id,GroupId:gid},
attributes:['message'],
});
res.status(201).json({msg:msg,user:user});
}
else{
const msg=await Message.create({message,UserId:id});
const user=await Message.findAll({where:{UserId:id},
attributes:['message'],
});
res.status(201).json({msg:msg,user:user});
}
 } 
catch(e){
    console.log(e);
    res.status(404).json({success:false,msg:"Post Message fail"})
}

}

const getMessage=async(req,res)=>{
try{
 const id=req.user.id;
const message=await Message.findAll({where:{UserId:id,GroupId:null},attributes:['message','id']});
// console.log(message,"message");
res.status(200).json({message:message,success:true});
}
catch(e){
  console.log(e);
    res.status(500).json({ e }); 
}

}

const getAdminOldMessage=async(req,res)=>{
  try{
  const gid=req.params.gid;
  const message=await Message.findAll({where:{GroupId:gid},attributes:['message','id']});
//  console.log(message,"message");
res.status(200).json({message,success:true});

}
  catch(e){
    console.log(e);
  }
}





const getNewMessage=async(req,res)=>{
try{
 const lastpageid=req.query.lastpage;
 if(lastpageid===undefined){
lastpageid=-1;
 }
  const message=await Message.findAll(
      {where:{id:{$gt:lastpageid}},
    attributes:['message','id']});
    // console.log(message,"message");
    res.status(200).json({message,success:true});

// console.log(message,"message");

}
catch(e){
  console.log(e);
    res.status(500).json({ e }); 
}

}



module.exports = {
PostMessage,getMessage,getNewMessage,getAdminOldMessage,
};
