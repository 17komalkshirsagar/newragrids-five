const EnergyPartner = require("../models/EnergyPartner");


exports.getProfileById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await EnergyPartner.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            profile: user
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};