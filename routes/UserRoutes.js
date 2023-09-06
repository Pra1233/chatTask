const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const messageController = require("../controllers/MessageController");

router.post("/user/signup", userController.postSignup);
router.post("/user/login", userController.postLogin);

module.exports = router;
