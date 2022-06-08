const { Router } = require("express");
const userController = require("../controllers/user-controller");

const router = Router();

router.post("/enter", userController.enter);

router.post("/getUser", userController.getUser);

router.get("/getUsers", userController.getUsers);

router.post("/getReceivedMessages", userController.getReceivedMessages);

router.post("/getSentMessages", userController.getSentMessages);

module.exports = router;
