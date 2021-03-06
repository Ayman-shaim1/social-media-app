import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

// @desc    Create notification
// @route   POST /api/notifications/:id
// @access  Private
export const createNotification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const newNotification = await Notification.create({
    user: user._id,
    title: req.body.title,
    text_content: req.body.text_content,
  });
  user.notifications.push({ notification: newNotification._id });
  await user.save();
  res.json(newNotification);
});

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const connectedUser = await User.findById(req.user.id).populate(
    "notifications.notification"
  );

  connectedUser.notifications.sort((a, b) => {
    return b.notification.date - a.notification.date;
  });

  res.json(connectedUser.notifications);
});

// @desc    Remove notification from notifications array
// @route   PUT /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const connectedUser = await User.findById(req.user.id);
  connectedUser.notifications = connectedUser.notifications.filter(
    (n) => String(n.notification) !== String(req.params.id)
  );
  await connectedUser.save();
  res.json({ message: "notification removed !" });
});

// @desc    seen all notifications
// @route   PUT /api/notifications/seen
// @access  Private
export const seenNotifications = asyncHandler(async (req, res) => {
  const connectedUser = await User.findById(req.user.id);
  await Notification.updateMany(
    {
      $and: [{ user: connectedUser._id }, { isSeen: false }],
    },
    {
      $set: {
        isSeen: true,
      },
    }
  );
  res.json({ message: "All notifications have been seen" });
});
