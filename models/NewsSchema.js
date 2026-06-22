const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    article: {
        type: String,
        required: true
    },

    youtubeLink: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        required: true
    },

    tags: [{
        type: String
    }],

    createdBy: {
        type: String,
        default: "Admin"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "News",
    newsSchema
);