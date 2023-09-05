const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.post("/user/signup", userController.postSignup);
router.post("/user/login", userController.postLogin);

module.exports = router;
