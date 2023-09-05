const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.post("/user/signup", userController.postSignup);

module.exports = router;
