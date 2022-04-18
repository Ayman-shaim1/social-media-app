import mongoose from "mongoose";

const Schema = mongoose.Schema;
const messageSchema = Schema({
  message_from: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  message_to: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  message_text: {
    type: String,
  },
  message_post: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  message_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isSeen: {
    type: Boolean,
    required: true,
    default: false,
  },
  isSeen_Toast: {
    type: Boolean,
    required: true,
    default: false,
  },
  delete_users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
});

const Message = mongoose.model("message", messageSchema);
export default Message;
