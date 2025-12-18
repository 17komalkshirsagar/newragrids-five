const express = require("express");
const { onboard, getAssociateProfile } = require("../controller/associates.controller");
const router = express.Router();

router.put("/onboard/:id", onboard);


router.get("/profile/:id", getAssociateProfile);

module.exports = router;


