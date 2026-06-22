// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Assembly=require("./models/Assembly")
const Announcement = require("./models/Announcement");
const Report = require("./models/Reportschema");
const Scheme = require("./models/Scheme");
const jwt = require("jsonwebtoken");
const News = require("./models/NewsSchema");
const app = express();



app.use(express.json({limit:"100mb"}));

app.use(cookieParser());

app.use(cors({

    origin: "https://tvk-tracking2.vercel.app/",

    credentials: true

}));

/* =========================
   Session
========================= */

app.use(session({

    secret: "tvk_secret_key",

    resave: false,

    saveUninitialized: false,

    cookie: {

        httpOnly: true,

        secure: false,

        sameSite: "lax",

        maxAge: 1000 * 60 * 60 * 24

    }

}));

/* =========================
   MongoDB
========================= */

mongoose.connect(
    "mongodb+srv://vigneshgandhi15_db_user:wM2Ly3T5ruMQY0Vg@cluster0.itmrdey.mongodb.net/?appName=Cluster0/Tvk_tracking/"
)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((err) => {

    console.log(err);

});

/* =========================
   Admin Schema
========================= */

const adminSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }

}, {

    collection: "Admin"
});
const ministerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    portfolio: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    }

}, {
    timestamps: false,
    collection: "Ministers"
});

/* Model */

