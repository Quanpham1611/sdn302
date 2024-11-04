// models/Note.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    header: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Tham chiếu đến người dùng tạo note
        required: true,
    },
    estimateHours: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true, // Thêm createdAt và updatedAt tự động
});

// Middleware để tạo header tự động theo format THP1-id
noteSchema.pre("save", async function (next) {
    if (this.isNew) {
        const count = await mongoose.model("Note").countDocuments() + 1;
        this.header = `THP1-${count}`;
    }
    next();
});

module.exports = mongoose.model("Note", noteSchema);
