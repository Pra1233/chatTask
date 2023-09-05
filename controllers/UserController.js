const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("../models/Signup");
const sequelize = require("../util/database");
const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

function isstringValid(string) {
  if (string == undefined || string.length === 0) return true;
  else return false;
}
const postSignup = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { name, email, phone, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email: email },
      transaction: t,
    });
    console.log("34223232", user);
    if (user === null) {
      let salt = 10;
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.log("Unable to create new user");
          res.json({ message: "Unable to create new user" });
        }
        await User.create(
          { name, email, phone, password: hash },
          { transaction: t }
        );
        await t.commit();
        res.status(201).json({ message: "User SignUp Successfully" });
      });
    } else {
      res.status(403).json({ message: "User already exist" });
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json(err);
  }
};

const generateAccessToken = (id, name, phone, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, phone: phone, ispremiumuser },
    "secretkey"
  );
};

// const postLogin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (isstringValid(email) || isstringValid(password)) {
//       document.body.innerHTML += `<h3 style="color:red;">${e}</h3>`;
//       return res.status(400).json({ e: "Bad Parameter, Something is missing" });
//     }
//     const user = await User.findAll({ where: { email } }); //where will give  user of that email
//     if (user.length > 0) {
//       bcrypt.compare(password, user[0].password, (err, resp) => {
//         if (err) {
//           throw new Error("Something is wrong");
//         }

//         if (resp == true) {
//           return res
//             .status(200)
//             .json({
//               success: true,
//               message: "User Logged Successfully",
//               token: generateAccessToken(
//                 user[0].id,
//                 user[0].name,
//                 user[0].ispremiumuser
//               ),
//             });
//         } else {
//           return res
//             .status(400)
//             .json({ success: false, message: "Password is Incorrect" });
//         }
//       });
//     } else {
//       res.status(404).json({ success: false, message: "User Doesnt Exist" });
//     }
//   } catch (e) {
//     res.status(500).json({ success: false, message: e });
//     console.log("ERROR In PostLogin", e);
//   }
// };

module.exports = {
  generateAccessToken,
  //   postLogin,
  postSignup,
};
