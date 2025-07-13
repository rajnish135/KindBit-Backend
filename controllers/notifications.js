import { NotificationModel } from "../models/NotificationModel.js";

export async function getAllNotifications(req,res) {
    const notifications = await NotificationModel.find({userId:req.params.userId}).sort({ createdAt: -1 });
    return res.json(notifications);
}

export async function markAsRead(req,res) {
    await NotificationModel.updateMany( {userId:req.params.userId}, { isRead:true });
    return res.json({ success: true });
    
}