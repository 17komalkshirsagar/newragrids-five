const express = require("express");
const router = express.Router();

const { getAllSubstations, MsetclSubstations, getAllPartners, getAllAssociates, getAllEPC } = require("../controller/admin.controller");

router.get("/getAllSubstations", getAllSubstations);
router.get("/MsetclSubstations", MsetclSubstations);
router.get("/partners", getAllPartners);
router.get("/associates", getAllAssociates);
router.get("/epc", getAllEPC);

module.exports = router;