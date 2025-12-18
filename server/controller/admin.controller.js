const EnergyPartner = require("../models/EnergyPartner");
const MSEDCLSUBSTATION = require("../models/MSEDCL");
const MSETCLSUBSTATION = require("../models/MSETCL");
const EnergyAssociate = require("../models/energyAssociate");
const EPC = require("../models/EPC");

exports.getAllSubstations = async (req, res) => {
    try {
        const data = await MSEDCLSUBSTATION.find();

        res.status(200).json({
            message: "Substation list fetched successfully",
            total: data.length,
            data,
        });
    } catch (error) {
        console.error("Error fetching substations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.MsetclSubstations = async (req, res) => {
    try {
        const data = await MSETCLSUBSTATION.find();

        res.status(200).json({
            message: "Substation list fetched successfully",
            total: data.length,
            data,
        });
    } catch (error) {
        console.error("Error fetching substations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllPartners = async (req, res) => {
    try {
        const partners = await EnergyPartner.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: "All partners fetched successfully",
            total: partners.length,
            data: partners
        });
    } catch (error) {
        console.error("Get All Partners Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllAssociates = async (req, res) => {
    try {
        const associates = await EnergyAssociate.find().select("-password");

        res.status(200).json({
            success: true,
            total: associates.length,
            associates: associates
        });

    } catch (error) {
        console.error("Error fetching associates:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

exports.getAllEPC = async (req, res) => {
    try {
        const users = await EPC.find().select("-password");

        return res.status(200).json({
            success: true,
            total: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};