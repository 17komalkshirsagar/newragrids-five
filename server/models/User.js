const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    district: { type: String, required: true },
    role: {
        type: String,
        default: "NewRa-energy Subscriber",
        immutable: true
    },
    files: [
        {
            fileType: { type: String },
            url: { type: String },
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
