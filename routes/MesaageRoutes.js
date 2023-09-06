const express = require("express");
const router = express.Router();
const middleware=require('../middleware/auth');
const messageController = require("../controllers/MessageController");

router.post('/message/postmsg',middleware.auth,messageController.PostMessage);

router.get('/message/getmsg',middleware.auth,messageController.getMessage);

module.exports = router;
