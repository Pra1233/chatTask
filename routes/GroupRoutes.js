const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const groupController = require("../controllers/GroupController");

//grp
router.post("/group/creategroup", middleware.auth, groupController.PostGrp);

router.post(
  "/group/addusergroup",
  middleware.auth,
  groupController.AddUserInGroup
);

router.get("/group/getallgroup", middleware.auth, groupController.GetAllgroup);

router.get(
  "/group/addrestgroupname/:id",
  middleware.auth,
  groupController.AddRestGroup
);

router.get(
  "/group/promoteadmin/:gid/:userid",
  middleware.auth,
  groupController.PromoteUserToAdmin
);

router.get(
  "/group/removeadmin/:gid/:userid",
  middleware.auth,
  groupController.PromoteAdminToUser
);

router.get(
  "/group/removeuser/:gid/:userid",
  middleware.auth,
  groupController.RemoveUserFromGroup
);

router.get(
  "/group/searchtext/:search",
  middleware.auth,
  groupController.SearchUser
);

module.exports = router;
