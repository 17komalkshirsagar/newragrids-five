const fs = require("fs");
const path = require("path");
const EnergyAssociate = require("../models/energyAssociate");
const { cloudinary } = require("../utils/cloudinary.config");
const { Upload } = require("../utils/upload");



exports.onboard = async (req, res) => {
  try {
    Upload(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });

      const associateId = req.params.id;

      const consumers = req.body.consumers ? JSON.parse(req.body.consumers) : [];
      const solarFarms = req.body.solarFarms ? JSON.parse(req.body.solarFarms) : [];

      const associate = await EnergyAssociate.findById(associateId);
      if (!associate) return res.status(404).json({ error: "User not found" });

      if (Array.isArray(consumers)) {
        consumers.forEach((c) => {
          if (c.consumerName || c.consumerLoadCapacity) {
            associate.onboard.consumers.push({
              consumerName: c.consumerName,
              consumerLoadCapacity: c.consumerLoadCapacity,
            });
          }
        });
      }

      for (let i = 0; i < solarFarms.length; i++) {
        const sf = solarFarms[i];

        const landFile = req.files?.find(
          (f) => f.fieldname === `landDocument_${i}`
        );

        if (!landFile) {
          return res.status(400).json({
            error: `Land document missing for solar farm index ${i}`,
          });
        }


        const fileUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type:
                path.extname(landFile.originalname).toLowerCase() === ".pdf"
                  ? "raw"
                  : "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );


          stream.end(landFile.buffer);
        });

        let finalSubstation = {};

        if (sf.substation.category === "MSEDCL") {
          finalSubstation = {
            category: "MSEDCL",
            taluka: sf.substation.taluka,
            district: sf.substation.district,
            substation: sf.substation.substation,
          };
        } else {
          finalSubstation = {
            category: "MSETCL",
            district: sf.substation.district,
            taluka: null,
            substation: sf.substation.substation,
          };
        }

        associate.onboard.solarFarms.push({
          projectName: sf.projectName,
          location: sf.location,
          capacity: sf.capacity,
          substation: finalSubstation,
          distanceFromSubstation: sf.distanceFromSubstation,
          landOwnership: sf.landOwnership,
          landDocument: {
            fileUrl,
            fileType: sf.landOwnership,
          },
          statusOfFarm: sf.statusOfFarm,
          statusOfLoan: sf.statusOfLoan,
          regulatoryStatus: sf.regulatoryStatus,
          tariffExpected: sf.tariffExpected,
          expectedCommissioningTimeline: sf.expectedCommissioningTimeline,
        });
      }

      await associate.save();

      return res.status(200).json({
        message: "Onboarding completed successfully",
        data: associate,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAssociateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await EnergyAssociate.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Associate not found"
      });
    }

    res.status(200).json({
      success: true,
      profile: user
    });

  } catch (error) {
    console.error("Error fetching associate profile:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};