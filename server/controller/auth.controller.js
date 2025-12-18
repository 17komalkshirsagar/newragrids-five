const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Auth = require('../models/Auth');
const { checkEmpty } = require('../utils/checkEmpty');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const Partner = require("../models/EnergyPartner");
const EnergyAssociate = require("../models/energyAssociate");
const EnergyPartner = require("../models/EnergyPartner");
const { cloudinary } = require("../utils/cloudinary.config");

const streamifier = require("streamifier");
const fs = require("fs");
const path = require("path");
const EPC = require('../models/EPC');
const { Upload } = require('../utils/upload');

// Register admin
exports.register = asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;

    const { isError, error } = checkEmpty({ name, email, mobile, password })
    if (isError) {
        return res.status(400).json({ message: "All Fields are required", error });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Strong Password" });
    }

    // Check if already registered
    const userExists = await Auth.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "Email Already Registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Auth.create({
        Name: name,
        email,
        mobile,
        password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
});
// Login with password
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password required" });
    }

    const user = await Auth.findOne({ email }).select("+password");
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: '1d' }
    );

    res.cookie("AdminToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    });

    const { password: _, ...safeUser } = user._doc; // ✅ password remove

    res.json({ message: "Login success", data: safeUser, token });
});
// Logout admin
exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: "Logout success" });
});







exports.userregister = asyncHandler(async (req, res) => {
    const { name, email, mobile, password, companyName, district } = req.body;

    // Basic empty check
    const { isError, error } = checkEmpty({ name, email, mobile, password, companyName, district });
    if (isError) {
        return res.status(400).json({ message: "All required fields must be filled", error });
    }

    // Email validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }

    // Mobile validation
    if (!validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }

    // Strong password validation
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide a Strong Password" });
    }

    // Check if already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "Email Already Registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
        Name: name,
        email,
        mobile,
        password: hashedPassword,
        companyName: companyName || "",
        district: district || "",
    });



    res.status(200).json({
        message: "User registered successfully",
        userId: newUser._id,
    });
});

// Login with password
exports.userlogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Issue JWT token
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: '1d' }
    );

    res.cookie("userToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    });
    res.json({ message: "Login success", data: user, token });
});
// Logout user
exports.userlogout = asyncHandler(async (req, res) => {
    res.clearCookie('userToken');
    res.json({ message: "Logout success" });
});






// User Profile Update
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params; // user id from route
    const { email, mobile, companyName, district } = req.body;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" });
    }

    // Validate mobile if provided
    if (mobile && !validator.isMobilePhone(mobile.toString(), "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile Number" });
    }

    // Check if new email is already taken by another user
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already in use" });
        }
    }

    // Update fields
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (companyName) user.companyName = companyName;
    if (district) user.district = district;

    await user.save();

    // Respond with updated info (only selected fields)
    const responseData = {
        Name: user.Name,
        email: user.email,
        mobile: user.mobile,
        companyName: user.companyName,
        district: user.district,
        files: user.files || []
    };

    res.json({ message: "Profile updated successfully", data: responseData });
});
// find customer
exports.Findcustomer = asyncHandler(async (req, res) => {
    try {
        const result = await User.find().select("-password");

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No customers found" });
        }

        res.status(200).json({
            message: "Customers fetched successfully",
            count: result.length,
            result,
        });

    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
});






// exports.registerPartner = async (req, res) => {

//     try {
//         Upload(req, res, async (err) => {
//             if (err) return res.status(400).json({ error: err.message });


//             let location = JSON.parse(req.body.location || "{}");
//             let capacity = JSON.parse(req.body.capacity || "{}");
//             let substation = JSON.parse(req.body.substation || "{}");
//             let expectedCommissioningTimeline = JSON.parse(
//                 req.body.expectedCommissioningTimeline || "{}"
//             );

//             const {
//                 name,
//                 email,
//                 mobile,
//                 address,password,
//                 projectName,
//                 distanceFromSubstation,
//                 landOwnership,
//                 statusOfFarm,
//                 statusOfLoan,
//                 regulatoryStatus,
//                 tariffExpected
//             } = req.body;

