const express = require("express");
const { uploadFiles } = require("../controller/upload.controller");
const { Findcustomer, updateUserProfile } = require("../controller/auth.controller");
const router = express.Router();

router.post("/upload/:userId", uploadFiles);
router.get("/customers", Findcustomer);

router.put("/update/:id", updateUserProfile);
module.exports = router;


