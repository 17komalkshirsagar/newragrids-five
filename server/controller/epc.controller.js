const User = require("../models/EPC");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { Upload } = require("../utils/upload");
const { cloudinary } = require("../utils/cloudinary.config");




// exports.addSolarFarm = async (req, res) => {
//     try {
//         Upload(req, res, async (err) => {
//             if (err) return res.status(400).json({ error: err.message });

//             const epcId = req.params.id;


//             let { farms } = req.body;


//             farms = JSON.parse(farms);


//             const epcUser = await User.findById(epcId);
//             if (!epcUser) {
//                 return res.status(404).json({ message: "EPC User Not Found" });
//             }


//             for (let i = 0; i < farms.length; i++) {

//                 let {
//                     projectName,
//                     location,
//                     capacity,
//                     substation,
//                     distanceFromSubstation,
//                     landOwnership,
//                     statusOfFarm,
//                     statusOfLoan,
//                     regulatoryStatus,
//                     tariffExpected,
//                     expectedCommissioningTimeline
//                 } = farms[i];

//                 if (location) location = JSON.parse(location);
//                 if (capacity) capacity = JSON.parse(capacity);
//                 if (substation) substation = JSON.parse(substation);
//                 if (expectedCommissioningTimeline)
//                     expectedCommissioningTimeline = JSON.parse(expectedCommissioningTimeline);

//                 const landFile = req.files?.find(
//                     (f) => f.fieldname === `landDocument_${i}`
//                 );

//                 if (!landFile) {
//                     return res.status(400).json({
//                         message: `landDocument ${i} file is required`
//                     });
//                 }


//                 const uploadFile = () => {
//                     return new Promise((resolve, reject) => {
//                         const stream = cloudinary.uploader.upload_stream(
//                             {
//                                 resource_type:
//                                     path.extname(landFile.originalname).toLowerCase() === ".pdf"
//                                         ? "raw"
//                                         : "auto",
//                             },
//                             (error, result) => {
//                                 if (error) return reject(error);
//                                 resolve(result.secure_url);
//                             }
//                         );

//                         fs.createReadStream(landFile.path).pipe(stream);
//                     });
//                 };

//                 const fileUrl = await uploadFile();


//                 let finalSubstation = {};
//                 if (substation.category === "MSEDCL") {
//                     finalSubstation = {
//                         category: "MSEDCL",
//                         taluka: substation.taluka,
//                         district: null,
//                         substation: substation.substation
//                     };
//                 } else if (substation.category === "MSETCL") {
//                     finalSubstation = {
//                         category: "MSETCL",
//                         district: substation.district,
//                         taluka: null,
//                         substation: substation.substation
//                     };
//                 }


//                 if (!["OWN", "LEASE"].includes(landOwnership)) {
//                     landOwnership = null;
//                 }

//                 let fileType = farms[i]?.landDocument?.fileType;
//                 if (!["OWN", "LEASE"].includes(fileType)) {
//                     fileType = landOwnership;
//                 }


//                 epcUser.solarFarms.push({
//                     projectName,
//                     location,
//                     capacity,
//                     substation: finalSubstation,
//                     distanceFromSubstation,
//                     landOwnership,
//                     landDocument: {
//                         fileUrl,
//                         fileType
//                     },
//                     statusOfFarm,
//                     statusOfLoan,
//                     regulatoryStatus,
//                     tariffExpected,
//                     expectedCommissioningTimeline
//                 });


//             }


//             await epcUser.save();

//             res.status(201).json({
//                 message: "All Solar Farms Added Successfully",
//                 farms: epcUser.solarFarms
//             });

//         });

//     } catch (error) {
//         console.error("Multi Solar Farm Add Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };




// exports.addSolarFarm = async (req, res) => {
//     try {
//         Upload(req, res, async (err) => {
//             if (err) return res.status(400).json({ error: err.message });

//             const epcId = req.params.id;
//             let { farms } = req.body;
//             farms = JSON.parse(farms);

//             const epcUser = await User.findById(epcId);
//             if (!epcUser) {
//                 return res.status(404).json({ message: "EPC User Not Found" });
//             }

//             for (let i = 0; i < farms.length; i++) {
//                 let {
//                     projectName,
//                     location,
//                     capacity,
//                     substation,
//                     distanceFromSubstation,
//                     landOwnership,
//                     statusOfFarm,
//                     statusOfLoan,
//                     regulatoryStatus,
//                     tariffExpected,
//                     expectedCommissioningTimeline
//                 } = farms[i];

//                 if (location) location = JSON.parse(location);
//                 if (capacity) capacity = JSON.parse(capacity);
//                 if (substation) substation = JSON.parse(substation);
//                 if (expectedCommissioningTimeline)
//                     expectedCommissioningTimeline = JSON.parse(expectedCommissioningTimeline);

