const Notification = require("../model/notification");

const getNotificationsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const notifications = await Notification.find({ user_id: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    getNotificationsByUserId,
};