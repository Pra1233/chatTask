const Message = require("../models/Message");
const User = require("../models/User");
const Group = require("../models/Group");
const GroupUser = require("../models/GroupUser");
const { Op } = require("sequelize");

// //creating group and showing users
const PostGrp = async (req, res) => {
  //   const id=req.user.id;
  try {
    const { grp } = req.body;
    const id = req.user.id;
    const response = await Group.create({ groupname: grp, adminid: id });
    await GroupUser.create({ UserId: id, admin: true, GroupId: response.id });
    // console.log("GroupCreation",response);
    const users = await User.findAll({
      where: { id: { [Op.not]: id } },
      attributes: ["id", "name"],
    });
    //  console.log("first",users);
    res.status(201).json({
      group: response,
      user: users,
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({ success: false, msg: "Group creation fail" });
  }
};

const GetAllgroup = async (req, res) => {
  try {
    const id = req.user.id;
    //login user belong to group(we get all group belong to this user)
    const groupbelongs = await GroupUser.findAll({
      where: { UserId: id },
      attributes: ["GroupId", "admin"],
    });

    const adminGroupIds = groupbelongs //(we get adminarray belong to this user)
      .filter((group) => group.admin === true)
      .map((group) => group.GroupId); //array of admin

    const admingroupname = await Group.findAll({
      where: { id: adminGroupIds },
      attributes: ["id", "groupname"],
    });
    console.log("admingroupname", admingroupname); //(we get admingroup belong to this user)

    const notadminGroupIds = groupbelongs //Not Admin Group
      .filter((group) => group.admin === false)
      .map((group) => group.GroupId);
    // console.log("notadminGroupIds",notadminGroupIds);
    const notadmingroupname = await Group.findAll({
      where: { id: notadminGroupIds },
      attributes: ["id", "groupname"],
    });
    console.log("notadmingroupname", notadmingroupname);

    const allgroupIds = adminGroupIds.concat(notadminGroupIds); //concat help to store in array
    const notconnectedgroupname = await Group.findAll({
      where: { id: { [Op.notIn]: allgroupIds } },
      attributes: ["id", "groupname", "adminid"],
    });

    res.status(200).json({
      admingroupname: admingroupname,
      notadmingroupname: notadmingroupname,
      notconnectedgroupname: notconnectedgroupname,
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({ success: false, msg: "Group creation fail" });
  }
};

const AddUserInGroup = async (req, res) => {
  try {
    const { id, groupid } = req.body;
    const response = await GroupUser.create({
      UserId: id,
      GroupId: groupid,
      admin: false,
    });
    res.status(201).json({
      group: response,
    });
  } catch (e) {
    console.log(e.message);
    res.status(404).json({ success: false, msg: "Group creation fail" });
  }
};

const AddRestGroup = async (req, res) => {
  try {
    const id = req.user.id;
    const adminid = req.params.id;
    // console.log(id);
    const response = await GroupUser.create({ UserId: id, GroupId: adminid });
    const groupname = await Group.findOne({
      where: { id: response.GroupId },
      attributes: ["groupname"],
    });
    //  console.log("groupname",groupname);
    res.status(200).json({ groupname, msg: "AddRestGroup success" });
  } catch (e) {
    console.log(e.message);
    res.status(404).json({ msg: "AddRestGroup Fail" });
  }
};

// groupController.js

const PromoteUserToAdmin = async (req, res) => {
  try {
    const groupid = req.params.gid;
    const userid = req.params.userid;
    const response = await GroupUser.update(
      { admin: true },
      {
        where: {
          UserId: userid,
          GroupId: groupid,
        },
      }
    );
    res.status(200).json({ success: true, msg: "User promoted to admin" });
  } catch (e) {
    console.log(e.message);
    res
      .status(404)
      .json({ success: false, msg: "Promote user to admin failed" });
  }
};

const PromoteAdminToUser = async (req, res) => {
  try {
    const groupid = req.params.gid;
    const userid = req.params.userid;
    const response = await GroupUser.update(
      { admin: false },
      {
        where: {
          UserId: userid,
          GroupId: groupid,
        },
      }
    );
    res.status(200).json({ success: true, msg: "Admin promoted to user" });
  } catch (e) {
    console.log(e.message);
    res
      .status(404)
      .json({ success: false, msg: "Promote user to admin failed" });
  }
};

// groupController.js

const RemoveUserFromGroup = async (req, res) => {
  try {
    const userid = req.params.userid;
    const groupid = req.params.gid;
    console.log(userid, groupid, "434554545543");
    const response = await GroupUser.destroy({
      where: {
        UserId: userid,
        GroupId: groupid,
      },
    });
    res.status(200).json({ success: true, msg: "User removed from group" });
  } catch (e) {
    console.log(e.message);
    res
      .status(404)
      .json({ success: false, msg: "Remove user from group failed" });
  }
};

const SearchUser = async (req, res) => {
  try {
    const searchtext = req.params.search;
    // console.log(searchtext,"21333333333");
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchtext}%` } },
          { email: { [Op.like]: `%${searchtext}%` } },
          { phone: { [Op.like]: `%${searchtext}%` } },
        ],
      },
    });

    console.log(users, "USERSSSS");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  PostGrp,
  AddUserInGroup,
  GetAllgroup,
  AddRestGroup,
  PromoteUserToAdmin,
  PromoteAdminToUser,
  SearchUser,
  RemoveUserFromGroup,
};
