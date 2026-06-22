const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    shortDescription: {
        type: String,
        required: true
    },

    fullDescription: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    budget: {
        type: String,
        required: true
    },

    beneficiaries: {
        type: String,
        required: true
    },

    launchDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Upcoming", "Active", "Completed"],
        default: "Upcoming"
    },

    image: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Scheme",
    schemeSchema
);