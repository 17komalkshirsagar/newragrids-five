// const multer = require("multer");
// const path = require("path");


// const Storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueName + path.extname(file.originalname));
//     },
// });

// const Upload = multer({
//     storage: Storage,
//     limits: { fileSize: 20 * 1024 * 1024 },
// }).any();

// module.exports = { Upload };


const multer = require("multer");


const storage = multer.memoryStorage();

const Upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }
}).any();

module.exports = { Upload };