//             // FILE CHECK
//              const hashedPassword = await bcrypt.hash(password, 10);
//             const landFile = req.files?.find(
//                 (f) => f.fieldname === "landDocument"
//             );

//             if (!landFile) {
//                 return res.status(400).json({
//                     message: "landDocument file is required!"
//                 });
//             }

//             // CLOUDINARY UPLOAD
//             const uploadToCloudinary = () => {
//                 return new Promise((resolve, reject) => {
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

//                     fs.createReadStream(landFile.path).pipe(stream);
//                 });
//             };

//             const fileUrl = await uploadToCloudinary();

//            // ⭐ NEW SUBSTATION LOGIC BASED ON category
// let finalSubstation = {};

// if (substation.category === "MSEDCL") {
//     finalSubstation = {
//         category: "MSEDCL",
//         taluka: substation.taluka,
//         district: substation.district,     // ❌ WRONG
//         substation: substation.substation
//     };
// }

// if (substation.category === "MSETCL") {
//     finalSubstation = {
//         category: "MSETCL",
//         district: substation.district,
//         taluka: null,
//         substation: substation.substation
//     };
// }


//             // ⭐ SAVE TO DB
//             const partner = await EnergyPartner.create({
//                 name,
//                 email,
//                 mobile,
//                 address,
//                 projectName,
// password: hashedPassword,  
//                 location,
//                 capacity,
//                 substation: finalSubstation,

//                 distanceFromSubstation,
//                 landOwnership,

//                 landDocument: {
//                     fileUrl,
//                     fileType: landOwnership
//                 },

//                 statusOfFarm,
//                 statusOfLoan,
//                 regulatoryStatus,
//                 tariffExpected,
//                 expectedCommissioningTimeline
//             });

//             return res.status(201).json({
//                 message: "Partner Registered Successfully",
//                 partner
//             });
//         });
//     } catch (error) {
//         console.error("Upload error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
// partner login 