const Minister = mongoose.model("Minister", ministerSchema);
app.get("/api/ministers", async (req, res) => {

    try {

        const ministers = await Minister.find();

        res.status(200).json({
            success: true,
            count: ministers.length,
            data: ministers
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});
app.post("/api/news", async (req, res) => {

    try {

        const {

            title,
            article,
            youtubeLink,
            thumbnail,
            category,
            tags

        } = req.body;

        if (
            !title ||
            !article ||
            !youtubeLink ||
            !category
        ) {

            return res.status(400).json({

                success: false,
                message: "All fields are required"

            });

        }

        const news = await News.create({

            title,

            article,

            youtubeLink,

            thumbnail,

            category,

            tags: typeof tags === "string"
                ? tags.split(",").map(
                    tag => tag.trim()
                )
                : tags

        });

        res.status(201).json({

            success: true,

            message: "News Published Successfully",

            data: news

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
});

app.get("/api/news", async (req, res) => {

    try {

        const news = await News.find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: news.length,

            data: news

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
});

app.get("/api/news/:id", async (req, res) => {

    try {

        const news =
            await News.findById(
                req.params.id
            );

        if (!news) {

            return res.status(404).json({

                success: false,

                message: "News Not Found"

            });

        }

        res.status(200).json({

            success: true,

            data: news

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

app.put("/api/news/:id", async (req, res) => {

    try {

        const news =
            await News.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!news) {

            return res.status(404).json({

                success: false,

                message: "News Not Found"

            });

        }

        res.status(200).json({

            success: true,

            message: "News Updated",

            data: news

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
});

app.post(

    "/api/assembly",

    async (req, res) => {

        try {

            const assembly =
                await Assembly.create(
                    req.body
                );

            res.status(201).json({

                success: true,

                data: assembly

            });

        }
        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }

);

app.get(

    "/api/assembly",

    async (req, res) => {

        try {

            const sessions =
                await Assembly.find()

                    .sort({

                        createdAt: -1

                    });

            res.json({

                success: true,

                count:
                    sessions.length,

                data:
                    sessions

            });

        }
        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }

);

app.get(

    "/api/assembly/:id",

    async (req, res) => {

        try {

            const session =
                await Assembly.findById(

                    req.params.id

                );

            if (!session) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Assembly Session Not Found"

                });

            }

            res.json({

                success: true,

                data: session

            });

        }
        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }

);

app.put(

    "/api/assembly/:id",

    async (req, res) => {

        try {
            
            const session =
                await Assembly.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {

                        returnDocument:
                            "after",

                        runValidators:
                            true

                    }

                );

            if (!session) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Assembly Session Not Found"

                });

            }

            res.json({

                success: true,

                data: session

            });

        }
        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }

);

app.delete(

    "/api/assembly/:id",

    async (req, res) => {

        try {

            const session =
                await Assembly.findByIdAndDelete(

                    req.params.id

                );

            if (!session) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Assembly Session Not Found"

                });

            }

            res.json({

                success: true,

                message:
                    "Assembly Session Deleted"

            });

        }
        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }

);

app.delete("/api/news/:id", async (req, res) => {

    try {

        const news =
            await News.findByIdAndDelete(
                req.params.id
            );

        if (!news) {

            return res.status(404).json({

                success: false,

                message: "News Not Found"

            });

        }

        res.status(200).json({

            success: true,

            message: "News Deleted"

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});
const Admin = mongoose.model(
    "Admin",
    adminSchema
);

app.post("/api/schemes", async (req, res) => {

    try {

        const {

            name,
            shortDescription,
            fullDescription,
            category,
            budget,
            beneficiaries,
            launchDate,
            status,
            image

        } = req.body;

        if (
            !name ||
            !shortDescription ||
            !fullDescription ||
            !category ||
            !budget ||
            !beneficiaries ||
            !launchDate
        ) {

            return res.status(400).json({

                success: false,
                message: "All fields are required"

            });

        }

        const scheme = await Scheme.create({

            name,
            shortDescription,
            fullDescription,
            category,
            budget,
            beneficiaries,
            launchDate,
            status,
            image

        });

        res.status(201).json({

            success: true,
            message: "Scheme Added Successfully",
            data: scheme

        });

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({
            body: req.body,
            success: false,
            message: error.message

        });

    }
    console.log(req.body);
});
app.get("/api/schemes", async (req, res) => {

    try {

        const schemes = await Scheme.find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,
            count: schemes.length,
            data: schemes

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});
app.get("/api/schemes/:id", async (req, res) => {

    try {

        const scheme = await Scheme.findById(
            req.params.id
        );

        if (!scheme) {

            return res.status(404).json({

                success: false,
                message: "Scheme Not Found"

            });

        }

        res.status(200).json({

            success: true,
            data: scheme

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});

app.put("/api/schemes/:id", async (req, res) => {

    try {
        console.log(req.body);
        console.log(req.params.id);
        console.log("Updating scheme with ID:", req.params.id);
        const scheme = await Scheme.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                returnDocument: "after",
                runValidators: true

            }

        );

        if (!scheme) {

            return res.status(404).json({

                success: false,

                message: "Scheme not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Scheme updated successfully",

            data: scheme

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

app.delete("/api/schemes/:id", async (req, res) => {

    try {

        const scheme =
            await Scheme.findByIdAndDelete(
                req.params.id
            );
        
        if (!scheme) {

            return res.status(404).json({

                success: false,
                message: "Scheme Not Found"

            });

        }

        res.status(200).json({

            success: true,
            message: "Scheme Deleted Successfully"

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});
/* =========================
   LOGIN
========================= */

app.post("/api/admin/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        /* Validation */

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields required"

            });

        }

        /* Find Admin */

        const admin = await Admin.findOne({

            email: email

        });

        /* Check Email */

        if (!admin) {

            return res.status(401).json({

                success: false,

                message: "Invalid Email"

            });

        }

        /* Direct Password Compare */

        if (password !== admin.password) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password"

            });

        }

        /* JWT */

        const token = jwt.sign(

            {

                id: admin._id,

                email: admin.email

            },

            "tvk_jwt_secret",

            {

                expiresIn: "1d"

            }

        );

        /* Save Session */

        req.session.admin = {

            id: admin._id,

            email: admin.email

        };

        /* Cookie */

        res.cookie(

            "tvk_admin_token",

            token,

            {

                httpOnly: true,

                secure: false,

                sameSite: "lax",

                maxAge: 1000 * 60 * 60 * 24

            }

        );

        /* Response */

        res.status(200).json({

            success: true,

            message: "Login Successful",
            token: token,

            admin: {

                id: admin._id,

                email: admin.email

            }

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

/* =========================
   LOGOUT
========================= */

app.post("/api/admin/logout", (req, res) => {

    req.session.destroy(() => {

        res.clearCookie("tvk_admin_token");

        res.status(200).json({

            success: true,

            message: "Logout Successful"

        });

    });

});

/* =========================
   CHECK AUTH
========================= */

app.get("/api/admin/check-auth", (req, res) => {

    try {

        if (!req.session.admin) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"

            });

        }

        res.status(200).json({

            success: true,

            admin: req.session.admin

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

/* =========================
   Protected Middleware
========================= */

const isAuthenticated = (req, res, next) => {

    if (!req.session.admin) {

        return res.status(401).json({

            success: false,

            message: "Unauthorized"

        });

    }

    next();

};

/* =========================
   Protected Route Example
========================= */

app.get(
    "/api/admin/dashboard",
    isAuthenticated,
    (req, res) => {

        res.status(200).json({

            success: true,

            message: "Welcome Admin Dashboard"

        });

    }
);

/* =========================
   Server
========================= */
app.post("/api/announcements", async (req, res) => {

    try {

        const {
            title,
            content,
            type,
            priority
        } = req.body;

        if (
            !title ||
            !content ||
            !type ||
            !priority
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }

        const announcement =
            new Announcement({

                title,
                content,
                type,
                priority

            });

        await announcement.save();

        res.status(201).json({

            success: true,

            message:
                "Announcement Published Successfully",

            data: announcement

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

app.get("/api/announcements/", async (req, res) => {

    try {

        const announcement = await Announcement.find({});

        if (!announcement) {

            return res.status(404).json({

                success: false,
                message: "Announcement Not Found"

            });

        }

        res.status(200).json({

            success: true,
            data: announcement

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});

app.get("/api/announcements/:id", async (req, res) => {

    try {

        const announcement =
            await Announcement.findById(
                req.params.id
            );

        if (!announcement) {

            return res.status(404).json({

                success: false,
                message: "Announcement Not Found"

            });

        }

        res.status(200).json({

            success: true,
            data: announcement

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});

app.put("/api/announcements/:id", async (req, res) => {

    try {

        const updatedAnnouncement =
            await Announcement.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!updatedAnnouncement) {

            return res.status(404).json({

                success: false,
                message: "Announcement Not Found"

            });

        }

        res.status(200).json({

            success: true,
            message: "Announcement Updated",

            data: updatedAnnouncement

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});

app.get(
    "/api/stats",
    async (req, res) => {
        
        try {

            const [

                ministers,

                schemes,

                reports

            ] = await Promise.all([

                Minister.countDocuments(),

                Scheme.countDocuments(),

                Report.countDocuments()

            ]);

            res.status(200).json({

                success: true,

                data: {

                    ministers,

                    schemes,

                    reports,

                    transparency: 100

                }

            });

        }
        catch (error) {
            console.log(error);
            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);

app.get("/api/reports", async (req, res) => {

    try {

        const reports =
            await Report.find()
                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            success: true,

            count: reports.length,

            data: reports

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});
app.get("/api/reports/:id", async (req, res) => {

    try {
        const id=req.params.id
        const reports = await Report.findById(id)
        console.log(reports)
        res.status(200).json({

            success: true,
            data: reports

        });

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

app.post("/api/reports", async (req, res) => {

    try {

        const report =
            await Report.create(req.body);

        res.status(201).json({

            success: true,

            message:
                "Report Created Successfully",

            data: report

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

app.get("/api/reports", async (req, res) => {

    try {

        const reports =
            await Report.find()
                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            success: true,

            count: reports.length,

            data: reports

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

app.get("/",(req,res)=>{
    res.json({server:"activated",message:"verifyable",data_unleashed:"true"});
});
const PORT = 5000;

module.exports=app;
