const express = require("express");
const router = express.Router();
const middleware=require('../middleware/auth');
const groupController = require("../controllers/GroupController");

//grp
router.post("/group/creategroup",middleware.auth,groupController.PostGrp);

router.post("/group/addusergroup",middleware.auth,groupController.PostUserGroup);

router.get("/group/getallgroup",middleware.auth,groupController.GetAllgroup);

router.get("/group/addrestgroupname/:id",middleware.auth,groupController.AddRestGroup);


module.exports = router;