//                 const landFile = req.files?.find(
//                     (f) => f.fieldname === `landDocument_${i}`
//                 );

//                 if (!landFile) {
//                     return res.status(400).json({
//                         message: `landDocument ${i} file is required`
//                     });
//                 }


//                 const fileUrl = await new Promise((resolve, reject) => {
//                     const stream = cloudinary.uploader.upload_stream(
//                         {
//                             resource_type:
//                                 path.extname(landFile.originalname).toLowerCase() === ".pdf"
//                                     ? "raw"
//                                     : "auto",
//                         },
//                         (error, result) => {
//                             if (error) return reject(error);
//                             resolve(result.secure_url);
//                         }
//                     );

//                     stream.end(landFile.buffer);
//                 });

//                 let finalSubstation = {};
//                 if (substation.category === "MSEDCL") {
//                     finalSubstation = {
//                         category: "MSEDCL",
//                         taluka: substation.taluka,
//                         district: null,
//                         substation: substation.substation
//                     };
//                 } else if (substation.category === "MSETCL") {
//                     finalSubstation = {
//                         category: "MSETCL",
//                         district: substation.district,
//                         taluka: null,
//                         substation: substation.substation
//                     };
//                 }

//                 if (!["OWN", "LEASE"].includes(landOwnership)) {
//                     landOwnership = null;
//                 }

//                 let fileType = farms[i]?.landDocument?.fileType;
//                 if (!["OWN", "LEASE"].includes(fileType)) {
//                     fileType = landOwnership;
//                 }

//                 epcUser.solarFarms.push({
//                     projectName,
//                     location,
//                     capacity,
//                     substation: finalSubstation,
//                     distanceFromSubstation,
//                     landOwnership,
//                     landDocument: {
//                         fileUrl,
//                         fileType
//                     },
//                     statusOfFarm,
//                     statusOfLoan,
//                     regulatoryStatus,
//                     tariffExpected,
//                     expectedCommissioningTimeline
//                 });
//             }

//             await epcUser.save();

//             res.status(201).json({
//                 message: "All Solar Farms Added Successfully",
//                 farms: epcUser.solarFarms
//             });

//         });

//     } catch (error) {
//         console.error("Multi Solar Farm Add Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };


// exports.addSolarFarm = async (req, res) => {
//     try {
//         Upload(req, res, async (err) => {
//             if (err) return res.status(400).json({ error: err.message });
//             console.log("start");

//             const epcId = req.params.id;
//             const epcUser = await User.findById(epcId);
//             if (!epcUser) return res.status(404).json({ message: "EPC User Not Found" });

//             const farm = JSON.parse(req.body.farm);
//             const landFile = req.files?.[0];

//             if (!landFile) return res.status(400).json({ message: "Land Document Required" });

//             console.log("upload start");
//             // Upload file
//             const uploadStream = () =>
//                 new Promise((resolveFile, rejectFile) => {
//                     const stream = cloudinary.uploader.upload_stream(
//                         { resource_type: "raw" },
//                         (error, result) => {
//                             if (error) return rejectFile(error);
//                             resolveFile(result.secure_url);
//                         }
//                     );
//                     stream.end(landFile.buffer);
//                 });

//             const fileUrl = await uploadStream();

//             console.log("upload end");

//             const solarFarmObj = {
//                 ...farm,
//                 landDocument: { fileUrl, fileType: farm.landOwnership },
//             };

//             epcUser.solarFarms.push(solarFarmObj);
//             await epcUser.save();

//             console.log("end");
//             return res.status(201).json({
//                 message: "Solar Farm Added Successfully",
//                 farm: solarFarmObj
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };


const runUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        Upload(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

exports.addSolarFarm = async (req, res) => {
    try {
        await runUpload(req, res);  // ensures proper async lifecycle

        console.log("start");

        const epcId = req.params.id;
        const epcUser = await User.findById(epcId);
        if (!epcUser) return res.status(404).json({ message: "EPC User Not Found" });

        const farm = JSON.parse(req.body.farm);
        const landFile = req.files?.[0];
        if (!landFile) return res.status(400).json({ message: "Land Document Required" });

        const fileUrl = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "raw" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            ).end(landFile.buffer);
        });

        const solarFarmObj = {
            ...farm,
            landDocument: { fileUrl, fileType: farm.landOwnership },
        };

        epcUser.solarFarms.push(solarFarmObj);
        await epcUser.save();

        return res.status(201).json({
            message: "Solar Farm Added Successfully",
            farm: solarFarmObj
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getEpcProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "EPC User Not Found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile Fetched Successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};