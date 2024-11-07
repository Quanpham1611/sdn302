// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    organization: [{ // Add this field to reference the organization
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization" // Reference to the Organization model
    }],
    teams: [{ // Add this field to reference the teams
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team" // Reference to the Team model
    }]
});

// Hash password before saving user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("User", userSchema);