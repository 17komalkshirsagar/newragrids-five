const mongoose = require("mongoose");

const solarFarmSchema = new mongoose.Schema({
    projectName: { type: String },
    location: {
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        },
    },
    capacity: {
        ac: { type: String },
        dc: { type: String }
    },
    substation: {
        category: { type: String, enum: ["MSEDCL", "MSETCL"] },
        taluka: { type: String },
        district: { type: String },
        substation: { type: String }
    },
    distanceFromSubstation: { type: String },
    landOwnership: { type: String, enum: ["OWN", "LEASE"], default: "" },
    landDocument: {
        fileUrl: { type: String },
        fileType: { type: String, enum: ["OWN", "LEASE"], default: "" }
    },
    statusOfFarm: { type: String },
    statusOfLoan: { type: String },
    regulatoryStatus: { type: String },
    tariffExpected: { type: String },
    expectedCommissioningTimeline: {
        epcWorkStartDate: { type: String },
        injectionDate: { type: String },
        commercialOperationsDate: { type: String }
    }
});

const epcSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },

    solarFarms: [solarFarmSchema]
}, { timestamps: true });

module.exports = mongoose.model("EPC", epcSchema);