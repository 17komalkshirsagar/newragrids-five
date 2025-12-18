const express = require("express");
const router = express.Router();
const { addSolarFarm, getEpcProfile } = require("../controller/epc.controller");

router.post("/solarfarm/:id", addSolarFarm);
router.get("/profile/:id", getEpcProfile);

module.exports = router;