import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import generateToken from "../utils/generateToken.js";
import path from "path";
import fs from "fs";

// @desc    Create new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password, avatarSrc } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    avatar: avatarSrc || "/images/user.png",
  });

  if (user) {
    res.status(201);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid email or password");
  }
});

// @desc    Update user name
// @route   PUT /api/users/name
// @access  Private
export const updateNameUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user password
// @route   PUT /api/users/name
// @access  Private
export const updatePassswordUser = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (user) {
    if (await bcrypt.compare(currentPassword, user.password)) {
      user.password = newPassword;
      await user.save();
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("the current password is wrong !");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatarUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    if (req.body.avatar) {
      const __dirname = path.resolve();
      const filepath = path.join(__dirname, user.avatar);
      fs.unlink(filepath, async (err) => {
        if (err) {
          user.avatar = req.body.avatar;
          await user.save();
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
          });
        } else {
          user.avatar = req.body.avatar;
          await user.save();
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
          });
        }
      });
    } else {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  private
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate(["followers.user", "following.user"])
    .select("-password -notifications");
  if (user) {
    const posts = await Post.find({ user: req.params.id }).populate("user");

    posts.sort((a, b) => {
      return b.date - a.date;
    });

    res.json({ ...user._doc, posts: posts });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by id
// @route   GET /api/users/find/:arg
// @access  private
export const findUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    $and: [
      {
        $or: [
          { email: { $regex: req.params.arg.toLowerCase(), $options: "i" } },
          { name: { $regex: req.params.arg, $options: "i" } },
        ],
      },
      {
        $or: [
          { email: { $ne: req.user.email } },
          { name: { $ne: req.user.name } },
        ],
      },
    ],
  }).select("-password -notifications");
  res.json(users);
});

// @desc    Follow other user
// @route   POST /api/users/follow/:id
// @access  Private
export const followUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -notifications"
  );

  if (user) {
    const index = user.followers.findIndex(
      (u) => String(u.user) === String(req.user.id)
    );

    if (index !== -1) {
      res.status(400);
      throw new Error("you already follow this user");
    } else {
      const connectedUser = await User.findById(req.user.id);
      user.followers.push({ user: req.user.id });
      connectedUser.following.push({ user: user._id });

      await connectedUser.save();
      await user.save();

      res.json({
        _id: user._id,
        followers: user.followers,
        following: user.following,
      });
    }
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Follow other user
// @route   GET /api/users/followers/requests/check/:id
// @access  Private
export const checkFollowRequestUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const index = user.following.findIndex(
      (u) => String(u.user) === String(req.user.id) && !u.isAccepted
    );
    if (index === -1) {
      res.json({
        message: "no this user is not trying to follow you",
        isRequest: false,
      });
    } else {
      res.json({
        message: "yes this user try to follow you",
        isRequest: true,
      });
    }
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Unfollow other user
// @route   DELETE /api/users/unfollow/:id
// @access  Private
export const unFollowUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -notifications"
  );

  if (user) {
    const connectedUser = await User.findById(req.user.id);
    const index = connectedUser.following.findIndex(
      (u) => String(u.user) === String(user._id)
    );
    if (index !== -1) {
      connectedUser.following = connectedUser.following.filter(
        (u) => String(u.user) !== String(user._id)
      );
      user.followers = user.followers.filter(
        (u) => String(u.user) !== String(connectedUser._id)
      );

      await connectedUser.save();
      await user.save();

      res.json({
        _id: user._id,
        followers: user.followers,
        following: user.following,
      });
    } else {
      res.status(400);
      throw new Error("you are not following this user you");
    }
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Accept user following
// @route   PUT /api/users/follow/accept/:id
// @access  Private
export const acceptUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -notifications"
  );
  if (user) {
    const connectedUser = await User.findById(req.user.id);
    const index = connectedUser.followers.findIndex(
      (u) => String(u.user) === String(user._id) && u.isAccepted === false
    );

    if (index !== -1) {
      connectedUser.followers = connectedUser.followers.map((item) => {
        if (String(item.user) === String(user._id)) {
          item.isAccepted = true;
        }
        return item;
      });
      user.following = user.following.map((item) => {
        if (String(item.user) === String(connectedUser._id)) {
          item.isAccepted = true;
        }
        return item;
      });
      user.save();
      connectedUser.save();

      const isFollow =
        user.followers.findIndex(
          (u) => String(u.user) === String(req.user.id)
        ) !== -1
          ? true
          : false;

      res.json({ _id: user._id, isFollow });
    } else {
      res.status(400);
      throw new Error("this user is not asking for following you");
    }
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Reject following user
// @route   PUT /api/users/follow/reject/:id
// @access  Private
export const rejectFollowingUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -notifications"
  );
  if (user) {
    const connectedUser = await User.findById(req.user.id);
    const index = connectedUser.followers.findIndex(
      (u) => String(u.user) === String(user._id) && u.isAccepted === false
    );

    if (index !== -1) {
      connectedUser.followers = connectedUser.followers.filter(
        (u) => String(u.user) !== String(user._id)
      );
      user.following = user.following.filter(
        (u) => String(u.user) !== String(connectedUser._id)
      );
      await user.save();
      await connectedUser.save();
      res.json(user);
    } else {
      res.status(400);
      throw new Error("this user is not asking for following you");
    }
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Remove user from user followers
// @route   DELETE /api/users/follow/remove/:id
// @access  Private
export const removeFollowingUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -notifications"
  );
  if (user) {
    const connectedUser = await User.findById(req.user.id);
    const index = connectedUser.followers.findIndex(
      (u) => String(u.user) === String(user._id) && u.isAccepted === true
    );

    if (index !== -1) {
      connectedUser.followers = connectedUser.followers.filter(
        (u) => String(u.user) !== String(user._id)
      );
      user.following = user.following.filter(
        (u) => String(u.user) !== String(connectedUser._id)
      );
      await connectedUser.save();
      await user.save();
      res.json({
        _id: user._id,
        followers: user.followers,
        following: user.following,
      });
    } else {
      res.status(400);
      throw new Error("this user is not following you");
    }
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Get followers requests list
// @route   GET /api/users/followers/requests
// @access  Private
export const getFollowersRequestsUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password -notifications")
    .populate("followers.user");

  if (user) {
    let requests = user.followers.filter((u) => !u.isAccepted);
    requests = requests.sort((a, b) => {
      return b.date - a.date;
    });
    res.json(requests);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get followers list
// @route   GET /api/users/followers/:id
// @access  Private
export const getFollowersUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("followers.user").select(
    "-password -notifications"
  );
  if (user) {
    res.json(user.followers.filter((u) => u.isAccepted));
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Get following user list
// @route   GET /api/users/following/:id
// @access  Private
export const getFollowingUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user.following.filter((u) => u.isAccepted));
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});
