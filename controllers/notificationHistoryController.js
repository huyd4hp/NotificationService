const NotificationHistoryModel = require("../models/notificationHistoryModel");

// create new notificationhistory
const createNotificationHistory = async (notificationUserData) => {
  try {
    const { user_id, status, type, message } = notificationUserData;

    const newNotification = {
      status,
      type,
      notification: message,
    };

    const notificationHistory = await NotificationHistoryModel.findOne({
      user_id,
    });

    if (notificationHistory) {
      notificationHistory.list_notification.push(newNotification);
      await notificationHistory.save();
    } else {
      const newNotificationHistory = new NotificationHistoryModel({
        user_id,
        list_notification: [newNotification],
      });
      await newNotificationHistory.save();
    }
  } catch (error) {
    console.error("Error creating NotificationHistory:", error);
  }
};

// get list notification by user
const getNotificationsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const notificationHistory = await NotificationHistoryModel.findOne({
      user_id,
    });

    if (!notificationHistory) {
      return res
        .status(404)
        .json({ error: `User: ${user_id} not have historical notification` });
    }

    const notifications = notificationHistory.list_notification;

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createNotificationHistory,
  getNotificationsByUserId,
};
