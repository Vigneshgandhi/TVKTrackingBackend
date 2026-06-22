const mongoose = require("mongoose");
const announcementSchema =new mongoose.Schema({

    title: String,

    content: String,

    type: String,

    priority: String,

    publishedBy: {
        type: String,
        default: "Admin"
    }

}, {

    timestamps: true

});
module.exports = mongoose.model(
    "Announcement",
    announcementSchema
);