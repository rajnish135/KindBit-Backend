import { NotificationModel } from "../models/NotificationModel.js";

export async function getAllNotifications(req, res) {
  
    try {
    const notifications = await NotificationModel.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }) // latest first
      .limit(20);              // only 20 latest
    return res.json(notifications);
  } 

  catch (err) {
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

export async function markAsRead(req, res) {
  
    try {
    await NotificationModel.updateMany(
      { userId: req.params.userId },
      { isRead: true }
    );
    return res.json({ success: true });
  } 
  
  catch (err) {
    return res.status(500).json({ message: "Failed to update notifications" });
  }
}
