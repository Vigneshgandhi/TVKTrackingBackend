const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    reportType: {
        type: String,
        required: true
    },

    period: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    achievements: {
        type: String,
        required: true
    },

    newsReferences: [{
        type: String
    }],

    publicFeedback: {
        type: String
    },

    challenges: {
        type: String
    },

    performanceScore: {
        type: Number,
        default: 0
    },

    recommendations: {
        type: String
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Report",
    reportSchema
);