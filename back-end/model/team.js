const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Optional, if you want team names to be unique
    },
    description: {
        type: String,
        required: false,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization", // Reference to the organization model
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user model
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Team", teamSchema);