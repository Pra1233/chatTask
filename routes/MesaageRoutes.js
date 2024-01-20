const express = require("express");
const router = express.Router();
const middleware=require('../middleware/auth');
const messageController = require("../controllers/MessageController");

router.post('/message/postmsg',middleware.auth,messageController.PostMessage);

router.get('/message/getmsg',middleware.auth,messageController.getMessage);

router.get('/message/getadminmsg/:gid',middleware.auth,messageController.getAdminOldMessage);

router.get('/users/adminusers/:gid',middleware.auth,messageController.getAdminUsers);




module.exports = router;
