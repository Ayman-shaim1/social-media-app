import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;
const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: String,
  },
  isOnline: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastConnection: {
    type: Date,
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      isAccepted: {
        type: Boolean,
        required: true,
        default: false,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      isAccepted: {
        type: Boolean,
        required: true,
        default: false,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  notifications: [
    {
      notification: {
        ref: "notification",
        type: Schema.Types.ObjectId,
      },
    },
  ],
  isPrivateAccount: {
    type: Boolean,
    required: true,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const crppassword = await bcrypt.hash(this.password, salt);
  this.password = crppassword;
  next();
});

const User = mongoose.model("user", userSchema);
export default User;
