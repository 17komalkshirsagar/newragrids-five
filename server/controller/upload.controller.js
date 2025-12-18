const multer = require("multer");
const User = require("../models/User");
const path = require("path");
const { cloudinary } = require("../utils/cloudinary.config");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();
const Upload = multer({ storage }).any();

const uploadFiles = async (req, res) => {
  try {
    Upload(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: "No files uploaded!" });

      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found!" });

      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                resource_type:
                  path.extname(file.originalname).toLowerCase() === ".pdf"
                    ? "raw"
                    : "auto", 
              },
              (error, result) => {
                if (error) return reject(error);
                resolve({
                  fileType: path.extname(file.originalname)
                    .replace(".", "")
                    .toLowerCase(),
                  url: result.secure_url,
                });
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          })
      );

      const uploadedResults = await Promise.all(uploadPromises);

      user.files.push(...uploadedResults);
      await user.save();

      res.json({
        message: "Files uploaded successfully!",
        uploadedFiles: uploadedResults,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { uploadFiles };
