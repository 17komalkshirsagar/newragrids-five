const express = require("express");
const { getProfileById } = require("../controller/patner.controller");
const router = express.Router();

router.get("/profile/partners/:id", getProfileById);

module.exports = router;