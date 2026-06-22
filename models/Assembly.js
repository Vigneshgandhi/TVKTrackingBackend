const mongoose = require("mongoose");
const assemblySchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    sessionNumber: {
        type: String,
        required: true
    },

    assemblyDate: {
        type: Date,
        required: true
    },

    category: {
        type: String,
        enum: [
            "Question Hour",
            "Bill Discussion",
            "Budget Session",
            "Minister Statement",
            "Resolution",
            "Inaugural Session",
            "Special Session"
        ],
        required: true
    },

    summary: {
        type: String,
        required: true
    },

    fullContent: {
        type: String,
        required: true
    },
    YoutubeLink: {
        type: String,
        required: false
    },
    ministersInvolved: [{
        type: String
    }],

    outcome: {
        type: String
    },

    status: {
        type: String,
        enum: [
            "Scheduled",
            "Completed",
            "Adjourned"
        ],
        default: "Completed"
    }

}, {

    timestamps: true

});

const Assembly = mongoose.model("Assembly",assemblySchema);  
module.exports = Assembly;