const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
}, { timestamps: true })


const Auth = mongoose.model('Auth', AuthSchema)
module.exports = Auth