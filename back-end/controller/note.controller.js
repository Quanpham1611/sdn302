// src/controllers/noteController.js
const Note = require("../model/Note");

const getNotes = async (req, res) => {
    const userId = req.userId; // Lấy userId từ middleware xác thực

    try {
        // Tìm tất cả các ghi chú được tạo bởi user này
        const notes = await Note.find({ createdBy: userId }).sort({ createdAt: -1 }); // Sắp xếp theo thứ tự mới nhất

        if (!notes || notes.length === 0) {
            return res.status(200).json({
                message: "No notes found for this user.",
                notes: []
            });
        }

        // Trả về danh sách ghi chú
        return res.status(200).json({
            message: "Notes retrieved successfully.",
            notes: notes
        });
    } catch (error) {
        console.error("Error retrieving notes:", error);
        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

module.exports = {
    getNotes,
};
