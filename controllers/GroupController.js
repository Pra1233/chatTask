const Message=require("../models/Message");
const User = require("../models/User");
const Group=require("../models/Group");
const GroupUser=require("../models/GroupUser");
const { Op } = require('sequelize');


// //creating group and showing users
const PostGrp=async(req,res)=>{ 
    //   const id=req.user.id;
try{
      const {grp}=req.body;
      const id=req.user.id;
      const response=await Group.create({groupname:grp, adminid:id});
    const resp=await GroupUser.create({UserId:id,GroupId:response.id});
    // console.log("GroupCreation",response);
      const users=await User.findAll({where:{id:{[Op.not]:id}},attributes:['id','name']});
    //  console.log("first",users);
      res.status(201).json({
    group:response,
    user:users,
});   
}
catch(e){
    console.log(e);
    res.status(404).json({success:false,msg:"Group creation fail"})
}
}

const GetAllgroup=async(req,res)=>{ 
try{
       const id=req.user.id;
       console.log(id);
      const groupbelongs=await GroupUser.findAll({where:{UserId:id},attributes:['GroupId']});
       const arrofgroupid=groupbelongs.map(group=>group.GroupId);
    //    console.log("groupbelongs",groupbelongs);     
      //  console.log("arrofgroupid",arrofgroupid);
      const groupname=await Group.findAll({where:{id:arrofgroupid},attributes:['id','groupname','adminid']});
      const grpname= groupname.filter(group=>group.adminid!==id);
    const groupadmin= groupname.filter(group=>group.adminid===id);
     console.log("groupname",grpname);
    const restgroupname=await Group.findAll({where:{id:{[Op.notIn]:arrofgroupid}},attributes:['groupname','id','adminid']}); 
                
    // console.log("rest",restgroupname);
      res.status(201).json({
    groupname:grpname,
    groupadmin:groupadmin,
    restgroupname:restgroupname,
    });    
}

catch(e){
    console.log(e);
    res.status(404).json({success:false,msg:"Group creation fail"})
}
}

const PostUserGroup=async(req,res)=>{
try{
      const {groupid,id}=req.body;
      const response=await GroupUser.create({UserId:id,GroupId:groupid});
res.status(201).json({
    group:response,
   });
     
}
catch(e){
    console.log(e);
    res.status(404).json({success:false,msg:"Group creation fail"})
}

}

const AddRestGroup=async(req,res)=>{
  try{
    const id=req.user.id;
    const adminid=req.params.id;
    // console.log(id);
     const response=await GroupUser.create({UserId:id,GroupId:adminid});
     const groupname=await Group.findOne({where:{id:response.GroupId},attributes:['groupname']})
    //  console.log("groupname",groupname);
     res.status(200).json({ groupname,msg:"AddRestGroup success"})
  
  }
  catch(e){
    console.log(e.message);
    res.status(404).json({ msg:"AddRestGroup Fail"})
  }
}
module.exports = {
PostGrp,PostUserGroup,GetAllgroup,AddRestGroup
};

