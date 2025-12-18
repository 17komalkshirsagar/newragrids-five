const mongoose = require("mongoose");

const energyPartnersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: "NewRa-energy Partner",
        immutable: true
    },
    projectName: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        taluka: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true }
    },
    capacity: {
        ac: { type: String, required: false },
        dc: { type: String, required: false }
    },
    substation: {
        category: {
            type: String,
            enum: ["MSEDCL", "MSETCL"],
            required: true
        },

        taluka: {
            type: String
        },

        district: {
            type: String
        },

        substation: {
            type: String,
            required: true
        }
    },
    distanceFromSubstation: { type: String, required: false },
    landOwnership: {
        type: String,
        enum: ["OWN", "LEASE"],
        required: true
    },
    landDocument: {
        fileUrl: { type: String },
        fileType: {
            type: String,
            enum: ["OWN", "LEASE"],
        }
    },
    statusOfFarm: { type: String, required: false },
    statusOfLoan: { type: String, required: false },
    regulatoryStatus: { type: String, required: false },
    tariffExpected: { type: String, required: false },
    expectedCommissioningTimeline: {
        epcWorkStartDate: { type: String },
        injectionDate: { type: String },
        commercialOperationsDate: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model("energypartners", energyPartnersSchema);