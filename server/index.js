const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: "./.env" });

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

app.use(express.json());
app.use(cookieParser());



app.use(
    cors({
        origin: [
            "https://www.newragrids.com",
            "https://newragrids-fourth-client.vercel.app",
            "http://localhost:8080",
        ],
        credentials: true,
    })
);




const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 50, // limit each IP
    message: { message: "Too many requests, please try again later." },
});
app.use(limiter);

app.use("/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/substations", require("./routes/admin.routes"));
app.use("/associates", require("./routes/associates.routes"));
app.use("/epc", require("./routes/epc.routes"));
app.use("/partners", require("./routes/partner.routes"));
app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource Not Found" });
});

app.use((err, req, res, next) => {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({
        message: "SERVER ERROR",
        error: err.message,
    });
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("✅ MONGO CONNECTED");
        app.listen(process.env.PORT, () => {
            console.log(`🚀 SERVER RUNNING ON PORT ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MONGO CONNECTION FAILED:", err.message);
    });