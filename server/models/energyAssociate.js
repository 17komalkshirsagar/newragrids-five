const mongoose = require("mongoose");

const associateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    contractCapacity: { type: String, required: true },

    // 🔒 Role remains same for all associates
    role: {
        type: String,
        default: "NewRa-energy associates",
        immutable: true
    },
    associateType: {
        type: String,
        enum: ["INDIVIDUAL", "COMPANY"],
        required: true
    },
    onboardType: {
        type: String,
        enum: ["CONSUMER", "SOLARFARM", "BOTH"],
        required: true
    },

    // 🏦 Bank Details
    bankDetails: {
        accountNumber: { type: String },
        ifsc: { type: String },
        bankName: { type: String },
        branch: { type: String },
        holderName: { type: String }
    },

    onboard: {
        consumers: [
            {
                consumerName: { type: String },
                consumerLoadCapacity: { type: String }
            }
        ],

        solarFarms: [
            {
                projectName: { type: String },
                location: {
                    coordinates: {
                        lat: { type: Number },
                        lng: { type: Number }
                    }
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
                landOwnership: { type: String, enum: ["OWN", "LEASE"] },
                landDocument: {
                    fileUrl: { type: String },
                    fileType: { type: String, enum: ["OWN", "LEASE"] }
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
            }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model("energyassociates", associateSchema);