exports.registerPartner = async (req, res) => {
    try {
        Upload(req, res, async (err) => {
            if (err) return res.status(400).json({ error: err.message });

            let location = JSON.parse(req.body.location || "{}");
            let capacity = JSON.parse(req.body.capacity || "{}");
            let substation = JSON.parse(req.body.substation || "{}");
            let expectedCommissioningTimeline = JSON.parse(
                req.body.expectedCommissioningTimeline || "{}"
            );

            const {
                name,
                email,
                mobile,
                address,
                password,
                projectName,
                distanceFromSubstation,
                landOwnership,
                statusOfFarm,
                statusOfLoan,
                regulatoryStatus,
                tariffExpected
            } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const landFile = req.files?.find(
                (f) => f.fieldname === "landDocument"
            );

            if (!landFile) {
                return res.status(400).json({
                    message: "landDocument file is required!"
                });
            }

            // Cloudinary Upload - FIXED for Vercel
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

                // FIX: Use buffer instead of file path
                stream.end(landFile.buffer);
            });

            let finalSubstation = {};

            if (substation.category === "MSEDCL") {
                finalSubstation = {
                    category: "MSEDCL",
                    taluka: substation.taluka,
                    district: substation.district,
                    substation: substation.substation
                };
            } else if (substation.category === "MSETCL") {
                finalSubstation = {
                    category: "MSETCL",
                    district: substation.district,
                    taluka: null,
                    substation: substation.substation
                };
            }

            const partner = await EnergyPartner.create({
                name,
                email,
                mobile,
                address,
                projectName,
                password: hashedPassword,
                location,
                capacity,
                substation: finalSubstation,
                distanceFromSubstation,
                landOwnership,
                landDocument: {
                    fileUrl,
                    fileType: landOwnership
                },
                statusOfFarm,
                statusOfLoan,
                regulatoryStatus,
                tariffExpected,
                expectedCommissioningTimeline
            });

            return res.status(201).json({
                message: "Partner Registered Successfully",
                partner
            });
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.loginPartner = async (req, res) => {
    try {
        const { email, password } = req.body;

        // CHECK EMAIL
        const partner = await EnergyPartner.findOne({ email });
        if (!partner) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // CREATE JWT TOKEN
        const token = jwt.sign(
            { id: partner._id },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        // SET TOKEN IN HTTP-ONLY COOKIE
        res.cookie("partnerToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // REMOVE PASSWORD FROM RESPONSE
        const safePartner = {
            _id: partner._id,
            name: partner.name,
            email: partner.email,
            mobile: partner.mobile,
            address: partner.address,
            role: partner.role
        };

        return res.status(200).json({
            message: "Login successful",
            partner: safePartner
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//logout admin
exports.logoutPartner = asyncHandler(async (req, res) => {
    res.clearCookie('partnerToken');
    res.json({ message: "Logout success Partner" });
});




exports.registerAssociate = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            address,
            password,
            associateType,
            onboardType,
            contractCapacity
        } = req.body;

        /* -------------------- 1) Validate associateType -------------------- */
        if (!["INDIVIDUAL", "COMPANY"].includes(associateType)) {
            return res.status(400).json({
                error: "Invalid associateType. Use INDIVIDUAL or COMPANY"
            });
        }

        /* -------------------- 2) Validate onboardType -------------------- */
        if (!["CONSUMER", "SOLARFARM", "BOTH"].includes(onboardType)) {
            return res.status(400).json({
                error: "Invalid onboardType. Use CONSUMER, SOLARFARM or BOTH"
            });
        }

        /* -------------------- 3) Check if email already exists -------------------- */
        const existing = await EnergyAssociate.findOne({ email });
        if (existing) {
            return res.status(400).json({
                error: "Email already registered"
            });
        }

        /* -------------------- 4) Hash password -------------------- */
        const hashedPassword = await bcrypt.hash(password, 10);

        /* -------------------- 5) Create associate -------------------- */
        const newAssociate = await EnergyAssociate.create({
            name,
            email,
            mobile,
            address,
            password: hashedPassword,
            associateType,
            onboardType,
            contractCapacity
        });

        /* -------------------- 6) Safe response -------------------- */
        const safeResponse = {
            _id: newAssociate._id,
            name: newAssociate.name,
            email: newAssociate.email,
            mobile: newAssociate.mobile,
            address: newAssociate.address,
            associateType: newAssociate.associateType,
            onboardType: newAssociate.onboardType,
            contractCapacity: newAssociate.contractCapacity,
            role: newAssociate.role,
            createdAt: newAssociate.createdAt
        };

        return res.status(201).json({
            message: "Associate registered successfully",
            data: safeResponse
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};
// Login Associate
exports.loginAssociate = async (req, res) => {
    try {
        const { email, password } = req.body;

        /* -------------------- 1) Check email -------------------- */
        const associate = await EnergyAssociate.findOne({ email });
        if (!associate) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }

        /* -------------------- 2) Check password -------------------- */
        const isMatch = await bcrypt.compare(password, associate.password);
        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }

        /* -------------------- 3) Create JWT -------------------- */
        const token = jwt.sign(
            { id: associate._id },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        /* -------------------- 4) Set cookie -------------------- */
        res.cookie("associateToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        /* -------------------- 5) Same safe response as register -------------------- */
        const safeResponse = {
            _id: associate._id,
            name: associate.name,
            email: associate.email,
            mobile: associate.mobile,
            address: associate.address,
            associateType: associate.associateType,
            onboardType: associate.onboardType,
            contractCapacity: associate.contractCapacity,
            role: associate.role,
        };

        return res.status(200).json({
            message: "Login successful",
            data: safeResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
//logout Associate
exports.logoutAssociate = asyncHandler(async (req, res) => {
    res.clearCookie('associateToken');
    res.json({ message: "Logout success Associate" });
});



//register EPC
exports.registerepc = async (req, res) => {
    try {
        const { name, email, mobile, address, password } = req.body;

        const existing = await EPC.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await EPC.create({
            name,
            email,
            mobile,
            address,
            password: hashedPassword
        });

        user.password = undefined;

        res.status(201).json({
            success: true,
            message: "EPC Registered Successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// Login EPC
exports.loginEpc = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await EPC.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        user.password = undefined;

        // ⭐ Set cookie
        res.cookie("epcToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,   // optional
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
//logout EPC
exports.logoutEpc = asyncHandler(async (req, res) => {
    res.clearCookie('epcToken');
    res.json({ message: "Logout success EPC" });
});