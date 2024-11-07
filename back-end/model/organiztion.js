const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Optional, if you want organization names to be unique
    },
    description: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user model
        required: true,
    },
    ownerBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user model
        required: true, // Make it required if you want
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team", // Reference to the team model
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Organization", organizationSchema);