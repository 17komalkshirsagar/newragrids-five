const mongoose = require("mongoose");

const msedclSubstationSchema = new mongoose.Schema(
    {
        Substation: { type: String, required: true },
        District: { type: String, required: true },

        Latitude: { type: Number, required: true },
        Longitude: { type: Number, required: true },

        CapacityMW: { type: Number, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "MSETCLSUBSTATION",
    msedclSubstationSchema,
    "MSETCLSUBSTATION"
);
