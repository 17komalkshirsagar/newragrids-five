const mongoose = require("mongoose");

const msedclSubstationSchema = new mongoose.Schema(
    {
        district: { type: String, required: true },
        taluka: { type: String, required: true },
        substation: { type: String, required: true },
        capacityMW: { type: Number, required: true }
    },
    { timestamps: true }
);


module.exports = mongoose.model(
    "MSEDCLSUBSTATION",
    msedclSubstationSchema,
    "MSEDCLSUBSTATION"
);
