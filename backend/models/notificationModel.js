import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
  },
  text_content: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isSeen: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Notification = mongoose.model("notification", notificationSchema);
export default Notification;
