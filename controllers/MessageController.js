const Message = require("../models/Message");
const User = require("../models/User");
const Group = require("../models/Group");
const GroupUser = require("../models/GroupUser");
const { Op } = require("sequelize");
const Sequelize = require("../util/database");

// const io = require("socket.io")(3000, {
//   cors: {
//     origin: "http://192.168.0.107:5500",
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     // allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
// });

const PostMessage = async (req, res) => {
  try {
    const { message, gid } = req.body;
    const id = req.user.id;
    const name = req.user.name;

    if (gid) {
      //if gid exist
      const msg = await Message.create({
        message,
        name,
        UserId: id,
        GroupId: gid,
      });

      res.status(201).json({ msg: msg, userid: id });
    } else {
      const msg = await Message.create({ message, name, UserId: id });
      res.status(201).json({ msg: msg, userid: id });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ success: false, msg: "Post Message fail" });
  }
};

//private Message
const getMessage = async (req, res) => {
  try {
    const id = req.user.id;
    const message = await Message.findAll({
      where: { UserId: id, GroupId: null },
      attributes: ["message", "name", "UserId"],
    });
    // console.log(message,"message");
    res.status(200).json({ message: message, userid: id, success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const getAdminOldMessage = async (req, res) => {
  try {
    const name = req.user.name;
    const userid = req.user.id;
    const gid = req.params.gid;
    const message = await Message.findAll({
      where: { GroupId: gid },
      attributes: ["message", "name", "UserId"],
    });
    //  console.log(message,"message");

    res
      .status(200)
      .json({ message: message, name: name, userid: userid, success: true });
  } catch (e) {
    console.log(e);
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const userid = req.user.id;
    const gid = req.params.gid;

    const Users = await GroupUser.findAll({
      where: {
        GroupId: gid,
        UserId: {
          [Op.not]: userid, // Exclude the UserId equal to req.user.id
        },
      },
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("UserId")), "UserId"],
      ],
    });
    const userIdArray = Users.map((user) => user.UserId); //storing userid in array
    console.log(Users);
    const user = await User.findAll({
      where: { id: userIdArray },
      attributes: ["name", "id"],
    });

    res.status(200).json({ user: user });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  PostMessage,
  getMessage,
  getAdminOldMessage,
  getAdminUsers,
};
