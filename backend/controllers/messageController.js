import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// @desc    Send message
// @route   POST /api/messages/:id
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    const user = await User.findById(req.params.id);
    if (user) {
      const newMessage = new Message({
        message_from: req.user.id,
        message_to: req.params.id,
        message_text: req.body.message_text || null,
        message_post: req.body.message_post || null,
      });

      const message = await newMessage.save();
      res.json(message);
    } else {
      res.status(404);
      throw new Error("User not found !");
    }
  } else {
    res.status(400);
    throw new Error("Somthing wrong");
  }
});

// @desc    Add user to delete users array
// @route   PUT /api/messages/:id
// @access  Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  const index = message.delete_users.findIndex(
    (m) => String(m.user) === String(req.user.id)
  );
  if (index === -1) {
    message.delete_users.push({ user: req.user.id });
    await message.save();
    res.json({ message: "message removed !" });
  } else {
    res.status(400);
    throw new Error("You already delete this message");
  }
});

// @desc    Get all messages between two users
// @route   GET /api/messages/:id
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
  const otherUser = await User.findById(req.params.id);
  if (otherUser) {
    const connectedUser = await User.findById(req.user.id);

    const messages = await Message.find({
      $and: [
        {
          $or: [
            {
              message_from: connectedUser._id,
              message_to: otherUser._id,
            },
            {
              message_to: connectedUser._id,
              message_from: otherUser._id,
            },
          ],
        },
        {
          "delete_users.user": {
            $ne: connectedUser._id,
          },
        },
      ],
    }).select("-delete_users");

    res.json(messages);
  } else {
    res.status(404);
    throw new Error("User not found !");
  }
});

// @desc    Get all convertations
// @route   GET /api/messages
// @access  Private
export const getLastMessages = asyncHandler(async (req, res) => {
  const connectedUser = await User.findById(req.user.id);
  const messages = await Message.find({
    $or: [
      { message_from: connectedUser._id },
      { message_to: connectedUser._id },
    ],
  })
    .populate("message_from")
    .populate("message_to")
    .sort({ message_date: "descending" });

  const message_to_send = [];

  for (let i = 0; i < messages.length; i++) {
    if (
      messages[i].delete_users.findIndex(
        (u) => String(u.user) === String(connectedUser._id)
      ) === -1
    ) {
      const index = message_to_send.findIndex(
        (m) =>
          String(m.user._id) === String(messages[i].message_to._id) ||
          String(m.user._id) === String(messages[i].message_from._id)
      );

      if (index === -1) {
        if (
          String(messages[i].message_from._id) !== String(connectedUser._id)
        ) {
          const nbr = await Message.find({
            $and: [
              {
                message_from: messages[i].message_from._id,
                message_to: connectedUser._id,
              },
              {
                isSeen: false,
              },
            ],
          }).count();

          message_to_send.push({
            user: {
              _id: messages[i].message_from._id,
              name: messages[i].message_from.name,
              avatar: messages[i].message_from.avatar,
            },
            message: {
              _id: messages[i]._id,
              message_text: messages[i].message_text,
              message_post: messages[i].message_post,
              message_date: messages[i].message_date,
              isSeen: messages[i].isSeen,
              nbr: nbr,
              isConnectedUserSeend: false,
            },
          });
        } else {
          const nbr = await Message.find({
            $and: [
              {
                message_from: messages[i].message_to._id,
                message_to: connectedUser._id,
              },
              {
                isSeen: false,
              },
            ],
          }).count();

          message_to_send.push({
            user: {
              _id: messages[i].message_to._id,
              name: messages[i].message_to.name,
              avatar: messages[i].message_to.avatar,
            },
            message: {
              _id: messages[i]._id,
              message_text: messages[i].message_text,
              message_post: messages[i].message_post,
              message_date: messages[i].message_date,
              isSeen: messages[i].isSeen,
              nbr: nbr,
              isConnectedUserSeend: true,
            },
          });
        }
      } else {
      }
    }
  }

  res.json(message_to_send);
});

// @desc    Get count of messages not seen
// @route   GET /api/messages/notseen/count
// @access  Private
export const getNotSeenCountMessages = asyncHandler(async (req, res) => {
  const nbr = await Message.find({
    $and: [{ message_to: req.user.id }, { isSeen: false }],
  }).count();

  res.json(nbr);
});

// @desc    Seen all messages in convertation
// @route   PUT /api/messages/seen/:id
// @access  Private
export const seenAllMessages = asyncHandler(async (req, res) => {
  console.log("Hello world");
  const otherUser = await User.findById(req.params.id);
  if (otherUser) {
    const connectedUser = await User.findById(req.user.id);
    await Messages[i].updateMany(
      {
        $and: [
          { isSeen: false },
          {
            $and: [
              { message_to: String(connectedUser._id) },
              { messsage_from: String(otherUser._id) },
            ],
          },
        ],
      },
      {
        $set: {
          isSeen: true,
        },
      }
    );
    res.json({ message: "All messages have been seen" });
  } else {
    res.status(404);
    throw new Error("User not found !");
  }
});
