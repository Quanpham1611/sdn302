// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Tham chiếu đến model User
        required: true,
    },
    organization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization", // Tham chiếu đến model Organization
        required: true,
    },
    message: {
        type: String,
        default: "Bạn đã được mời vào tổ chức.", // Tin nhắn mặc định khi user được mời
    },
    status: {
        type: String,
        enum: ["unread", "read"], // Trạng thái thông báo
        default: "unread",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Notification", notificationSchema);
